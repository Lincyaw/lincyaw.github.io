import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 1. Two equivalent Cypher queries on the same RedisGraph data (Listing 1, issue #3093) count 7 and 8.
// The cards meet at "≡", the left count lands, then the right one, and both turn red: one answer is wrong.
const CSS = `
  .q { width: 40cqw; top: 22cqh; padding: 2.2cqw 2.4cqw; }
  .q.l { left: 5cqw; } .q.r { right: 5cqw; }
  .q .tag { font-family: 'Silkscreen', monospace; font-size: 1.6cqw; color: var(--muted); margin-bottom: 1.6cqh; }
  .q pre { margin: 0; font-family: 'IBM Plex Mono', monospace; font-size: 1.62cqw; line-height: 1.55; white-space: pre; color: var(--ink); }
  .q .kw { color: var(--acc); font-weight: 500; }
  .eq { position: absolute; left: 45cqw; width: 10cqw; text-align: center; top: 28cqh; font-size: 6cqw; font-weight: 600; color: var(--ink); }
  .badge { position: absolute; top: 60cqh; width: 14cqw; height: 14cqw; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: var(--white); border: 0.22cqw solid var(--ink); box-shadow: 0.55cqw 0.55cqw 0 var(--ink); }
  .badge.l { left: 18cqw; } .badge.r { right: 18cqw; }
  .badge .n { font-family: 'Silkscreen', monospace; font-size: 7cqw; line-height: 1; }
  .badge .u { font-family: 'Silkscreen', monospace; font-size: 1.4cqw; color: var(--muted); margin-top: 0.8cqh; }
  .neq { position: absolute; left: 45cqw; width: 10cqw; text-align: center; top: calc(60cqh + 3.5cqw); font-family: 'Silkscreen', monospace; font-size: 6cqw; color: var(--warn); }
  .db { left: 0; right: 0; text-align: center; top: 8cqh; }
`

const Q1 = `<span class="kw">MATCH</span> (A)-[]->(B:L1), (C)<-[]-(A)
<span class="kw">MATCH</span> (C)<-[]-(D:L2)-[]->(D:L2)
<span class="kw">RETURN</span> COUNT(*)`
const Q2 = `<span class="kw">MATCH</span> (C)<-[]-(A)-[]->(B:L1)
<span class="kw">MATCH</span> (C)<-[]-(D:L2)-[]->(D:L2)
<span class="kw">RETURN</span> COUNT(*)`

export default gsapScene(({ root, gsap, durations }) => {
  const f = frame(root, CSS, `
    <div class="label db">RedisGraph · same data</div>
    <div class="card q l"><div class="tag">phrasing 1</div><pre>${Q1}</pre></div>
    <div class="eq">≡</div>
    <div class="card q r"><div class="tag">phrasing 2</div><pre>${Q2}</pre></div>
    <div class="badge l"><div class="n">0</div><div class="u">count</div></div>
    <div class="badge r"><div class="n">0</div><div class="u">count</div></div>
    <div class="neq">≠</div>
    <div class="caption">Same question, two answers: 7 ≠ 8</div>
    <div class="src">Listing 1 · RedisGraph issue #3093</div>`)
  const D = durations[0] / 1000
  const [n1, n2] = [pick(f, '.badge.l .n'), pick(f, '.badge.r .n')]
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.db'), { autoAlpha: 0, yPercent: -60, duration: 0.4 }, 0)
    .from(pick(f, '.q.l'), { xPercent: -70, autoAlpha: 0, duration: 0.6 }, 0.1)
    .from(pick(f, '.q.r'), { xPercent: 70, autoAlpha: 0, duration: 0.6 }, 0.25)
    .from(pick(f, '.eq'), { autoAlpha: 0, scale: 0.6, duration: 0.4 }, 0.75)
    .from(f.querySelectorAll('.badge'), { autoAlpha: 0, yPercent: 15, duration: 0.45, stagger: 0.08 }, 0.22 * D)
    .fromTo(n1, { textContent: 0 }, { textContent: 7, snap: { textContent: 1 }, duration: 1.2, ease: 'expo.out' }, 0.3 * D)
    .fromTo(n2, { textContent: 0 }, { textContent: 8, snap: { textContent: 1 }, duration: 1.2, ease: 'expo.out' }, 0.5 * D)
    .to(f.querySelectorAll('.badge'), { borderColor: '#b93a0b', boxShadow: '0.55cqw 0.55cqw 0 #b93a0b', duration: 0.3 }, 0.72 * D)
    .to([n1, n2], { color: '#b93a0b', duration: 0.3 }, 0.72 * D)
    .from(pick(f, '.neq'), { autoAlpha: 0, scale: 1.6, duration: 0.35, ease: 'back.out(2)' }, 0.72 * D)
    .from(pick(f, '.caption'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.8 * D)
    .from(pick(f, '.src'), { autoAlpha: 0, duration: 0.4 }, 0.8 * D)
    .set({}, {}, D)
  return tl
})
