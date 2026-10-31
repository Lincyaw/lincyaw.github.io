#!/usr/bin/env node
// Generates the missing narration audio of one document (`node tools/voiceover.mjs papers/fse26`): starts
// `presmium serve` on the workspace and asks it over MCP, the same generation the Studio's "Generate voiceover" runs.
// The speech engine comes from the environment (PRESMIUM_SPEECH_<ENGINE>_URL, …); the workspace allows `spend`.
import { spawn } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'

const document = process.argv[2]
if (!document) {
  console.error('usage: node tools/voiceover.mjs <document directory>')
  process.exit(2)
}
const root = realpathSync(new URL('..', import.meta.url).pathname)
const stateFile = join(process.env.XDG_CACHE_HOME || join(homedir(), '.cache'), 'presmium', 'serve', createHash('sha256').update(root).digest('hex').slice(0, 16), 'server.json')

const serve = spawn('pnpm', ['exec', 'presmium', 'serve', '.'], { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] })
const stop = () => serve.kill('SIGINT')
process.on('exit', stop)
const mcp = await new Promise((resolve, reject) => {
  let text = ''
  serve.stdout.on('data', (chunk) => {
    text += chunk
    const match = /^mcp\s+(\S+)/m.exec(text)
    if (match) resolve(match[1])
  })
  serve.on('exit', code => reject(new Error(`presmium serve exited with ${code}`)))
})
const { token } = JSON.parse(readFileSync(stateFile, 'utf8'))
const client = new Client({ name: 'voiceover', version: '1.0.0' })
await client.connect(new StreamableHTTPClientTransport(new URL(mcp), { requestInit: { headers: { Authorization: `Bearer ${token}` } } }))

const call = async (name, args) => {
  const result = await client.callTool({ name, arguments: { document, ...args } })
  const text = result.content?.[0]?.text ?? ''
  if (result.isError) throw new Error(`${name}: ${text}`)
  return result.structuredContent ?? JSON.parse(text)
}

try {
  // The status reads the document's compiled IR: compile it first, then wait while the service is still assembling it.
  await client.readResource({ uri: `presmium://ir?document=${encodeURIComponent(document)}` })
  let status
  for (let attempt = 0; !status; attempt++) {
    try {
      status = await call('get_voiceover_status', {})
    } catch (error) {
      if (attempt >= 30 || !/"retryable": true/.test(String(error))) throw error
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  const missing = status.steps.filter(step => step.state !== 'ready' && step.state !== 'silent')
  console.log(`${document}: ${status.steps.length} steps, ${missing.length} need audio`)
  if (missing.length > 0) {
    const intent = randomUUID().replaceAll('-', '')
    let job = await call('start_voiceover', { request: { intent, source: status.source, revision: status.revision, scope: { kind: 'document' } } })
    while (['queued', 'running', 'cancelling'].includes(job.state ?? job.job?.state)) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const seen = await call('get_voiceover_job', { query: { intent } })
      job = seen.job ?? seen
      process.stdout.write(`\r${job.completed ?? 0}/${job.total ?? '?'} utterances`)
    }
    console.log(`\n${document}: ${job.state}${job.failed ? `, ${job.failed} failed` : ''}`)
    if (job.state !== 'done') process.exitCode = 1
  }
} finally {
  await client.close()
  stop()
}
