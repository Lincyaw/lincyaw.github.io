import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, frame, moves } from './kit/frame.ts'
import { EDGES, GRAPH_CSS, graphHtml, haloOn, node, NODES, sx, sy } from './kit/graph.ts'

// Follow the fault upstream. Opens on the graph with the ring on checkout. `windows`: the loudness drains away; the
// graph is rebuilt for three time windows, each call's line as thick as its live traffic and errors (illustrative
// weights); then pulses run from the reacting services back along the calls to checkout, which fills with the accent.
// `rank`: a ranking of the five services starts in the loudness order and the training objective lifts checkout to
// the top (an illustration of the objective, not a reported ranking of this case).
const WEIGHTS: Record<string, number[]> = {
  'frontend-ad': [0.5, 0.6, 0.6],
  'frontend-checkout': [0.5, 0.9, 1.3],
  'checkout-payment': [0.5, 1.4, 2.1],
  'checkout-email': [0.5, 1.0, 1.5],
  'checkout-currency': [0.5, 1.1, 1.7],
}
const LADDER = ['payment', 'ad', 'currency', 'email', 'checkout']

export default gsapScene(({ root, gsap, at }) => {
  const checkout = node('checkout'), payment = node('payment')
  const f = frame(root, `${GRAPH_CSS}
    .banner { left: 17%; top: 8%; font-size: 1.6cqw; }
    .win { left: 80%; top: 8%; font-size: 1.6cqw; }
    .win span { display: inline-block; min-width: 2.6cqw; text-align: center; margin-left: 0.4cqw; border: 0.15cqw solid var(--pm-color-ink); }
    .note { left: 22%; top: 14.5%; font-size: 1.25cqw; }
    .rc { font-size: 1.4cqw; background: var(--px-diagnose, #2546b8); color: var(--pm-color-on-accent); border-color: var(--px-diagnose, #2546b8); }
    .old-scores { font-size: 1.3cqw; }
    .ladder { left: 81%; top: 54%; width: 28cqw; height: 40cqw; }
    .ladder__title { position: absolute; left: 0; top: 0; font-size: 1.4cqw; }
    .row { position: absolute; left: 0; width: 28cqw; height: 5.2cqw; display: flex; align-items: center; gap: 1cqw; }
    .row__name { width: 10cqw; font-size: 1.3cqw; text-align: right; }
    .row__bar { height: 2.6cqw; background: var(--pm-color-muted); transform-origin: left center; }
    .row--checkout .row__bar { background: var(--px-diagnose, #2546b8); }
    .ladder__note { position: absolute; left: 0; bottom: 0; font-size: 1.15cqw; }
    .pulse { fill: ${C.accent}; }
  `, `${graphHtml()}
    <div class="pos chip px banner">network delay injected</div>
    <div class="pos px win">window <span class="w w1">1</span><span class="w w2">2</span><span class="w w3">3</span></div>
    <div class="pos source note">line width = live request count + error rate (illustrative)</div>
    <div class="pos g-ring" style="left:${checkout.x}%; top:${checkout.y}%"></div>
    <div class="pos chip px rc" style="left:${checkout.x}%; top:${checkout.y + 9.5}%">root cause</div>
    <div class="pos old old-scores" style="left:${payment.x + 14.5}%; top:${payment.y}%"><span class="chip px">ART</span> 0.89<br><span class="chip px">Eadro</span> 0.94</div>
    <div class="pos old old-side px" style="left:80%; top:62%; font-size:2.8cqw">loudest &ne; cause</div>
    <div class="pos ladder">
      <div class="px ladder__title">rank by cause</div>
      ${LADDER.map((id, i) => `<div class="row row--${id}" style="top:${4 + i * 6.4}cqw"><div class="px row__name">${node(id).label}</div><div class="row__bar" style="width:${16 - i * 2.6}cqw"></div></div>`).join('')}
      <div class="source ladder__note">illustrative: the training objective</div>
    </div>
    <div class="pos old cap c0">Payment was only reacting to checkout.</div>
    <div class="pos cap c1">DynaCausal reads the calls, not the loudness.</div>
    <div class="pos cap c2">Traffic and errors lead back upstream.</div>
    <div class="pos cap c3">Training ranks the source first.</div>
  `)
  // One pulse per reacting service, travelling from it back to checkout.
  const svg = f.querySelector('svg')!
  const back = ['payment', 'email', 'currency'].map(id => {
    const n = node(id)
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    c.setAttribute('class', 'pulse'); c.setAttribute('r', '1.4')
    c.setAttribute('cx', String(sx(n.x))); c.setAttribute('cy', String(sy(n.y)))
    svg.append(c)
    return { c, from: { cx: sx(n.x), cy: sy(n.y) } }
  })
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  // The graph as the last chapter left it: alarmed, the old scores and lesson still beside it.
  for (const n of NODES) gsap.set(f.querySelector(`[data-halo="${n.id}"]`), haloOn(n))
  // windows: the loudness and the old readings leave; the calls carry the story now.
  m.exit(f.querySelectorAll('.old'), s(0) + 0.2)
  tl.to(f.querySelectorAll('.g-halo'), { opacity: 0, scale: 1, duration: 0.8, ease: 'power2.inOut' }, s(0) + 0.6)
  m.caption(f.querySelector('.c1')!, s(0) + 1.0, s(0) + 6.3)
  m.enter(f.querySelector('.win')!, s(0) + 2.0, { from: 'fade' })
  m.enter(f.querySelector('.note')!, s(0) + 2.8, { from: 'fade' })
  const wins = [...f.querySelectorAll<HTMLElement>('.w')]
  gsap.set(wins, { backgroundColor: 'transparent', color: C.ink })
  EDGES.forEach(([a, b]) => gsap.set(f.querySelector(`[data-edge="${a}-${b}"]`), { attr: { 'stroke-width': 0.35 } }))
  ;[2.3, 3.7, 5.1].forEach((start, w) => {
    const t = s(0) + start
    if (w > 0) tl.to(wins[w - 1]!, { backgroundColor: 'transparent', color: C.ink, duration: 0.2 }, t)
    tl.to(wins[w]!, { backgroundColor: C.ink, color: 'var(--pm-color-bg)', duration: 0.2 }, t)
    EDGES.forEach(([a, b]) => tl.to(f.querySelector(`[data-edge="${a}-${b}"]`), { attr: { 'stroke-width': WEIGHTS[`${a}-${b}`]![w]! }, duration: 0.6, ease: 'power2.inOut' }, t))
  })
  const to = { cx: sx(checkout.x), cy: sy(checkout.y) }
  back.forEach(({ c, from }, i) => {
    gsap.set(c, { attr: from, opacity: 0 })
    const t = s(0) + 7.0 + i * 0.3
    tl.to(c, { opacity: 1, duration: 0.15 }, t)
    tl.to(c, { attr: to, duration: 1.1, ease: 'power2.inOut' }, t)
    tl.to(c, { opacity: 0, duration: 0.15 }, t + 1.0)
  })
  const chk = f.querySelector<HTMLElement>('[data-node="checkout"]')!
  tl.to(chk, { backgroundColor: C.accent, color: 'var(--pm-color-on-accent)', duration: 0.3 }, s(0) + 8.2)
  m.emphasize(chk, s(0) + 8.2)
  m.caption(f.querySelector('.c2')!, s(0) + 6.5, s(1) + 0.1)
  // rank: the ladder starts in the loudness order; checkout rises to the top and its bar grows longest.
  m.enter(f.querySelector('.ladder')!, s(1) + 0.2, { from: 'fade' })
  m.caption(f.querySelector('.c3')!, s(1) + 0.5)
  LADDER.forEach((id, i) => {
    const row = f.querySelector(`.row--${id}`)!
    const target = id === 'checkout' ? 0 : i + 1
    tl.to(row, { top: `${4 + target * 6.4}cqw`, duration: 0.9, ease: 'power3.inOut' }, s(1) + 1.2)
  })
  tl.to(f.querySelector('.row--checkout .row__bar'), { width: '17cqw', duration: 0.9, ease: 'power3.inOut' }, s(1) + 1.2)
  return tl
})
