import { defineScene } from '@lincyaw/addon-motion/scene'
import { arrow, C, caption, el, enter, label, lerp, MONO, PIXEL, SANS, span, stage, text } from './kit.ts'

// DiagGuard (Figure 6a) and what it buys (Figure 7a). `guard`: the unchanged agent (the Diagnostician) between an SLO
// alert and its answer; a Verifier self-audit before it, a Grounder's search-space profile feeding it, a Verifier
// soundness check after it snap into place in the order they act; the agent's search now reaches the infrastructure
// tier and the answer on the incident of Figure 6b flips from Ad to tidb-tikv-0. `gains`: the Acc@1 gain of each of
// the 14 configurations grows from zero (Qwen solid, Doubao hatched), then the title card.
const GAINS: [string, string, number, number][] = [
  ['AIOps 2025', 'ThinkDepth.ai', 6.5, 9.0],
  ['RCA100', 'GoS', 10.5, 15.8],
  ['', 'OpsAgent', 10.5, 5.3],
  ['', 'RCLAgent V2', 5.3, 7.0],
  ['', 'mABC', 21.1, 35.1],
  ['', 'OpenRCA', 19.3, 14.0],
  ['', 'ThinkDepth.ai', 3.5, 7.0],
]
const BX = 270, PP = 12

function block(parent: Element, head: string, body: string, w: number) {
  const g = el(parent, 'g')
  el(g, 'rect', { x: -w / 2 + 6, y: -30, width: w, height: 72, fill: C.ink })
  el(g, 'rect', { x: -w / 2, y: -36, width: w, height: 72, fill: C.white, stroke: C.guard, 'stroke-width': 3 })
  text(g, 0, -14, head.toUpperCase(), { 'text-anchor': 'middle', 'font-family': PIXEL, 'font-size': 16, fill: C.guard })
  text(g, 0, 13, body, { 'text-anchor': 'middle', 'font-size': 20 })
  return g
}

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const defs = el(svg, 'defs')
  const hatch = el(defs, 'pattern', { id: 'rca-hatch', width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' })
  el(hatch, 'rect', { width: 8, height: 8, fill: C.white })
  el(hatch, 'line', { x1: 0, y1: 0, x2: 0, y2: 8, stroke: C.guard, 'stroke-width': 4 })

  // The guarded loop.
  const loop = el(svg, 'g')
  const alert = el(loop, 'g')
  el(alert, 'path', { d: 'M 0 -34 L 32 22 L -32 22 Z', fill: C.white, stroke: C.gap, 'stroke-width': 4, 'stroke-linejoin': 'miter' })
  text(alert, 0, 4, '!', { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, fill: C.gap })
  label(alert, 0, 50, 'SLO alert', { 'text-anchor': 'middle', 'font-size': 15 })
  const diag = el(loop, 'g')
  el(diag, 'rect', { x: 386, y: 196, width: 440, height: 250, fill: C.ink })
  el(diag, 'rect', { x: 380, y: 190, width: 440, height: 250, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  text(diag, 400, 218, 'DIAGNOSTICIAN', { 'font-family': PIXEL, 'font-size': 18 })
  text(diag, 590, 218, '(the unchanged agent)', { 'font-size': 17, fill: C.muted })
  const tierRow = (y: number, name: string) => {
    const g = el(diag, 'g')
    el(g, 'rect', { x: 400, y: y - 26, width: 400, height: 52, fill: C.soft })
    text(g, 416, y, name, { 'font-size': 20, 'font-weight': 600 })
    const tick = text(g, 780, y, '✓', { 'text-anchor': 'end', 'font-size': 28, 'font-weight': 700, fill: C.right })
    return { g, tick }
  }
  const svc = tierRow(285, 'service tier')
  const infra = tierRow(375, 'infrastructure tier')
  const disk = text(diag, 416, 407, 'tidb-tikv-0 disk writes 15 → 105 Mbps', { 'font-size': 16, 'font-family': MONO, fill: C.gap })
  const audit = block(loop, 'Verifier', 'self-audit', 190)
  const grounder = block(loop, 'Grounder', 'search-space profile', 280)
  const sound = block(loop, 'Verifier', 'soundness check', 210)
  const links = [arrow(loop, C.ink, 3), arrow(loop, C.ink, 3), arrow(loop, C.guard, 3), arrow(loop, C.ink, 3)]
  const oldAns = el(loop, 'g')
  el(oldAns, 'rect', { x: -95, y: -24, width: 190, height: 48, fill: C.white, stroke: C.gap, 'stroke-width': 3 })
  text(oldAns, 0, 1, 'Ad ✗', { 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 700, fill: C.gap })
  const strike = el(oldAns, 'line', { x1: -70, y1: 1, x2: 70, y2: 1, stroke: C.ink, 'stroke-width': 3 })
  const newAns = el(loop, 'g')
  el(newAns, 'rect', { x: -95 + 5, y: -24 + 5, width: 190, height: 48, fill: C.ink })
  el(newAns, 'rect', { x: -95, y: -24, width: 190, height: 48, fill: C.white, stroke: C.right, 'stroke-width': 4 })
  text(newAns, 0, 1, 'tidb-tikv-0 ✓', { 'text-anchor': 'middle', 'font-size': 23, 'font-weight': 700, fill: C.right })
  const ansLabel = label(loop, 1165, 250, 'answer', { 'text-anchor': 'middle', 'font-size': 15 })

  // The gains chart.
  const chart = el(svg, 'g')
  label(chart, 40, 50, 'Acc@1 gain with DiagGuard, points', { 'font-size': 17, fill: C.ink })
  const axis = el(chart, 'g')
  ;[0, 10, 20, 30, 40].forEach(v => {
    el(axis, 'line', { x1: BX + v * PP, x2: BX + v * PP, y1: 80, y2: 560, stroke: v ? C.line : C.ink, 'stroke-width': v ? 1.5 : 3 })
    text(axis, BX + v * PP, 582, `+${v}`, { 'text-anchor': 'middle', 'font-size': 16, fill: C.muted, 'font-family': MONO })
  })
  const bars: { rect: SVGRectElement; val: SVGTextElement; v: number; pass: number; y: number }[] = []
  let y = 100
  GAINS.forEach(([group, name, q, d]) => {
    if (group) { label(chart, 40, y, group, { 'font-size': 15, fill: C.guard }); y += 26 }
    text(chart, BX - 14, y + 19, name, { 'text-anchor': 'end', 'font-size': 18, 'font-weight': 600 })
    ;[[q, 0], [d, 1]].forEach(([v, pass]) => {
      const by = y + (pass ? 21 : 0)
      const rect = el(chart, 'rect', { x: BX, y: by, height: 17, fill: pass ? 'url(#rca-hatch)' : C.guard, stroke: C.guard, 'stroke-width': 1.5 })
      const val = text(chart, 0, by + 9, `+${v!.toFixed(1)}`, { 'font-size': 15, 'font-family': MONO, fill: C.ink })
      bars.push({ rect, val, v: v!, pass: pass!, y: by })
    })
    y += 58
  })
  const legend = el(chart, 'g')
  el(legend, 'rect', { x: 0, y: -8, width: 22, height: 16, fill: C.guard })
  text(legend, 30, 1, 'Qwen', { 'font-size': 16 })
  el(legend, 'rect', { x: 92, y: -8, width: 22, height: 16, fill: 'url(#rca-hatch)', stroke: C.guard, 'stroke-width': 1.5 })
  text(legend, 122, 1, 'Doubao', { 'font-size': 16 })
  legend.setAttribute('transform', 'translate(520 50)')
  text(chart, 40, 620, 'Fig. 7a · AIOps 2025 and RCA100, two backbones, six frameworks', { 'font-size': 15, fill: C.muted, 'font-family': MONO })

  const card = el(svg, 'g')
  el(card, 'rect', { x: 8, y: 8, width: 400, height: 470, fill: C.ink })
  el(card, 'rect', { x: 0, y: 0, width: 400, height: 470, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  text(card, 28, 52, 'Beyond Fault', { 'font-size': 38, 'font-weight': 700 })
  text(card, 28, 98, 'Localization', { 'font-size': 38, 'font-weight': 700 })
  ;['A Trajectory-Level Study of LLM Agents', 'for Microservice Root Cause Analysis'].forEach((s, i) =>
    text(card, 28, 148 + i * 28, s, { 'font-size': 19, fill: C.muted }))
  const authors = [['Qisheng Lu, ', 'Aoyang Fang', ','], ['Junjielong Xu, Jin\'ao Shang,'], ['Songhan Zhang, Yifan Yang,'], ['Xiaochuan Yan, Pinjia He']]
  authors.forEach((parts, i) => {
    const t = text(card, 28, 236 + i * 30, '', { 'font-size': 19 })
    parts.forEach((p, j) => {
      const s = el(t, 'tspan', { 'font-family': SANS, ...(parts.length === 3 && j === 1 ? { 'font-weight': 700 } : {}) })
      s.textContent = p
    })
  })
  text(card, 28, 400, 'ARXIV 2608.21310 · 2026', { 'font-family': PIXEL, 'font-size': 18, fill: C.guard })
  text(card, 28, 434, 'arxiv.org/abs/2608.21310', { 'font-size': 17, fill: C.muted, 'font-family': MONO })

  const line = caption(svg, [
    [at(0) + 300, 'Grounder maps the data; Verifier checks plan and answer.'],
    [at(0) + 3500, 'Same incident: the agent finds tidb-tikv-0.'],
    [at(1) + 3400, 'Acc@1 rises in all 14 setups: +3.5 to +35.1 points.'],
  ])

  return (ms: number) => {
    const t0 = ms - at(0), t1 = ms - at(1)
    line(ms)
    const out = 1 - enter(t1, 0, 250)
    loop.setAttribute('opacity', String(out))
    loop.setAttribute('visibility', out > 0 ? 'visible' : 'hidden')

    const base = enter(t0, 0, 450)
    alert.setAttribute('transform', 'translate(70 300)')
    alert.setAttribute('opacity', String(base))
    diag.setAttribute('opacity', String(base))
    svc.g.setAttribute('opacity', String(base))
    svc.tick.setAttribute('opacity', String(base))
    // The three defenses snap in, in the order they act.
    const place = (g: SVGGElement, x: number, yy: number, start: number) => {
      const p = enter(t0, start, 380)
      g.setAttribute('transform', `translate(${x} ${yy - (1 - p) * 30})`)
      g.setAttribute('opacity', String(p))
    }
    place(audit, 230, 300, 700)
    place(grounder, 600, 104, 1300)
    place(sound, 960, 300, 1900)
    links[0]!.set(104, 300, 130, 300, span(t0, 900, 250))
    links[1]!.set(330, 300, 375, 300, span(t0, 950, 250))
    links[2]!.set(600, 142, 600, 186, span(t0, 1500, 250))
    links[3]!.set(825, 300, 850, 300, span(t0, 2100, 250))
    // The search reaches the infrastructure tier; the answer flips.
    const inf = enter(t0, 2600, 400)
    infra.g.setAttribute('opacity', String(lerp(0.25, 1, inf)))
    infra.tick.setAttribute('opacity', String(enter(t0, 3000, 250)))
    disk.setAttribute('opacity', String(enter(t0, 3000, 400)))
    const flip = span(t0, 3500, 600)
    oldAns.setAttribute('transform', `translate(1165 ${lerp(300, 380, flip)})`)
    oldAns.setAttribute('opacity', String(base * lerp(1, 0.45, flip)))
    strike.setAttribute('opacity', String(flip))
    const na = enter(t0, 3900, 400)
    newAns.setAttribute('transform', `translate(1165 ${300 - (1 - na) * 16})`)
    newAns.setAttribute('opacity', String(na))
    ansLabel.setAttribute('opacity', String(base))

    // Gains: the chart enters as the loop leaves; Qwen bars, then Doubao bars, grow from zero.
    const c = enter(t1, 150, 400)
    chart.setAttribute('opacity', String(c))
    chart.setAttribute('visibility', c > 0 ? 'visible' : 'hidden')
    bars.forEach((b, i) => {
      const k = Math.floor(i / 2)
      const p = span(t1, (b.pass ? 1900 : 500) + k * 120, 700)
      const w = b.v * PP * p
      b.rect.setAttribute('width', String(w))
      b.val.setAttribute('x', String(BX + w + 8))
      b.val.setAttribute('opacity', String(p > 0.95 ? 1 : 0))
    })
    const tc = enter(t1, 3600, 500)
    card.setAttribute('transform', `translate(${lerp(860, 830, tc)} 80)`)
    card.setAttribute('opacity', String(tc))
  }
})
