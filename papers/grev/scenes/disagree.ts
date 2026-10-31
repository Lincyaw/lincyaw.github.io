import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'
import { CSS_PATTERN, pattern, route1, route2 } from './two-answers.ts'

// Chapter 5. A call-back to the opening picture: the same pattern twice, query 1's and query 2's walks drawn again,
// each count arriving under its panel (7, then 8). The pair then shrinks into one bug mark on the RedisGraph tile;
// the other databases fill with their marks (Table 2: 3, 6, 4, 3, 6), the marks add up to 22, and the end card lands.
let uid = 0
const DBS = [
  ['Neo4j', 'Cypher', 3], ['RedisGraph', 'Cypher', 6], ['MemGraph', 'Cypher', 4], ['TinkerGraph', 'Gremlin', 3], ['NebulaGraph', 'nGQL', 6],
] as const

const CSS = CSS_PATTERN + `
  .caption { top: 3cqh; bottom: auto; }
  .pair { position: absolute; left: 24cqw; top: 14cqh; width: 52cqw; height: 46cqh; }
  .mp { top: 0; width: 24cqw; height: 30cqh; }
  .mp.l { left: 0; } .mp.r { right: 0; }
  .mp .tag { position: absolute; left: 0.8cqw; top: 0.6cqh; font-family: 'Silkscreen', monospace; font-size: 1.2cqw; color: var(--muted); }
  .mp svg { position: absolute; left: 1cqw; top: 3cqh; width: calc(100% - 2cqw); height: 26cqh; overflow: visible; }
  .cnt { position: absolute; top: 33cqh; width: 24cqw; text-align: center; font-family: 'Silkscreen', monospace; font-size: 5cqw; line-height: 1; color: var(--warn); }
  .cnt.l { left: 0; } .cnt.r { right: 0; }
  .cnt small { display: block; font-size: 1.2cqw; color: var(--muted); margin-top: 0.6cqh; }
  .neq { position: absolute; left: 22cqw; width: 8cqw; top: 33cqh; text-align: center; font-family: 'Silkscreen', monospace; font-size: 5cqw; color: var(--warn); }
  .total { position: absolute; left: 0; right: 0; top: 10cqh; text-align: center; }
  .total .n { font-family: 'Silkscreen', monospace; font-size: 9cqw; line-height: 1; color: var(--warn); }
  .total .u { font-family: 'Silkscreen', monospace; font-size: 1.8cqw; color: var(--ink); margin-top: 1cqh; }
  .total .sub { font-size: 1.5cqw; color: var(--muted); margin-top: 0.6cqh; }
  .tile { top: 41cqh; width: 16.4cqw; height: 23cqh; padding: 1.2cqw; }
  .tile .nm { font-weight: 600; font-size: 1.75cqw; }
  .tile .lg { font-family: 'Silkscreen', monospace; font-size: 1.25cqw; color: var(--muted); margin-top: 0.4cqh; }
  .marks { position: absolute; left: 1.2cqw; right: 1.2cqw; bottom: 1.4cqw; display: flex; flex-wrap: wrap; gap: 0.7cqw; }
  .mark { width: 2.2cqw; height: 2.2cqw; background: var(--warn); }
  .end { position: absolute; left: 4cqw; right: 4cqw; top: 72cqh; border-top: 0.2cqw solid var(--ink); padding-top: 2cqh; display: flex; justify-content: space-between; gap: 2cqw; }
  .end .t { font-weight: 600; font-size: 1.8cqw; max-width: 58cqw; }
  .end .a { font-size: 1.35cqw; color: var(--muted); margin-top: 0.6cqh; }
  .end .a b { color: var(--ink); }
  .end .v { text-align: right; font-family: 'Silkscreen', monospace; font-size: 1.5cqw; color: var(--acc); white-space: nowrap; }
  .end .v div + div { font-family: 'IBM Plex Mono', monospace; color: var(--muted); font-size: 1.25cqw; margin-top: 0.8cqh; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const id = `dis${++uid}`
  const tiles = DBS.map(([name, lang, n], i) => `<div class="card tile t${i}" style="left:${4 + i * 18.6}cqw"><div class="nm">${name}</div><div class="lg">${lang}</div>
    <div class="marks">${Array.from({ length: n }, () => '<div class="mark"></div>').join('')}</div></div>`).join('')
  const f = frame(root, CSS, `
    <div class="caption cap1">The opening queries again: RedisGraph counts 7, then 8</div>
    <div class="caption cap2">GRev found 22 previously unknown bugs in five graph databases</div>
    <div class="total"><div class="n">0</div><div class="u">previously unknown bugs</div><div class="sub">15 confirmed · 14 graph-related</div></div>
    ${tiles}
    <div class="pair">
      <div class="card mp l"><div class="tag">query 1</div>${pattern(`${id}a`, route1)}</div>
      <div class="card mp r"><div class="tag">query 2</div>${pattern(`${id}b`, route2)}</div>
      <div class="cnt l"><span class="n">0</span><small>matches</small></div>
      <div class="neq">≠</div>
      <div class="cnt r"><span class="n">0</span><small>matches</small></div>
    </div>
    <div class="end"><div><div class="t">Testing Graph Database Systems via Equivalent Query Rewriting</div>
      <div class="a">Qiuyang Mang, <b>Aoyang Fang</b> (co-first), Boxi Yu, Hanfei Chen, Pinjia He</div></div>
      <div class="v"><div>ICSE 2024</div><div>github.com/CUHK-SE-Group/GRev</div></div></div>
    <div class="src">Listing 1 · Table 2</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const pair = pick(f, '.pair')
  const n = pick(f, '.total .n')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  // the opening picture comes back: walks redrawn, then each count arrives under its query
  tl.from(pick(f, '.cap1'), { autoAlpha: 0, duration: 0.3 }, 0)
    .from(q('.mp'), { autoAlpha: 0, scale: 0.9, duration: 0.4, stagger: 0.1 }, 0)
    .from(q('.mp.l .w'), { drawSVG: 0, duration: 0.3, stagger: 0.3, ease: 'power1.inOut' }, 0.3)
    .from(q('.mp.l .num'), { autoAlpha: 0, duration: 0.15, stagger: 0.3 }, 0.3)
    .from(pick(f, '.cnt.l'), { autoAlpha: 0, duration: 0.2 }, 1.5)
    .fromTo(pick(f, '.cnt.l .n'), { textContent: 0 }, { textContent: 7, snap: { textContent: 1 }, duration: 0.6, ease: 'expo.out' }, 1.5)
    .from(q('.mp.r .w'), { drawSVG: 0, duration: 0.3, stagger: 0.3, ease: 'power1.inOut' }, 1.7)
    .from(q('.mp.r .num'), { autoAlpha: 0, duration: 0.15, stagger: 0.3 }, 1.7)
    .from(pick(f, '.cnt.r'), { autoAlpha: 0, duration: 0.2 }, 2.7)
    .fromTo(pick(f, '.cnt.r .n'), { textContent: 0 }, { textContent: 8, snap: { textContent: 1 }, duration: 0.6, ease: 'expo.out' }, 2.7)
    .from(pick(f, '.neq'), { autoAlpha: 0, scale: 1.6, duration: 0.3, ease: 'back.out(2)' }, 3.3)
  // the pair becomes one bug mark on RedisGraph; the other databases fill; the total counts
  const t0 = 0.4 * D
  tl.from(q('.tile'), { autoAlpha: 0, yPercent: 12, duration: 0.4, stagger: 0.08 }, t0 - 0.3)
    .to(pair, { left: '24.5cqw', top: '57cqh', scale: 0.04, autoAlpha: 0, transformOrigin: '0% 0%', duration: 0.6, ease: 'power2.in' }, t0)
    .to(pick(f, '.cap1'), { autoAlpha: 0, duration: 0.25 }, t0)
    .fromTo(q('.t1 .mark')[0], { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(3)', immediateRender: true }, t0 + 0.55)
  const marks = [...q('.mark')].filter(m => m !== q('.t1 .mark')[0])
  tl.fromTo(marks, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.2, stagger: 0.25 * D / marks.length, ease: 'back.out(2)', immediateRender: true }, t0 + 0.8)
    .from(pick(f, '.total'), { autoAlpha: 0, duration: 0.3 }, t0 + 0.6)
    .fromTo(n, { textContent: 1 }, { textContent: 22, snap: { textContent: 1 }, duration: 0.25 * D, ease: 'none' }, t0 + 0.8)
    .from(pick(f, '.total .sub'), { autoAlpha: 0, duration: 0.4 }, t0 + 0.8 + 0.25 * D)
    .from(pick(f, '.cap2'), { autoAlpha: 0, duration: 0.4 }, t0 + 0.9 + 0.25 * D)
    .from(pick(f, '.end'), { autoAlpha: 0, yPercent: 20, duration: 0.5 }, 0.85 * D)
    .from(pick(f, '.src'), { autoAlpha: 0, duration: 0.4 }, 0.85 * D)
    .set({}, {}, D)
  return tl
})
