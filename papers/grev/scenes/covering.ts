import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 3 (the turn). The question of the paper's Fig. 2 ("software developers known by Alice and Bob") drawn as
// its pattern: v1 person Alice → v2 person ← v3 person Bob, v2 → v4 software. Covering 1 (the paper's): an amber walk
// v1→v2→v4, then a violet walk v3→v2. Covering 2 walks the same edges another way: v3→v2→v4, then v1→v2. Each
// covering lands as a small card on the right: the same question, a different route.
let uid = 0

const V = { v1: [11, 15], v2: [30, 15], v3: [49, 15], v4: [30, 29] } as const
type K = keyof typeof V
const R = 3.2
function seg(a: K, b: K) {
  const [x1, y1] = V[a], [x2, y2] = V[b], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d
  return `M ${(x1 + ux * R).toFixed(2)} ${(y1 + uy * R).toFixed(2)} L ${(x2 - ux * (R + 0.6)).toFixed(2)} ${(y2 - uy * (R + 0.6)).toFixed(2)}`
}
// a walk through several nodes, as one stroke
function walk(...ks: K[]) {
  return ks.slice(1).map((k, i) => seg(ks[i], k)).join(' ')
}
const COVER = {
  c1: [{ d: walk('v1', 'v2', 'v4'), at: V.v1, cls: 'a' }, { d: walk('v3', 'v2'), at: V.v3, cls: 'b' }],
  c2: [{ d: walk('v3', 'v2', 'v4'), at: V.v3, cls: 'a' }, { d: walk('v1', 'v2'), at: V.v1, cls: 'b' }],
}

function graph(id: string, covers: (keyof typeof COVER)[], labels: boolean) {
  const nodes = (Object.keys(V) as K[]).map(k => `<g class="node"><circle cx="${V[k][0]}" cy="${V[k][1]}" r="${R}" /><text x="${V[k][0]}" y="${V[k][1] + 0.8}">${k}</text></g>`).join('')
  const over = covers.map(c => COVER[c].map((w, i) => `<path class="ov ${w.cls} ${c} ${c}-${i}" d="${w.d}" />`).join('')).join('')
  const nums = covers.map(c => COVER[c].map((w, i) => `<g class="num ${c}n ${c}n${i} ${w.cls}"><circle cx="${w.at[0] - 4.6}" cy="${w.at[1] - 3.6}" r="1.6" /><text x="${w.at[0] - 4.6}" y="${w.at[1] - 2.9}">${i + 1}</text></g>`).join('')).join('')
  return `<svg viewBox="0 0 60 37" preserveAspectRatio="xMidYMid meet">
    <defs><marker id="${id}" viewBox="0 0 4 4" refX="3.2" refY="2" markerWidth="3.6" markerHeight="3.6" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#17171c" /></marker></defs>
    <path class="edge" d="${seg('v1', 'v2')}" marker-end="url(#${id})" />
    <path class="edge" d="${seg('v3', 'v2')}" marker-end="url(#${id})" />
    <path class="edge" d="${seg('v2', 'v4')}" marker-end="url(#${id})" />
    ${over}${nodes}${nums}
    ${labels ? `<text class="cons s1" x="11" y="9.6">person Alice</text><text class="cons s2" x="30" y="9.6">person</text>
    <text class="cons s3" x="49" y="9.6">person Bob</text><text class="cons s4" x="30" y="35.6">software</text>
    <text class="elab" x="20.5" y="13.4">knows</text><text class="elab" x="39.5" y="13.4">knows</text><text class="elab" x="35" y="23">develops</text>` : ''}
  </svg>`
}

const CSS = `
  .caption { top: 3cqh; bottom: auto; }
  .ask { position: absolute; left: 0; right: 0; top: 11.5cqh; text-align: center; font-size: 1.8cqw; font-style: italic; color: var(--muted); }
  .main { position: absolute; left: 3cqw; top: 20cqh; width: 58cqw; height: 66cqh; }
  .main svg, .mini svg { width: 100%; height: 100%; overflow: visible; }
  .mini { right: 4cqw; width: 30cqw; height: 31cqh; padding: 0.6cqw; }
  .mini.m1 { top: 20cqh; } .mini.m2 { top: 56cqh; }
  .mini .tag { position: absolute; left: 1cqw; top: 0.8cqh; font-family: 'Silkscreen', monospace; font-size: 1.3cqw; color: var(--muted); }
  .edge { stroke: var(--ink); stroke-width: 0.35; fill: none; }
  .ov { stroke-width: 1.5; fill: none; stroke-linecap: round; stroke-linejoin: round; }
  .ov.a { stroke: #c08a00; } .ov.b { stroke: var(--acc); }
  .node circle { fill: var(--white); stroke: var(--ink); stroke-width: 0.4; }
  .node text { font-family: 'Silkscreen', monospace; font-size: 2.1px; text-anchor: middle; fill: var(--ink); }
  .num.a circle { fill: #c08a00; } .num.b circle { fill: var(--acc); }
  .num text { font-family: 'Silkscreen', monospace; font-size: 2px; fill: var(--white); text-anchor: middle; }
  .cons { font-family: 'IBM Plex Sans', sans-serif; font-style: italic; font-size: 1.8px; fill: var(--muted); text-anchor: middle; }
  .elab { font-family: 'IBM Plex Sans', sans-serif; font-size: 1.6px; fill: var(--acc); text-anchor: middle; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const id = `cov${++uid}`
  const f = frame(root, CSS, `
    <div class="caption cap1">GRev draws the query as nodes and edges to match</div>
    <div class="caption cap2">Walk 1 covers v1→v2→v4, walk 2 covers v3→v2</div>
    <div class="caption cap3">A second covering uses the same edges in another order</div>
    <div class="ask">“Which people, known by both Alice and Bob, develop software?”</div>
    <div class="main">${graph(`${id}m`, ['c1', 'c2'], true)}</div>
    <div class="card mini m1"><div class="tag">route 1</div>${graph(`${id}a`, ['c1'], false)}</div>
    <div class="card mini m2"><div class="tag">route 2</div>${graph(`${id}b`, ['c2'], false)}</div>`)
  const D = durations[0] / 1000
  const main = pick(f, '.main')
  const q = (s: string, el: ParentNode = f) => el.querySelectorAll(s)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.cap1'), { autoAlpha: 0, duration: 0.4 }, 0)
    .from(pick(f, '.ask'), { autoAlpha: 0, duration: 0.4 }, 0.1)
    .from(q('.node', main), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.12, ease: 'back.out(1.8)' }, 0.06 * D)
    .from(q('.cons', main), { autoAlpha: 0, duration: 0.35, stagger: 0.08 }, 0.1 * D)
    .from(q('.edge', main), { drawSVG: 0, duration: 0.5, stagger: 0.15, ease: 'power2.inOut' }, 0.14 * D)
    .from(q('.elab', main), { autoAlpha: 0, duration: 0.3, stagger: 0.1 }, 0.18 * D)
    .to(pick(f, '.cap1'), { autoAlpha: 0, duration: 0.3 }, 0.26 * D)
    .from(pick(f, '.cap2'), { autoAlpha: 0, duration: 0.4 }, 0.28 * D)
    // covering 1, walk by walk, then it lands as the route 1 card
    .from(q('.c1n0', main), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0.3 * D)
    .from(q('.c1-0', main), { drawSVG: 0, duration: 1.0, ease: 'power1.inOut' }, 0.3 * D)
    .from(q('.c1n1', main), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0.3 * D + 1.1)
    .from(q('.c1-1', main), { drawSVG: 0, duration: 0.6, ease: 'power1.inOut' }, 0.3 * D + 1.1)
    .from(pick(f, '.m1'), { autoAlpha: 0, xPercent: -40, scale: 0.8, duration: 0.5 }, 0.3 * D + 1.9)
    .to(q('.c1, .c1n', main), { autoAlpha: 0, duration: 0.3 }, 0.3 * D + 2.4)
    .to(pick(f, '.cap2'), { autoAlpha: 0, duration: 0.3 }, 0.6 * D)
    .from(pick(f, '.cap3'), { autoAlpha: 0, duration: 0.4 }, 0.62 * D)
    // covering 2 on the same edges, then the route 2 card
    .from(q('.c2n0', main), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0.6 * D)
    .from(q('.c2-0', main), { drawSVG: 0, duration: 1.0, ease: 'power1.inOut' }, 0.6 * D)
    .from(q('.c2n1', main), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.2 }, 0.6 * D + 1.1)
    .from(q('.c2-1', main), { drawSVG: 0, duration: 0.6, ease: 'power1.inOut' }, 0.6 * D + 1.1)
    .from(pick(f, '.m2'), { autoAlpha: 0, xPercent: -40, scale: 0.8, duration: 0.5 }, 0.6 * D + 1.9)
    .set({}, {}, D)
  return tl
})
