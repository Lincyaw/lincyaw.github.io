import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, moves } from './kit/frame.ts'
import { box, TICKET_CSS, TICKET_TEXT } from './kit/ticket.ts'

// The answer isn't in the ticket. `thin`: the ticket fills the frame: one line of text and empty lines where the
// evidence would be. Then the teams' log boxes appear below it, closed: the clues are there, not in the ticket.
export default gsapScene(({ root, gsap, at }) => {
  const f = frame(root, `${TICKET_CSS}
    .ticket { left: 50%; top: 34%; width: 50cqw; padding: 1.6cqw 2cqw; }
    .ticket .ticket__text { font-size: 2.4cqw; }
    .blank { margin-top: 1.2cqw; height: 1.4cqw; border-bottom: 0.18cqw dashed var(--pm-color-line); }
    .blank__label { margin-top: 1cqw; font-size: 1.3cqw; color: var(--pm-color-muted); }
  `, `
    <div class="pos card ticket">
      <div class="px ticket__kind">incident</div>
      <div class="ticket__text">${TICKET_TEXT}</div>
      <div class="blank"></div><div class="blank"></div><div class="blank"></div>
      <div class="px blank__label">owner: ?</div>
    </div>
    ${box('A', 22, 78)}${box('B', 50, 78)}${box('C', 78, 78)}
    <div class="pos cap c1">The ticket alone can’t name its owner.</div>
    <div class="pos cap c2">The clues sit in each team’s own logs.</div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  m.enter(f.querySelector('.ticket')!, s(0) + 0.2, { from: 'scale' })
  gsap.set(f.querySelectorAll('.blank'), { scaleX: 0, transformOrigin: 'left center' })
  tl.to(f.querySelectorAll('.blank'), { scaleX: 1, duration: 0.5, stagger: 0.25, ease: 'power2.out' }, s(0) + 0.9)
  m.enter(f.querySelector('.blank__label')!, s(0) + 1.8, { from: 'fade' })
  m.caption(f.querySelector('.c1')!, s(0) + 1.0, s(0) + 3.8)
  m.enter(f.querySelectorAll('.box'), s(0) + 4.0, { from: 'below', stagger: 0.25 })
  m.caption(f.querySelector('.c2')!, s(0) + 4.2)
  m.emphasize(f.querySelectorAll('.box__lid'), s(0) + 6.0, 1.06)
  return tl
})
