import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, moves } from './kit/frame.ts'
import { GRAPH_CSS, graphHtml, haloOff, haloOn, NODES } from './kit/graph.ts'

// Which service broke? `alarms`: the services of an online shop appear on their call graph, a network delay is
// injected (where is not shown), and red halos swell on the services as they turn abnormal; payment and ad swell most.
// `question`: the graph holds and the question is asked beside it.
export default gsapScene(({ root, gsap, at }) => {
  const f = frame(root, `${GRAPH_CSS}
    .banner { left: 17%; top: 8%; font-size: 1.6cqw; }
    .q { left: 80%; top: 46%; text-align: center; }
    .q__mark { font-size: 14cqw; line-height: 1; color: var(--pm-color-ink); }
    .q__text { font-size: 2.2cqw; margin-top: 1.5cqw; }
  `, `${graphHtml()}
    <div class="pos chip px banner">network delay injected</div>
    <div class="pos q"><div class="px q__mark">?</div><div class="px q__text">which one broke?</div></div>
    <div class="pos cap c1">A network delay hits an online shop.</div>
    <div class="pos cap c2">Alarms fire. Payment and ads look worst.</div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  // alarms: the graph, then the delay, then each service's halo in turn; the two loudest pulse.
  m.enter(f.querySelectorAll('.g-node'), s(0) + 0.2, { from: 'scale', stagger: 0.07 })
  m.draw(f.querySelectorAll('.g-edge'), s(0) + 0.6, { duration: 0.5, stagger: 0.06 })
  m.caption(f.querySelector('.c1')!, s(0) + 1.0, s(0) + 5.2)
  m.enter(f.querySelector('.banner')!, s(0) + 1.4, { from: 'left' })
  const order = ['checkout', 'email', 'currency', 'ad', 'payment']
  for (const n of NODES) gsap.set(f.querySelector(`[data-halo="${n.id}"]`), haloOff)
  order.forEach((id, i) => {
    const n = NODES.find(x => x.id === id)!
    tl.to(f.querySelector(`[data-halo="${id}"]`), { ...haloOn(n), duration: 0.9, ease: 'power2.out' }, s(0) + 2.8 + i * 0.46)
  })
  m.caption(f.querySelector('.c2')!, s(0) + 5.5, s(1) + 0.1)
  m.emphasize(f.querySelector('[data-node="payment"]')!, s(0) + 6.0, 1.15)
  m.emphasize(f.querySelector('[data-node="ad"]')!, s(0) + 6.5, 1.15)
  // question: the question mark drops in beside the graph.
  m.enter(f.querySelector('.q')!, s(1) + 0.3, { from: 'scale' })
  return tl
})
