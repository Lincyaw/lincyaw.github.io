import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 2. Two testing set-ups, each under its condition. Left: comparing databases works only between the two that
// share a language (Cypher ↔ Cypher); the Gremlin and nGQL databases cannot join. Right: partitioning splits the
// WHERE filter into three parts while the MATCH path stays one grey line, and the bug sits on that line.
const CSS = `
  .ghost { position: absolute; left: 3cqw; top: 4cqh; display: flex; gap: 0.8cqw; align-items: center; font-family: 'Silkscreen', monospace; font-size: 1.5cqw; color: var(--warn); }
  .ghost b { display: inline-block; padding: 0.3cqw 0.8cqw; border: 0.18cqw solid var(--warn); background: var(--white); font-weight: 400; }
  .panel { top: 12cqh; width: 43cqw; height: 66cqh; padding: 2cqw; }
  .panel.l { left: 4cqw; } .panel.r { right: 4cqw; }
  .head { font-family: 'Silkscreen', monospace; font-size: 2cqw; }
  .need { position: absolute; left: 2cqw; bottom: 2cqh; font-family: 'Silkscreen', monospace; font-size: 1.45cqw; color: var(--muted); }
  svg { position: absolute; left: 1cqw; top: 8.5cqh; width: calc(100% - 2cqw); height: 48cqh; overflow: visible; }
  .cyl rect, .cyl ellipse { fill: var(--white); stroke: var(--ink); stroke-width: 0.35; }
  .cyl text { font-family: 'IBM Plex Mono', monospace; font-size: 1.9px; text-anchor: middle; fill: var(--ink); }
  .link { stroke: var(--acc); stroke-width: 0.7; fill: none; }
  .nolink { stroke: var(--line); stroke-width: 0.5; stroke-dasharray: 1.2 1; fill: none; }
  .ok { fill: var(--acc); font-family: 'Silkscreen', monospace; font-size: 2.6px; text-anchor: middle; }
  .x { fill: var(--muted); font-family: 'Silkscreen', monospace; font-size: 3px; text-anchor: middle; }
  .bar rect { stroke: var(--ink); stroke-width: 0.3; }
  .bar text { font-family: 'IBM Plex Mono', monospace; font-size: 2.4px; fill: var(--ink); text-anchor: middle; }
  .match rect { fill: color-mix(in oklab, var(--muted) 18%, white); }
  .where rect { fill: var(--acc-soft); }
  .part rect { fill: var(--acc-soft); stroke: var(--acc); stroke-width: 0.3; }
  .part text { font-family: 'IBM Plex Mono', monospace; font-size: 2.1px; fill: var(--acc); text-anchor: middle; }
  .walk { stroke: var(--muted); stroke-width: 0.6; fill: none; }
  .walk-label { font-family: 'Silkscreen', monospace; font-size: 2.1px; fill: var(--muted); text-anchor: middle; }
  .bug circle { fill: var(--warn); }
  .bug text { font-family: 'Silkscreen', monospace; font-size: 2.1px; fill: var(--warn); text-anchor: middle; }
`

const cyl = (cls: string, x: number, y: number, name: string, lang: string) => `
  <g class="cyl ${cls}" transform="translate(${x} ${y})">
    <rect x="-7" y="0" width="14" height="13" />
    <ellipse cx="0" cy="13" rx="7" ry="2.2" />
    <ellipse cx="0" cy="0" rx="7" ry="2.2" />
    <text y="6.5">${name}</text><text y="10">${lang}</text>
  </g>`

export default gsapScene(({ root, gsap, durations }) => {
  const f = frame(root, CSS, `
    <div class="ghost"><b>7</b>≠<b>8</b></div>
    <div class="card panel l">
      <div class="head">Compare databases</div>
      <svg viewBox="0 0 60 46" preserveAspectRatio="xMidYMid meet">
        ${cyl('c1', 12, 3, 'Neo4j', 'Cypher')}
        ${cyl('c2', 48, 3, 'RedisGraph', 'Cypher')}
        ${cyl('c3', 12, 27, 'TinkerGraph', 'Gremlin')}
        ${cyl('c4', 48, 27, 'NebulaGraph', 'nGQL')}
        <path class="link" d="M 19 9 H 41" /><text class="ok" x="30" y="7">compare</text>
        <path class="nolink n1" d="M 19 33 H 41" /><text class="x x1" x="30" y="34.2">✕</text>
        <path class="nolink n2" d="M 12 18.5 V 24.5" /><text class="x x2" x="15.5" y="22.5">✕</text>
      </svg>
      <div class="need">needs: one shared language</div>
    </div>
    <div class="card panel r">
      <div class="head">Split the filter</div>
      <svg viewBox="0 0 60 46" preserveAspectRatio="xMidYMid meet">
        <g class="bar match"><rect x="4" y="2" width="30" height="7" /><text x="19" y="6.6">MATCH (a)-[]-&gt;(b)</text></g>
        <g class="bar where"><rect x="35" y="2" width="21" height="7" /><text x="45.5" y="6.6">WHERE p</text></g>
        <g class="part p1"><rect x="34" y="15" width="10" height="6" /><text x="39" y="18.8">p</text></g>
        <g class="part p2"><rect x="45.5" y="15" width="12" height="6" /><text x="51.5" y="18.8">NOT p</text></g>
        <g class="part p3"><rect x="38" y="24" width="17" height="6" /><text x="46.5" y="27.8">p IS NULL</text></g>
        <path class="walk" d="M 19 9 V 36" /><text class="walk-label" x="19" y="40">walk unchanged</text>
        <g class="bug"><circle cx="19" cy="26" r="1.6" /><text x="12" y="26.8">bug</text></g>
      </svg>
      <div class="need">touches: the filter only</div>
    </div>
    <div class="caption">Bugs in the walk slip past</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.ghost'), { autoAlpha: 0, duration: 0.3 }, 0)
    .from(pick(f, '.panel.l'), { autoAlpha: 0, yPercent: 6, duration: 0.5 }, 0.15)
    .from(q('.c1, .c2'), { autoAlpha: 0, duration: 0.4, stagger: 0.12 }, 0.4)
    .from(q('.panel.l .link'), { drawSVG: 0, duration: 0.6 }, 0.9)
    .from(q('.panel.l .ok'), { autoAlpha: 0, duration: 0.3 }, 1.3)
    .from(q('.c3, .c4'), { autoAlpha: 0, duration: 0.4, stagger: 0.12 }, 0.22 * D)
    .from(q('.nolink'), { drawSVG: 0, duration: 0.5 }, 0.27 * D)
    .from(q('.x'), { autoAlpha: 0, duration: 0.25 }, 0.32 * D)
    .from(q('.panel.l .need'), { autoAlpha: 0, duration: 0.3 }, 0.34 * D)
    .from(pick(f, '.panel.r'), { autoAlpha: 0, yPercent: 6, duration: 0.5 }, 0.42 * D)
    .from(q('.match, .where'), { autoAlpha: 0, duration: 0.4, stagger: 0.15 }, 0.46 * D)
    .from(q('.part'), { autoAlpha: 0, y: -12, duration: 0.5, stagger: 0.12 }, 0.58 * D)
    .from(q('.walk'), { drawSVG: 0, duration: 0.7, ease: 'power2.inOut' }, 0.66 * D)
    .from(q('.walk-label'), { autoAlpha: 0, duration: 0.3 }, 0.72 * D)
    .from(q('.panel.r .need'), { autoAlpha: 0, duration: 0.3 }, 0.74 * D)
    .from(q('.bug'), { autoAlpha: 0, scale: 2.2, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, 0.8 * D)
    .from(pick(f, '.caption'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.86 * D)
    .set({}, {}, D)
  return tl
})
