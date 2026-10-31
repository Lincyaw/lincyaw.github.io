import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 5. The 7 ≠ 8 pair shrinks into one bug mark on the RedisGraph tile; the other databases fill with their
// marks (Table 2: 3, 6, 4, 3, 6), the marks add up to 22, and the end card lands under them. Then nothing moves.
const DBS = [
  ['Neo4j', 'Cypher', 3], ['RedisGraph', 'Cypher', 6], ['MemGraph', 'Cypher', 4], ['TinkerGraph', 'Gremlin', 3], ['NebulaGraph', 'nGQL', 6],
] as const

const CSS = `
  .pair { position: absolute; left: 41cqw; top: 40cqh; width: 18cqw; display: flex; gap: 1cqw; align-items: center; justify-content: center;
    font-family: 'Silkscreen', monospace; font-size: 3cqw; color: var(--warn); }
  .pair b { display: inline-block; padding: 0.4cqw 1.2cqw; border: 0.22cqw solid var(--warn); background: var(--white); font-weight: 400; }
  .total { position: absolute; left: 0; right: 0; top: 5cqh; text-align: center; }
  .total .n { font-family: 'Silkscreen', monospace; font-size: 10cqw; line-height: 1; color: var(--warn); }
  .total .u { font-family: 'Silkscreen', monospace; font-size: 2cqw; color: var(--ink); margin-top: 1cqh; }
  .total .sub { font-size: 1.6cqw; color: var(--muted); margin-top: 0.8cqh; }
  .tile { top: 38cqh; width: 16.4cqw; height: 25cqh; padding: 1.2cqw; }
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
  const tiles = DBS.map(([name, lang, n], i) => `<div class="card tile t${i}" style="left:${4 + i * 18.6}cqw"><div class="nm">${name}</div><div class="lg">${lang}</div>
    <div class="marks">${Array.from({ length: n }, () => '<div class="mark"></div>').join('')}</div></div>`).join('')
  const f = frame(root, CSS, `
    <div class="total"><div class="n">0</div><div class="u">previously unknown bugs</div><div class="sub">15 confirmed · 14 graph-related</div></div>
    ${tiles}
    <div class="pair"><b>7</b>≠<b>8</b></div>
    <div class="end"><div><div class="t">Testing Graph Database Systems via Equivalent Query Rewriting</div>
      <div class="a">Qiuyang Mang, <b>Aoyang Fang</b> (co-first), Boxi Yu, Hanfei Chen, Pinjia He</div></div>
      <div class="v"><div>ICSE 2024</div><div>github.com/CUHK-SE-Group/GRev</div></div></div>
    <div class="src">Table 2</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const n = pick(f, '.total .n')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.pair'), { autoAlpha: 0, scale: 1.4, duration: 0.4 }, 0)
    .from(q('.tile'), { autoAlpha: 0, yPercent: 12, duration: 0.45, stagger: 0.1 }, 0.12 * D)
    // the pair collapses into the first mark of RedisGraph
    .to(pick(f, '.pair'), { left: '25.2cqw', top: '55cqh', scale: 0.15, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0.3 * D)
    .fromTo(q('.t1 .mark')[0], { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(3)', immediateRender: true }, 0.3 * D + 0.55)
  // the other marks fill tile by tile while the total counts
  const marks = [...q('.mark')].filter(m => m !== q('.t1 .mark')[0])
  tl.fromTo(marks, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.2, stagger: 0.32 * D / marks.length, ease: 'back.out(2)', immediateRender: true }, 0.38 * D)
    .from(q('.total'), { autoAlpha: 0, duration: 0.3 }, 0.36 * D)
    .fromTo(n, { textContent: 1 }, { textContent: 22, snap: { textContent: 1 }, duration: 0.33 * D, ease: 'none' }, 0.38 * D)
    .from(q('.total .sub'), { autoAlpha: 0, duration: 0.4 }, 0.74 * D)
    .from(pick(f, '.end'), { autoAlpha: 0, yPercent: 20, duration: 0.5 }, 0.8 * D)
    .from(pick(f, '.src'), { autoAlpha: 0, duration: 0.4 }, 0.8 * D)
    .set({}, {}, D)
  return tl
})
