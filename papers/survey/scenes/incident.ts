import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, frame, playCaptions, sec } from './lib/frame.ts'
import { cardsSvg, dotsSvg, edgesSvg, gridAt, INCIDENT_CSS, PAPERS } from './lib/incident.ts'

// One incident, 135 papers. `incident`: the three cards of the paper's OOM example arrive in the order the incident
// runs (the leaking code, the surge that sets it off, memory climbing to 100%), joined by the dashed path that RCA
// should recover. `papers`: the 135 surveyed papers fall into a grid above it; under them, how many return the whole
// chain: zero.
const CAPTIONS = ['An incident: root cause → trigger → symptom', '135 RCA papers try to recover it']

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const css = `${INCIDENT_CSS}
    .papers .paper { opacity: 0; }
    .count { font-size: 30px; font-weight: 600; }
    .zero { font-size: 22px; }
    .brand { font-size: 15px; }
  `
  const svg = `
    ${captionsSvg(CAPTIONS)}
    ${edgesSvg()}
    ${cardsSvg()}
    <g class="papers">${dotsSvg()}</g>
    <text class="count" x="985" y="152" opacity="0">135 papers</text>
    <text class="zero" x="640" y="545" text-anchor="middle" opacity="0">papers that return this whole chain: <tspan style="font-weight:600">0</tspan></text>
    <text class="mono muted brand" x="40" y="696" opacity="0">A GOAL-DRIVEN SURVEY ON ROOT CAUSE ANALYSIS · ARXIV 2025</text>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // incident
  tl.fromTo(one('.brand'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, s(0, 0.3))
  ;(['cause', 'trigger', 'symptom'] as const).forEach((id, i) => {
    const t = s(0, [0.6, 3.0, 5.4][i]!)
    tl.fromTo(one(`.card-${id}`), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, t)
    if (id !== 'cause') tl.fromTo(one(`.spark-${id}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.in' }, t + 0.5)
  })
  ;[0, 1].forEach(i => {
    tl.fromTo(one(`.edge-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.5 }, s(0, 2.5 + i * 2.4))
    tl.fromTo(one(`.arrow-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.8 + i * 2.4))
  })

  // papers
  tl.fromTo(all('.paper'), { opacity: 0, x: (i: number) => gridAt(i).x, y: (i: number) => gridAt(i).y - 60 },
    { opacity: 1, x: (i: number) => gridAt(i).x, y: (i: number) => gridAt(i).y, duration: 0.45, stagger: { each: 1.6 / PAPERS, from: 'center', grid: [5, 27] }, immediateRender: false }, s(1, 0.1))
  tl.fromTo(one('.count'), { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, s(1, 0.5))
  tl.fromTo(one('.zero'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, s(1, 2.4))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
