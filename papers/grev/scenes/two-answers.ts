import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 1. The RedisGraph bug of Listing 1 (issue #3093), drawn as the pattern both queries ask for: A→B:L1, A→C,
// D:L2→C and the loop D→D. Route 1 walks A→B, then A→C, then D→C, then the loop; route 2 walks C←A→B in one go,
// then D→C, then the loop. Same pattern, same data, two counts: 7 and 8.
let uid = 0

const CSS = `
  .panel { top: 15cqh; width: 38cqw; height: 46cqh; }
  .panel.l { left: 8cqw; } .panel.r { right: 8cqw; }
  .panel .tag { position: absolute; left: 1.4cqw; top: 1.2cqh; font-family: 'Silkscreen', monospace; font-size: 1.5cqw; color: var(--muted); }
  .panel svg { position: absolute; left: 2cqw; right: 2cqw; top: 5cqh; width: calc(100% - 4cqw); height: 39cqh; overflow: visible; }
  .e { stroke: var(--ink); stroke-width: 0.35; fill: none; }
  .w { stroke: var(--acc); stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
  .nd circle { fill: var(--white); stroke: var(--ink); stroke-width: 0.4; }
  .nd text { font-family: 'Silkscreen', monospace; font-size: 2.6px; text-anchor: middle; fill: var(--ink); }
  .lab { font-family: 'Silkscreen', monospace; font-size: 1.9px; fill: var(--muted); text-anchor: middle; }
  .num circle { fill: var(--acc); } .num text { font-family: 'Silkscreen', monospace; font-size: 2px; fill: var(--white); text-anchor: middle; }
  .same { position: absolute; left: 46cqw; width: 8cqw; top: 31cqh; text-align: center; font-size: 5cqw; font-weight: 600; }
  .badge { position: absolute; top: 65cqh; width: 11cqw; height: 11cqw; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: var(--white); border: 0.22cqw solid var(--ink); box-shadow: 0.55cqw 0.55cqw 0 var(--ink); }
  .badge.l { left: 21.5cqw; } .badge.r { right: 21.5cqw; }
  .badge .n { font-family: 'Silkscreen', monospace; font-size: 5.6cqw; line-height: 1; }
  .badge .u { font-family: 'Silkscreen', monospace; font-size: 1.2cqw; color: var(--muted); margin-top: 0.6cqh; }
  .neq { position: absolute; left: 45cqw; width: 10cqw; top: 67cqh; text-align: center; font-family: 'Silkscreen', monospace; font-size: 5cqw; color: var(--warn); }
  .db { left: 0; right: 0; text-align: center; top: 6cqh; }
  .caption { bottom: 3cqh; }
  .src { top: 2cqh; bottom: auto; }
`

// the pattern, in the panel's 40 × 30 box
export const P = { A: [8, 7], B: [32, 7], C: [8, 24], D: [26, 24] } as const
export type K = keyof typeof P
const R = 3.2
export function seg(a: K, b: K) {
  const [x1, y1] = P[a], [x2, y2] = P[b], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d
  return `M ${x1 + ux * R} ${y1 + uy * R} L ${x2 - ux * (R + 0.5)} ${y2 - uy * (R + 0.5)}`
}
export const LOOP = `M ${P.D[0] + 2.4} ${P.D[1] - 2.2} C ${P.D[0] + 10} ${P.D[1] - 8}, ${P.D[0] + 11} ${P.D[1] + 6}, ${P.D[0] + 3.2} ${P.D[1] + 0.8}`

export function pattern(id: string, walks: { d: string, at: [number, number] }[]) {
  const nodes = (Object.keys(P) as K[]).map(k => `<g class="nd"><circle cx="${P[k][0]}" cy="${P[k][1]}" r="${R}" /><text x="${P[k][0]}" y="${P[k][1] + 0.95}">${k}</text></g>`).join('')
  return `<svg viewBox="0 0 40 30" preserveAspectRatio="xMidYMid meet">
    <defs><marker id="${id}" viewBox="0 0 4 4" refX="3" refY="2" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#17171c" /></marker></defs>
    <path class="e" d="${seg('A', 'B')}" marker-end="url(#${id})" /><path class="e" d="${seg('A', 'C')}" marker-end="url(#${id})" />
    <path class="e" d="${seg('D', 'C')}" marker-end="url(#${id})" /><path class="e" d="${LOOP}" marker-end="url(#${id})" />
    ${walks.map((w, i) => `<path class="w w${i}" d="${w.d}" />`).join('')}
    ${nodes}
    <text class="lab" x="${P.B[0]}" y="${P.B[1] + 6.2}">L1</text><text class="lab" x="${P.D[0]}" y="${P.D[1] + 6.2}">L2</text>
    ${walks.map((w, i) => `<g class="num n${i}"><circle cx="${w.at[0]}" cy="${w.at[1]}" r="1.7" /><text x="${w.at[0]}" y="${w.at[1] + 0.75}">${i + 1}</text></g>`).join('')}
  </svg>`
}

// route 1: A→B, then A→C, then D→C, then the loop; route 2: C←A→B in one walk, then D→C, then the loop
export const route1 = [
  { d: seg('A', 'B'), at: [20, 4.2] as [number, number] }, { d: seg('A', 'C'), at: [5.2, 15.5] as [number, number] },
  { d: seg('D', 'C'), at: [17, 27] as [number, number] }, { d: LOOP, at: [37.5, 24] as [number, number] },
]
export const route2 = [
  { d: `M ${P.C[0]} ${P.C[1] - R} L ${P.A[0]} ${P.A[1]} L ${P.B[0] - R - 0.5} ${P.B[1]}`, at: [5.2, 15.5] as [number, number] },
  { d: seg('D', 'C'), at: [17, 27] as [number, number] }, { d: LOOP, at: [37.5, 24] as [number, number] },
]

export const CSS_PATTERN = `
  .e { stroke: var(--ink); stroke-width: 0.35; fill: none; }
  .w { stroke: var(--acc); stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
  .nd circle { fill: var(--white); stroke: var(--ink); stroke-width: 0.4; }
  .nd text { font-family: 'Silkscreen', monospace; font-size: 2.6px; text-anchor: middle; fill: var(--ink); }
  .lab { font-family: 'Silkscreen', monospace; font-size: 1.9px; fill: var(--muted); text-anchor: middle; }
  .num circle { fill: var(--acc); } .num text { font-family: 'Silkscreen', monospace; font-size: 2px; fill: var(--white); text-anchor: middle; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const id = `two${++uid}`
  const f = frame(root, CSS, `
    <div class="label db">RedisGraph · same data · same pattern</div>
    <div class="card panel l"><div class="tag">query 1</div>${pattern(`${id}a`, route1)}</div>
    <div class="same">≡</div>
    <div class="card panel r"><div class="tag">query 2</div>${pattern(`${id}b`, route2)}</div>
    <div class="badge l"><div class="n">0</div><div class="u">count</div></div>
    <div class="badge r"><div class="n">0</div><div class="u">count</div></div>
    <div class="neq">≠</div>
    <div class="caption cap1">Query 1 matches A→B, then A→C, then D’s two edges</div>
    <div class="caption cap2">Query 2 matches C←A→B in one walk, then D’s edges</div>
    <div class="caption cap3">RedisGraph counts 7 matches for query 1, 8 for query 2</div>
    <div class="src">Listing 1 · RedisGraph issue #3093</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const [n1, n2] = [pick(f, '.badge.l .n'), pick(f, '.badge.r .n')]
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.db'), { autoAlpha: 0, duration: 0.4 }, 0)
    .from(q('.panel'), { autoAlpha: 0, yPercent: 6, duration: 0.5, stagger: 0.15 }, 0.1)
    .from(pick(f, '.same'), { autoAlpha: 0, scale: 0.6, duration: 0.4 }, 0.5)
    .from(pick(f, '.cap1'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.08 * D)
  // the walks, in order: route 1 left, then route 2 right
  const step = 0.5 * D / 7
  q('.panel.l .w').forEach((w, i) => {
    tl.from(w, { drawSVG: 0, duration: step * 0.9, ease: 'power1.inOut' }, 0.08 * D + i * step)
      .from(q('.panel.l .num')[i], { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0.08 * D + i * step)
  })
  q('.panel.r .w').forEach((w, i) => {
    tl.from(w, { drawSVG: 0, duration: step * 0.9, ease: 'power1.inOut' }, 0.08 * D + (4 + i) * step)
      .from(q('.panel.r .num')[i], { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0.08 * D + (4 + i) * step)
  })
  tl.to(pick(f, '.cap1'), { autoAlpha: 0, duration: 0.25 }, 0.08 * D + 4 * step - 0.25)
    .from(pick(f, '.cap2'), { autoAlpha: 0, yPercent: 40, duration: 0.3 }, 0.08 * D + 4 * step)
    .to(pick(f, '.cap2'), { autoAlpha: 0, duration: 0.25 }, 0.54 * D)
    .from(pick(f, '.cap3'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.56 * D)
    .from(q('.badge'), { autoAlpha: 0, yPercent: 15, duration: 0.4, stagger: 0.1 }, 0.54 * D)
    .fromTo(n1, { textContent: 0 }, { textContent: 7, snap: { textContent: 1 }, duration: 0.9, ease: 'expo.out' }, 0.58 * D)
    .fromTo(n2, { textContent: 0 }, { textContent: 8, snap: { textContent: 1 }, duration: 0.9, ease: 'expo.out' }, 0.68 * D)
    .to(q('.badge'), { borderColor: '#b93a0b', boxShadow: '0.55cqw 0.55cqw 0 #b93a0b', duration: 0.3 }, 0.8 * D)
    .to([n1, n2], { color: '#b93a0b', duration: 0.3 }, 0.8 * D)
    .from(pick(f, '.neq'), { autoAlpha: 0, scale: 1.6, duration: 0.35, ease: 'back.out(2)' }, 0.8 * D)
    .from(pick(f, '.src'), { autoAlpha: 0, duration: 0.4 }, 0.82 * D)
    .set({}, {}, D)
  return tl
})
