import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 5. DeathStarBench's hotel reservation services as RPCover recovers them from source (the paper's Fig. 7):
// nodes pop out one at a time and each `depend` edge draws with the call's accent. Then the count lands beside it,
// 149 of 149 gRPC calls found (Table II), with the five benchmark languages, and the end card. Then nothing moves.
const N = {
  frontend: [34, 21], search: [16, 21], rate: [7, 9], geo: [7, 33], recommendation: [34, 6], user: [51, 10], profile: [51, 32], reservation: [34, 36],
} as const
type K = keyof typeof N
const E: [K, K][] = [['search', 'rate'], ['search', 'geo'], ['search', 'frontend'], ['recommendation', 'frontend'], ['user', 'frontend'], ['profile', 'frontend'], ['reservation', 'frontend']]

let uid = 0

const CSS = `
  .graph { position: absolute; left: 3cqw; top: 6cqh; width: 58cqw; height: 66cqh; }
  .graph svg { width: 100%; height: 100%; overflow: visible; }
  .e { stroke: var(--acc); stroke-width: 0.35; fill: none; }
  .nd circle { fill: #f2c46b; stroke: var(--ink); stroke-width: 0.35; }
  .nd text { font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; font-size: 1.9px; text-anchor: middle; fill: var(--ink); }
  .res { left: 66cqw; top: 10cqh; width: 30cqw; height: 52cqh; padding: 2cqw; }
  .res .big { font-family: 'Silkscreen', monospace; font-size: 4.4cqw; color: var(--acc); line-height: 1; white-space: nowrap; }
  .res .u { font-weight: 600; font-size: 1.9cqw; margin-top: 1.2cqh; }
  .res .m { font-size: 1.35cqw; color: var(--muted); margin-top: 0.6cqh; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.6cqw; margin-top: 2.4cqh; }
  .chip { border: 0.18cqw solid var(--ink); background: var(--paper); font-family: 'Silkscreen', monospace; font-size: 1.15cqw; padding: 0.3cqw 0.7cqw; }
  .end { position: absolute; left: 4cqw; right: 4cqw; top: 76cqh; border-top: 0.2cqw solid var(--ink); padding-top: 2cqh; display: flex; justify-content: space-between; gap: 2cqw; }
  .end .t { font-weight: 600; font-size: 1.8cqw; }
  .end .a { font-size: 1.35cqw; color: var(--muted); margin-top: 0.6cqh; } .end .a b { color: var(--ink); }
  .end .v { text-align: right; font-family: 'Silkscreen', monospace; font-size: 1.4cqw; color: var(--acc); white-space: nowrap; }
  .end .v div + div { font-family: 'IBM Plex Mono', monospace; color: var(--muted); font-size: 1.2cqw; margin-top: 0.6cqh; }
  .gl { left: 3cqw; top: 3cqh; }
`

export default gsapScene(({ root, gsap, durations }) => {
  let n = 0
  const id = `sys${++uid}`
  const seg = (a: K, b: K) => {
    const [x1, y1] = N[a], [x2, y2] = N[b], d = Math.hypot(x2 - x1, y2 - y1), r = 2.4
    return `M ${x1 + (x2 - x1) / d * r} ${y1 + (y2 - y1) / d * r} L ${x2 - (x2 - x1) / d * (r + 0.5)} ${y2 - (y2 - y1) / d * (r + 0.5)}`
  }
  const label = (k: K) => {
    const [x, y] = N[k]
    if (k === 'search') return `<text x="${x + 1.2}" y="${y - 3}" style="text-anchor:start">${k}</text>`
    if (k === 'frontend') return `<text x="${x - 1.4}" y="${y + 4.6}" style="text-anchor:end">${k}</text>`
    return `<text x="${x}" y="${y + (y > 30 ? 5.2 : -3.4)}">${k}</text>`
  }
  const f = frame(root, CSS, `
    <div class="label gl">DeathStarBench · hotel reservation, from source</div>
    <div class="graph"><svg viewBox="0 0 58 40">
      <defs><marker id="${id}" viewBox="0 0 4 4" refX="3" refY="2" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#5b4b99" /></marker></defs>
      ${E.map(([a, b]) => `<path class="e e${n++}" d="${seg(a, b)}" marker-end="url(#${id})" />`).join('')}
      ${(Object.keys(N) as K[]).map(k => `<g class="nd"><circle cx="${N[k][0]}" cy="${N[k][1]}" r="2.4" />${label(k)}</g>`).join('')}
    </svg></div>
    <div class="card res"><div class="big"><span class="c">0</span> / 149</div><div class="u">gRPC calls found</div>
      <div class="m">DeathStarBench + RPCoverBench · Table II</div>
      <div class="m p">precision 99.33% · recall 100%</div>
      <div class="chips">${['C++', 'Java', 'Python', 'Go', 'TypeScript'].map(l => `<span class="chip">${l}</span>`).join('')}</div></div>
    <div class="end"><div><div class="t">RPCover: Recovering gRPC Dependency in Multilingual Projects</div>
      <div class="a"><b>Aoyang Fang</b>, Ruiyu Zhou, Xiaoying Tang, Pinjia He</div></div>
      <div class="v"><div>ASE 2023 · Distinguished Paper</div><div>github.com/CUHK-SE-Group/protoc-gen-scip</div></div></div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const c = pick(f, '.res .c')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.gl'), { autoAlpha: 0, duration: 0.3 }, 0)
    .from(q('.nd'), { autoAlpha: 0, scale: 0.3, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.28, ease: 'back.out(1.8)' }, 0.04 * D)
    .from(q('.e'), { drawSVG: 0, duration: 0.45, stagger: 0.3 }, 0.3 * D)
    .from(pick(f, '.res'), { autoAlpha: 0, xPercent: 8, duration: 0.5 }, 0.55 * D)
    .fromTo(c, { textContent: 0 }, { textContent: 149, snap: { textContent: 1 }, duration: 1.4, ease: 'expo.out' }, 0.58 * D)
    .from(q('.chip'), { autoAlpha: 0, duration: 0.25, stagger: 0.08 }, 0.66 * D)
    .from(pick(f, '.p'), { autoAlpha: 0, duration: 0.3 }, 0.62 * D)
    .from(pick(f, '.end'), { autoAlpha: 0, yPercent: 20, duration: 0.5 }, 0.78 * D)
    .set({}, {}, D)
  return tl
})
