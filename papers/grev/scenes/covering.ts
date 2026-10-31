import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 3 (the turn). The Alice-and-Bob query of the paper's Fig. 2 becomes its graph of what to match (v1–v4,
// edges knows, knows, develops). Covering 1 (the paper's): an amber path v1→v2→v4 and a violet path v3→v2, spelled
// as the equivalent query below. Covering 2 walks the same edges another way and spells a second wording; the first
// stays as a faded trace above it.
let uid = 0

const CSS = `
  .orig { position: absolute; left: 4cqw; right: 4cqw; top: 10cqh; font-family: 'IBM Plex Mono', monospace; font-size: 1.45cqw; color: var(--ink); line-height: 1.45; }
  .orig .k, .eqq .k { color: var(--muted); }
  .tag { font-family: 'Silkscreen', monospace; font-size: 1.3cqw; color: var(--muted); margin-right: 1cqw; }
  .eqq { position: absolute; left: 4cqw; right: 4cqw; font-family: 'IBM Plex Mono', monospace; font-size: 1.45cqw; line-height: 1.45; }
  .eqq.e1 { top: 71cqh; } .eqq.e2 { top: 81cqh; }
  .a { color: #a86b00; font-weight: 500; } .b { color: var(--acc); font-weight: 500; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .edge { stroke: var(--ink); stroke-width: 0.35; fill: none; }
  .ov { stroke-width: 1.3; fill: none; stroke-linecap: round; }
  .ov.a { stroke: #c08a00; } .ov.b { stroke: var(--acc); }
  .node circle { fill: var(--white); stroke: var(--ink); stroke-width: 0.35; }
  .node text { font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; font-size: 2.1px; text-anchor: middle; fill: var(--ink); }
  .cons { font-family: 'IBM Plex Sans', sans-serif; font-style: italic; font-size: 1.8px; fill: var(--muted); text-anchor: middle; }
  .elab { font-family: 'IBM Plex Sans', sans-serif; font-size: 1.6px; fill: var(--acc); text-anchor: middle; }
  .frameg rect { fill: none; stroke: var(--ink); stroke-width: 0.25; stroke-dasharray: 1 0.8; }
  .frameg text { font-family: 'Silkscreen', monospace; font-size: 1.5px; fill: var(--muted); }
  .caption { top: 2.5cqh; bottom: auto; }
`

const V = { v1: [28, 21], v2: [50, 21], v3: [72, 21], v4: [50, 32] } as const
const R = 3.2
/** A segment from node a to node b, trimmed to the circles. */
function seg(a: keyof typeof V, b: keyof typeof V) {
  const [x1, y1] = V[a], [x2, y2] = V[b]
  const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d
  return `M ${(x1 + ux * R).toFixed(2)} ${(y1 + uy * R).toFixed(2)} L ${(x2 - ux * (R + 0.6)).toFixed(2)} ${(y2 - uy * (R + 0.6)).toFixed(2)}`
}

export default gsapScene(({ root, gsap, durations }) => {
  const id = `cov${++uid}`
  const f = frame(root, CSS, `
    <div class="orig"><span class="tag">question</span><span class="k">MATCH</span> (n1:person {name:"Alice"})-[:knows]-&gt;(n2:person), (n3:person {name:"Bob"})-[:knows]-&gt;(n2:person), (n2:person)-[:develops]-&gt;(n4:software) <span class="k">RETURN</span> n2</div>
    <svg viewBox="0 0 100 56.25" preserveAspectRatio="xMidYMid meet">
      <defs><marker id="${id}-m" viewBox="0 0 4 4" refX="3.2" refY="2" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#17171c" /></marker></defs>
      <g class="frameg"><rect x="16" y="11.5" width="68" height="27.5" /><text x="17" y="13.7">graph of what to match</text></g>
      <path class="edge e12" d="${seg('v1', 'v2')}" marker-end="url(#${id}-m)" />
      <path class="edge e32" d="${seg('v3', 'v2')}" marker-end="url(#${id}-m)" />
      <path class="edge e24" d="${seg('v2', 'v4')}" marker-end="url(#${id}-m)" />
      <text class="elab l12" x="39" y="19.6">knows</text><text class="elab l32" x="61" y="19.6">knows</text><text class="elab l24" x="54.5" y="27.5">develops</text>
      <path class="ov a c1 c1a" d="${seg('v1', 'v2')} ${seg('v2', 'v4')}" />
      <path class="ov b c1 c1b" d="${seg('v3', 'v2')}" />
      <path class="ov a c2 c2a" d="${seg('v3', 'v2')} ${seg('v2', 'v4')}" />
      <path class="ov b c2 c2b" d="${seg('v1', 'v2')}" />
      ${(['v1', 'v2', 'v3', 'v4'] as const).map(v => `<g class="node ${v}"><circle cx="${V[v][0]}" cy="${V[v][1]}" r="${R}" /><text x="${V[v][0]}" y="${V[v][1] + 0.75}">${v}</text></g>`).join('')}
      <text class="cons s1" x="28" y="16.4">person {Alice}</text>
      <text class="cons s2" x="50" y="16.4">person</text>
      <text class="cons s3" x="72" y="16.4">person {Bob}</text>
      <text class="cons s4" x="50" y="37.6">software</text>
    </svg>
    <div class="eqq e1"><span class="tag">covering 1</span><span class="k">MATCH</span> <span class="a">(n4:software)&lt;-[:develops]-(n2:person)&lt;-[:knows]-(n1:person {name:"Alice"})</span>, <span class="b">(n2)&lt;-[:knows]-(n3:person {name:"Bob"})</span> <span class="k">RETURN</span> n2</div>
    <div class="eqq e2"><span class="tag">covering 2</span><span class="k">MATCH</span> <span class="a">(n3:person {name:"Bob"})-[:knows]-&gt;(n2:person)-[:develops]-&gt;(n4:software)</span>, <span class="b">(n1:person {name:"Alice"})-[:knows]-&gt;(n2)</span> <span class="k">RETURN</span> n2</div>
    <div class="caption">Same graph, new words</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.orig'), { autoAlpha: 0, yPercent: -30, duration: 0.5 }, 0)
    .from(q('.frameg'), { autoAlpha: 0, duration: 0.4 }, 0.1 * D)
    .from(q('.node'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.12, ease: 'back.out(1.8)' }, 0.12 * D)
    .from(q('.cons'), { autoAlpha: 0, duration: 0.35, stagger: 0.1 }, 0.18 * D)
    .from(q('.edge'), { drawSVG: 0, duration: 0.5, stagger: 0.15, ease: 'power2.inOut' }, 0.24 * D)
    .from(q('.elab'), { autoAlpha: 0, duration: 0.3, stagger: 0.1 }, 0.28 * D)
    .to(pick(f, '.orig'), { opacity: 0.45, duration: 0.4 }, 0.32 * D)
    // covering 1: the paper's (Fig. 2)
    .from(q('.c1a'), { drawSVG: 0, duration: 1.1, ease: 'power2.inOut' }, 0.34 * D)
    .from(q('.c1b'), { drawSVG: 0, duration: 0.6, ease: 'power2.inOut' }, 0.34 * D + 1.1)
    .from(pick(f, '.e1'), { autoAlpha: 0, yPercent: 30, duration: 0.5 }, 0.4 * D)
    // covering 2: the same edges walked another way
    .to(q('.c1'), { autoAlpha: 0, duration: 0.3 }, 0.6 * D)
    .to(pick(f, '.e1'), { opacity: 0.45, duration: 0.4 }, 0.6 * D)
    .from(q('.c2a'), { drawSVG: 0, duration: 1.1, ease: 'power2.inOut' }, 0.62 * D)
    .from(q('.c2b'), { drawSVG: 0, duration: 0.6, ease: 'power2.inOut' }, 0.62 * D + 1.1)
    .from(pick(f, '.e2'), { autoAlpha: 0, yPercent: 30, duration: 0.5 }, 0.68 * D)
    .from(pick(f, '.caption'), { autoAlpha: 0, duration: 0.4 }, 0.62 * D)
    .set({}, {}, D)
  return tl
})
