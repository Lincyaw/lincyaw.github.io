import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, moves } from './kit/frame.ts'
import { GRAPH_CSS, graphHtml, haloOn, node, NODES } from './kit/graph.ts'

// The loudest are victims. Opens on the last frame of the question. `reveal`: the question mark gives way to a ring
// on checkout, the root cause, and its latency rises from about 0.2 s to 4.8 s: it only slowed down (Section 3).
// `models`: ART and Eadro, which rank services by how abnormal they look, both put payment above checkout; their
// root-cause scores from Figure 2b are pinned beside both services, and the lesson is set beside the graph.
export default gsapScene(({ root, gsap, at }) => {
  const checkout = node('checkout'), payment = node('payment')
  const f = frame(root, `${GRAPH_CSS}
    .banner { left: 17%; top: 8%; font-size: 1.6cqw; }
    .q { left: 80%; top: 46%; text-align: center; }
    .q__mark { font-size: 14cqw; line-height: 1; }
    .q__text { font-size: 2.2cqw; margin-top: 1.5cqw; }
    .tag { font-size: 1.3cqw; padding: 0.35cqw 0.7cqw; }
    .rc { font-size: 1.4cqw; background: var(--px-diagnose, #2546b8); color: var(--pm-color-on-accent); border-color: var(--px-diagnose, #2546b8); }
    .lat { width: 15cqw; }
    .lat__label { font-size: 1.25cqw; }
    .lat__track { height: 1.1cqw; margin-top: 0.4cqw; border: 0.15cqw solid var(--pm-color-ink); background: var(--pm-color-surface); }
    .lat__bar { height: 100%; width: 100%; background: var(--px-diagnose, #2546b8); transform-origin: left center; }
    .score { font-size: 1.3cqw; line-height: 1.5; }
    .score b { font-family: var(--pm-font-mono); font-weight: 500; }
    .side { left: 80%; top: 64%; width: 30cqw; text-align: center; }
    .side__big { font-size: 2.8cqw; line-height: 1.2; }
    .side__src { margin-top: 1.4cqw; }
    .score-pay { left: ${payment.x + 14.5}%; top: ${payment.y}%; }
    .score-chk { left: ${checkout.x}%; top: ${checkout.y - 12}%; }
  `, `${graphHtml()}
    <div class="pos chip px banner">network delay injected</div>
    <div class="pos q"><div class="px q__mark">?</div><div class="px q__text">which one broke?</div></div>
    <div class="pos g-ring" style="left:${checkout.x}%; top:${checkout.y}%"></div>
    <div class="pos chip px rc" style="left:${checkout.x}%; top:${checkout.y + 9.5}%">root cause</div>
    <div class="pos lat" style="left:${checkout.x}%; top:${checkout.y + 19}%">
      <div class="px lat__label">latency <span class="lat__val">0.2</span> s</div>
      <div class="lat__track"><div class="lat__bar"></div></div>
    </div>
    <div class="pos score score-pay"><span class="chip px tag">ART</span> <b>0.89</b><br><span class="chip px tag">Eadro</span> <b>0.94</b></div>
    <div class="pos score score-chk"><span class="px muted">ART</span> <b>0.85</b> · <span class="px muted">Eadro</span> <b>0.92</b></div>
    <div class="pos side"><div class="px side__big">loudest &ne; cause</div><div class="source side__src">root-cause scores · Figure 2b</div></div>
    <div class="pos cap c1">Checkout broke. It only slowed down.</div>
    <div class="pos cap c2">ART and Eadro blame payment instead.</div>
    <div class="pos cap c3">Payment was only reacting to checkout.</div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  // The graph as the question left it: every service alarmed.
  for (const n of NODES) gsap.set(f.querySelector(`[data-halo="${n.id}"]`), haloOn(n))
  // reveal: the question gives way to the ring; the latency of checkout climbs.
  m.exit(f.querySelector('.q')!, s(0) + 0.1)
  m.caption(f.querySelector('.c1')!, s(0) + 1.2, s(1) + 0.1)
  m.enter(f.querySelector('.g-ring')!, s(0) + 0.5, { from: 'scale' })
  m.enter(f.querySelector('.rc')!, s(0) + 0.9, { from: 'below' })
  m.enter(f.querySelector('.lat')!, s(0) + 1.9, { from: 'fade' })
  gsap.set(f.querySelector('.lat__bar'), { scaleX: 0.04 })
  tl.to(f.querySelector('.lat__bar'), { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, s(0) + 2.3)
  m.count(f.querySelector<HTMLElement>('.lat__val')!, s(0) + 2.3, 0.2, 4.8, { duration: 1.4, decimals: 1 })
  // models: the two models' scores land on payment, then on checkout; the lesson is set beside the graph.
  m.enter(f.querySelector('.score-pay')!, s(1) + 0.5, { from: 'left' })
  m.caption(f.querySelector('.c2')!, s(1) + 0.9, s(1) + 5.0)
  m.emphasize(f.querySelector('[data-node="payment"]')!, s(1) + 1.9)
  m.enter(f.querySelector('.score-chk')!, s(1) + 2.8, { from: 'below' })
  m.enter(f.querySelector('.side')!, s(1) + 5.2, { from: 'scale' })
  m.caption(f.querySelector('.c3')!, s(1) + 5.6)
  return tl
})
