import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { binAt, BINS_CSS, binsSvg, cardsSvg, centre, dotsSvg, edgesSvg, gridAt, INCIDENT_CSS, PAPERS } from './lib/incident.ts'

// Same data, different goals. Starts where "One incident, 135 papers" rests. `bins`: the incident dims and the papers
// drop into the usual three bins, by the data they read. `goals`: the incident comes back, and two papers lifted out
// of the same bin fly to different events: one to the trigger (an SRE restoring service), one to the root cause
// (a developer fixing it for good). Same data, different goals.
const LIFT = { trigger: 0, cause: 3 } // two papers of the "metrics" bin (i % 3 === 0)

const CAPTIONS = ['Sorted by input data, they look alike', 'Same data, different goals']

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const css = `${INCIDENT_CSS}${BINS_CSS}
    .tag rect { stroke: var(--pm-color-ink); stroke-width: 2.5; }
    .tag text { font-size: 18px; fill: #ffffff; font-weight: 600; }
  `
  const tag = (cls: string, x: number, y: number, text: string, fill: string) =>
    `<g class="tag ${cls}" opacity="0"><rect x="${x}" y="${y}" width="${text.length * 10 + 24}" height="34" style="fill:${fill}" /><text x="${x + 12}" y="${y + 23}" style="fill:#ffffff">${text}</text></g>`
  const tc = centre('trigger'), cc = centre('cause')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="incident">${edgesSvg()}${cardsSvg()}</g>
    <g class="bins" opacity="0">${binsSvg()}</g>
    <g class="papers">${dotsSvg()}</g>
    ${tag('tag-trigger', tc.x - 110, 238, 'restore service · SRE', COLOR.trigger)}
    ${tag('tag-cause', cc.x - 110, 238, 'fix for good · developer', COLOR.cause)}
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const papers = Array.from(all('.paper'))
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // bins
  tl.fromTo(one('.incident'), { opacity: 1 }, { opacity: 0.25, duration: 0.5 }, s(0, 0.2))
  tl.fromTo(one('.bins'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 0.4))
  tl.fromTo(papers, { x: (i: number) => gridAt(i).x, y: (i: number) => gridAt(i).y },
    { x: (i: number) => binAt(i).x, y: (i: number) => binAt(i).y, duration: 1.1, ease: 'power2.inOut', stagger: 1.8 / PAPERS }, s(0, 0.8))

  // goals: two papers of one bin go to different events
  tl.fromTo(one('.incident'), { opacity: 0.25 }, { opacity: 1, duration: 0.5, immediateRender: false }, s(1, 0.1))
  ;([['trigger', tc], ['cause', cc]] as const).forEach(([id, c], k) => {
    const dot = papers[LIFT[id]]!
    const t = s(1, 0.8 + k * 3.2)
    tl.fromTo(dot, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.8, duration: 0.3, immediateRender: false }, t)
    tl.set(dot, { attr: { class: `paper paper-${LIFT[id]} lifted` } }, t)
    tl.fromTo(dot, { x: binAt(LIFT[id]).x, y: binAt(LIFT[id]).y }, { x: c.x, y: c.y - 75 - 22, duration: 1.0, ease: 'power3.inOut', immediateRender: false }, t + 0.3)
    tl.fromTo(one(`.tag-${id}`), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t + 1.3)
  })
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
