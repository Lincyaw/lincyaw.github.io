import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, frame, moves } from './kit/frame.ts'
import { TICKET_CSS } from './kit/ticket.ts'

// A ticket nobody owns. `hops`: the Mac sign-in ticket of Figure 1 lands on Team A, moves to B, then C; each landing
// leaves a hop mark and adds a longer slice to the waiting bar. `curve`: the lanes step aside and Figure 3 (median
// triage time against transfer hops, over 3,000+ teams and 12 months) is uncovered from left to right.
const LANES = [{ team: 'A', x: 20 }, { team: 'B', x: 42 }, { team: 'C', x: 64 }]
const WAIT = [5, 9, 14] // cqw per hop: each hop costs more

const fig3 = new URL('../figures/triage-time-vs-transfer-hops.png', import.meta.url).href

export default gsapScene(({ root, gsap, at }) => {
  const f = frame(root, `${TICKET_CSS}
    .lanes { position: absolute; inset: 0; transform-origin: 0% 50%; }
    .lanes svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .head { width: 14cqw; height: 5cqw; display: grid; place-items: center; font-size: 1.6cqw; }
    .ticket { left: 20%; top: 45%; width: 18cqw; padding: 1cqw 1.2cqw; }
    .pip { width: 7.5cqw; padding: 0.4cqw 0; text-align: center; font-size: 1.2cqw; color: #ffffff; background: ${C.alarm}; border: 0.18cqw solid var(--pm-color-ink); }
    .wait { position: absolute; left: 13%; top: 77%; display: flex; align-items: center; gap: 1cqw; }
    .wait__label { font-size: 1.4cqw; }
    .wait__bar { display: flex; height: 2.6cqw; border: 0.18cqw solid var(--pm-color-ink); background: var(--pm-color-surface); }
    .wait__seg { height: 100%; background: ${C.alarm}; border-right: 0.18cqw solid var(--pm-color-ink); transform-origin: left center; }
    .fig { left: 73%; top: 45%; width: 44cqw; }
    .fig img { display: block; width: 100%; }
    .fig__src { margin-top: 0.6cqw; text-align: center; }
  `, `
    <div class="lanes">
      <svg viewBox="0 0 160 90" preserveAspectRatio="none">${LANES.map(l => `<path class="lane" d="M ${l.x * 1.6} 20 V 68" stroke="${C.ink}" stroke-width="0.25" stroke-dasharray="1 1" fill="none" />`).join('')}</svg>
      ${LANES.map(l => `<div class="pos card px head" style="left:${l.x}%; top:13%">team ${l.team}</div>`).join('')}
      ${LANES.map((l, i) => `<div class="pos px pip pip${i}" style="left:${l.x}%; top:63%">hop ${i + 1}</div>`).join('')}
      <div class="pos card ticket"><div class="px ticket__kind">incident</div><div class="ticket__text">Can’t sign in on Mac</div></div>
      <div class="wait"><div class="px wait__label">waiting</div><div class="wait__bar">${WAIT.map((w, i) => `<div class="wait__seg seg${i}" style="width:${w}cqw"></div>`).join('')}</div></div>
    </div>
    <div class="pos fig"><img src="${fig3}" alt="Median triage time and human discussions rise with the number of transfer hops"><div class="source fig__src">3,000+ teams · 12 months · Figure 3</div></div>
    <div class="pos cap c1">A Mac sign-in fails. Who owns it?</div>
    <div class="pos cap c2">Team A, then B, then C.</div>
    <div class="pos cap c3">Every hop is more waiting.</div>
    <div class="pos cap c4">Over 3,000 teams, time climbs with every hop.</div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  const ticket = f.querySelector('.ticket')!
  // hops: lanes, then the ticket drops into A; it moves to B and to C, each landing marking a hop and a wait.
  m.enter(f.querySelectorAll('.head'), s(0) + 0.1, { from: 'below' })
  m.draw(f.querySelectorAll('.lane'), s(0) + 0.3, { duration: 0.6 })
  m.enter(ticket, s(0) + 0.7, { from: 'scale' })
  m.caption(f.querySelector('.c1')!, s(0) + 0.9, s(0) + 3.6)
  const segs = [...f.querySelectorAll('.wait__seg')]
  gsap.set(segs, { scaleX: 0 })
  m.enter(f.querySelector('.wait')!, s(0) + 1.4, { from: 'fade' })
  const land = [1.5, 4.5, 6.0]
  LANES.forEach((l, i) => {
    if (i > 0) tl.to(ticket, { left: `${l.x}%`, duration: 0.7, ease: 'power3.inOut' }, s(0) + land[i]! - 0.7)
    m.enter(f.querySelector(`.pip${i}`)!, s(0) + land[i]!, { from: 'scale' })
    tl.to(segs[i]!, { scaleX: 1, duration: 0.8, ease: 'power2.out' }, s(0) + land[i]!)
  })
  m.caption(f.querySelector('.c2')!, s(0) + 3.8, s(0) + 6.9)
  m.caption(f.querySelector('.c3')!, s(0) + 7.1, s(1) + 0.1)
  m.emphasize(f.querySelector('.wait__bar')!, s(0) + 7.4, 1.05)
  // curve: the lanes step aside; Figure 3 is uncovered from left to right, as its lines rise with the hops.
  tl.to(f.querySelector('.lanes')!, { scale: 0.62, x: 0, duration: 0.8, ease: 'power3.inOut' }, s(1) + 0.1)
  m.enter(f.querySelector('.fig')!, s(1) + 0.6, { from: 'fade', duration: 0.2 })
  m.reveal(f.querySelector('.fig img')!, s(1) + 0.7, { duration: 2.2 })
  m.caption(f.querySelector('.c4')!, s(1) + 0.9)
  return tl
})
