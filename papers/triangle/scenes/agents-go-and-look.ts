import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, frame, moves } from './kit/frame.ts'
import { box, TICKET_CSS } from './kit/ticket.ts'

// Agents go and look (an illustration of Section III; how Triangle routed this incident is not reported).
// `analyze`: the Analyzer marks the ticket's key phrases; the Decider draws on past incidents and team documents and
// pins a shortlist of three teams to the ticket. `vote`: each shortlisted team's agent opens its team's logs, adds its
// findings to the ticket, and votes; the first round splits, so the Decider shortlists three new teams for the richer
// ticket, and two of three agents agree.
const AGENT_X = [22, 50, 78]

export default gsapScene(({ root, gsap, at }) => {
  const f = frame(root, `${TICKET_CSS}
    .stage { top: 7%; font-size: 1.5cqw; padding: 0.6cqw 1.2cqw; }
    .stages { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .ticket { position: absolute; left: 25cqw; top: 15%; width: 50cqw; padding: 1.2cqw 1.6cqw; }
    .ticket__head { display: flex; justify-content: space-between; align-items: center; }
    .tabs { position: relative; display: flex; gap: 0.5cqw; height: 2.4cqw; }
    .tabset { display: flex; gap: 0.5cqw; }
    .tabset--2 { position: absolute; right: 0; top: 0; }
    .tab { width: 2.4cqw; height: 2.4cqw; display: grid; place-items: center; font-size: 1.3cqw; border: 0.18cqw solid var(--pm-color-ink); background: ${C.soft}; }
    .kp { padding: 0 0.2cqw; }
    .note { height: 0; overflow: hidden; font-size: 1.4cqw; color: var(--pm-color-ink); display: flex; align-items: center; gap: 0.8cqw; border-top: 0.15cqw dashed var(--pm-color-line); }
    .note b { font-family: var(--px-font, 'Silkscreen', monospace); font-weight: 400; color: ${C.accent}; }
    .src { top: 34%; font-size: 1.3cqw; }
    .agent { top: 61%; width: 4.6cqw; height: 4.6cqw; background: ${C.accent}; border: 0.22cqw solid var(--pm-color-ink); box-shadow: 0.35cqw 0.35cqw 0 0 var(--pm-color-ink); }
    .agent::before, .agent::after { content: ''; position: absolute; top: 1.4cqw; width: 0.9cqw; height: 0.9cqw; background: #ffffff; }
    .agent::before { left: 0.9cqw; } .agent::after { right: 0.9cqw; }
    .vote { top: 61%; font-size: 1.3cqw; }
    .stamp { left: 89%; top: 34%; font-size: 1.4cqw; padding: 0.6cqw 1cqw; }
    .stamp--no { background: ${C.alarm}; color: #ffffff; }
    .stamp--yes { background: ${C.accent}; color: #ffffff; }
    .round { left: 10%; top: 34%; font-size: 1.4cqw; }
    .dot { width: 1.2cqw; height: 1.2cqw; background: ${C.accent}; }
    .illus { left: 89%; top: 15%; }
    .box__letter2 { display: none; }
  `, `
    <svg class="stages" viewBox="0 0 160 90" preserveAspectRatio="none">
      <path d="M 47 6.3 H 63" stroke="${C.ink}" stroke-width="0.3" /><path d="M 97 6.3 H 109" stroke="${C.ink}" stroke-width="0.3" />
      <path class="loop" d="M 124.8 3.4 C 124.8 0.4, 80 0.4, 80 3.4" stroke="${C.accent}" stroke-width="0.5" fill="none" />
    </svg>
    <div class="pos chip px stage st0" style="left:22%">analyzer</div>
    <div class="pos chip px stage st1" style="left:50%">decider</div>
    <div class="pos chip px stage st2" style="left:78%">team agents</div>
    <div class="pos source illus">illustrative</div>
    <div class="card ticket">
      <div class="ticket__head"><div class="px ticket__kind">incident</div>
        <div class="tabs"><div class="tabset tabset--1">${['A', 'B', 'C'].map(t => `<div class="px tab">${t}</div>`).join('')}</div>
        <div class="tabset tabset--2">${['D', 'E', 'F'].map(t => `<div class="px tab">${t}</div>`).join('')}</div></div></div>
      <div class="ticket__text">Customers can’t <span class="kp">sign in</span> to the <span class="kp">desktop client</span> on <span class="kp">Mac</span>.</div>
      ${['A', 'B', 'C'].map(t => `<div class="note"><b>${t}</b> findings from team ${t}’s logs</div>`).join('')}
      <div class="note"><b>D E F</b> findings from three more teams</div>
    </div>
    <div class="pos chip px src src1" style="left:11%">past incidents</div>
    <div class="pos chip px src src2" style="left:89%">team documents</div>
    ${box('A', 22, 78, ' bx0')}${box('B', 50, 78, ' bx1')}${box('C', 78, 78, ' bx2')}
    ${AGENT_X.map((x, i) => `<div class="pos agent ag${i}" style="left:${x}%"></div>`).join('')}
    ${AGENT_X.map((x, i) => `<div class="pos chip px vote v1-${i}" style="left:${x + 6}%">→ ${'ABC'[i]}</div>`).join('')}
    ${AGENT_X.map((x, i) => `<div class="pos chip px vote v2-${i}" style="left:${x + 6}%">→ ${'EEF'[i]}</div>`).join('')}
    ${AGENT_X.map((x, i) => `<div class="pos dot d${i}" style="left:${x}%; top:70%"></div>`).join('')}
    <div class="pos chip px stamp stamp--no">no majority</div>
    <div class="pos chip px stamp stamp--yes">team E · 2 of 3</div>
    <div class="pos chip px round r1">round 1</div>
    <div class="pos chip px round r2">round 2</div>
    <div class="pos cap c1">Analyzer: pull out the key phrases.</div>
    <div class="pos cap c2">Decider: shortlist teams from history and docs.</div>
    <div class="pos cap c3">Each team’s agent reads its own logs.</div>
    <div class="pos cap c4">Findings go on the ticket. No majority.</div>
    <div class="pos cap c5">Next round: new teams, a richer ticket.</div>
    <div class="pos cap c6">Two of three agree: assigned.</div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  const q = (sel: string) => f.querySelector(sel)!
  const stages = [q('.st0'), q('.st1'), q('.st2')]
  const active = (i: number, t: number) => stages.forEach((st, j) => tl.to(st, { backgroundColor: j === i ? C.ink : C.surface, color: j === i ? 'var(--pm-color-bg)' : C.ink, duration: 0.25 }, t))
  gsap.set(f.querySelectorAll('.tabset'), { autoAlpha: 0 })
  gsap.set(q('.loop'), { drawSVG: 0 })
  // analyze: the Analyzer marks three key phrases.
  active(0, s(0) + 0.2)
  m.caption(q('.c1'), s(0) + 0.5, s(0) + 3.8)
  f.querySelectorAll('.kp').forEach((kp, i) => tl.to(kp, { backgroundColor: C.soft, color: C.accent, duration: 0.3 }, s(0) + 1.2 + i * 0.45))
  // The Decider: past incidents and team documents fly into the ticket, which gets its shortlist.
  active(1, s(0) + 4.0)
  m.caption(q('.c2'), s(0) + 4.0, s(1) + 0.1)
  m.enter([q('.src1'), q('.src2')], s(0) + 4.2, { from: 'scale', stagger: 0.15 })
  tl.to(q('.src1'), { left: '32%', autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, s(0) + 5.1)
  tl.to(q('.src2'), { left: '68%', autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, s(0) + 5.1)
  tl.to(q('.tabset--1'), { autoAlpha: 1, duration: 0.3 }, s(0) + 5.9)
  m.emphasize(q('.tabset--1'), s(0) + 5.9, 1.15)
  // vote: the agents open their logs and write onto the ticket.
  active(2, s(1) + 0.2)
  const lids = [...f.querySelectorAll('.box__lid')]
  tl.to(lids, { scaleY: 0, duration: 0.4, stagger: 0.15, ease: 'power2.in' }, s(1) + 0.4)
  m.enter(f.querySelectorAll('.agent'), s(1) + 0.6, { from: 'scale', stagger: 0.15 })
  m.caption(q('.c3'), s(1) + 0.6, s(1) + 3.6)
  m.enter(q('.illus'), s(1) + 0.6, { from: 'fade' })
  const notes = [...f.querySelectorAll<HTMLElement>('.note')]
  AGENT_X.forEach((x, i) => {
    const t = s(1) + 1.3 + i * 0.35
    gsap.set(q(`.d${i}`), { autoAlpha: 0 })
    tl.to(q(`.d${i}`), { autoAlpha: 1, duration: 0.1 }, t)
    tl.to(q(`.d${i}`), { top: '45%', left: '50%', duration: 0.7, ease: 'power2.inOut' }, t)
    tl.to(q(`.d${i}`), { autoAlpha: 0, duration: 0.1 }, t + 0.65)
    tl.to(notes[i]!, { height: '2.6cqw', duration: 0.4, ease: 'power2.out' }, t + 0.6)
  })
  // Round 1 splits.
  m.enter(f.querySelectorAll('[class*="v1-"]'), s(1) + 3.8, { from: 'scale', stagger: 0.15 })
  m.caption(q('.c4'), s(1) + 3.8, s(1) + 6.6)
  m.enter(q('.r1'), s(1) + 3.8, { from: 'fade' })
  m.enter(q('.stamp--no'), s(1) + 4.6, { from: 'scale' })
  // Round 2: back to the Decider, three new teams, one more finding.
  m.exit([q('.stamp--no'), ...f.querySelectorAll('[class*="v1-"]'), q('.r1')], s(1) + 6.7)
  m.caption(q('.c5'), s(1) + 6.8, s(1) + 9.4)
  tl.to(q('.loop'), { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut' }, s(1) + 6.9)
  active(1, s(1) + 7.4)
  m.enter(q('.r2'), s(1) + 7.2, { from: 'fade' })
  tl.to(q('.tabset--1'), { autoAlpha: 0, duration: 0.25 }, s(1) + 7.5)
  tl.to(q('.tabset--2'), { autoAlpha: 1, duration: 0.25 }, s(1) + 7.6)
  f.querySelectorAll('.box__letter').forEach((el, i) => tl.to(el, { text: 'DEF'[i]!, duration: 0.01 }, s(1) + 7.7))
  active(2, s(1) + 8.1)
  tl.to(notes[3]!, { height: '2.6cqw', duration: 0.4, ease: 'power2.out' }, s(1) + 8.3)
  m.enter(f.querySelectorAll('[class*="v2-"]'), s(1) + 9.0, { from: 'scale', stagger: 0.15 })
  m.enter(q('.stamp--yes'), s(1) + 9.8, { from: 'scale' })
  m.caption(q('.c6'), s(1) + 9.6)
  return tl
})
