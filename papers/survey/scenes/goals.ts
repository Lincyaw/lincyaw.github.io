import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { binAt, BINS_CSS, binsSvg, cardsSvg, centre, clusterAt, dotsSvg, edgesSvg, GOALS_CSS, goalsSvg, INCIDENT_CSS, PAPERS, RING, TRI, TRI_CSS, triangleSvg } from './lib/incident.ts'

// Sorted by goal. Starts where "Same data, different goals" rests. `ring`: the bins and tags go, the incident
// shrinks to the middle, and the seven goals of the survey's taxonomy (Sec. 3.2) form a ring round it; the papers
// leave the bins for the goals. `triangle`: in the middle, the Effectiveness–Data–Cost triangle (Sec. 3.1), the
// survey's reason for the goals: each line of work pushes along one edge.
const CAPTIONS = ['Sorted by goal instead: seven goals', 'Each trades effectiveness, data and cost']

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const css = `${INCIDENT_CSS}${BINS_CSS}${GOALS_CSS}${TRI_CSS}
    .tag rect { stroke: var(--pm-color-ink); stroke-width: 2.5; }
    .tag text { font-size: 18px; fill: #ffffff; font-weight: 600; }
  `
  const tc = centre('trigger'), cc = centre('cause')
  const tag = (cls: string, x: number, text: string, fill: string) =>
    `<g class="tag ${cls}"><rect x="${x}" y="238" width="${text.length * 10 + 24}" height="34" style="fill:${fill}" /><text x="${x + 12}" y="261" style="fill:#ffffff">${text}</text></g>`
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="incident">${edgesSvg()}${cardsSvg()}
      ${tag('tag-trigger', tc.x - 110, 'restore service · SRE', COLOR.trigger)}${tag('tag-cause', cc.x - 110, 'fix for good · developer', COLOR.cause)}</g>
    <g class="bins">${binsSvg()}</g>
    ${goalsSvg()}
    <g class="papers">${dotsSvg()}</g>
    ${triangleSvg()}
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const papers = Array.from(all('.paper'))
  // The rest frame of the previous section: papers in their bins, two of them on the events they serve.
  papers.forEach((p, i) => gsap.set(p, { x: binAt(i).x, y: binAt(i).y }))
  gsap.set(papers[0]!, { x: tc.x, y: tc.y - 97, scale: 1.8, transformOrigin: '50% 50%', attr: { class: 'paper paper-0 lifted' } })
  gsap.set(papers[3]!, { x: cc.x, y: cc.y - 97, scale: 1.8, transformOrigin: '50% 50%', attr: { class: 'paper paper-3 lifted' } })
  gsap.set(one('.slider'), { x: TRI.d.x, y: TRI.d.y })

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  // ring
  tl.fromTo([one('.bins'), ...Array.from(all('.tag'))], { opacity: 1 }, { opacity: 0, duration: 0.4 }, s(0, 0.1))
  tl.fromTo(one('.incident'), { scale: 1, x: 0, y: 0, transformOrigin: `${RING.x}px ${RING.y}px` }, { scale: 0.5, x: 0, y: 0, duration: 0.9, ease: 'power3.inOut' }, s(0, 0.3))
  tl.fromTo(all('.goal'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.45, ease: 'back.out(2)' }, s(0, 1.0))
  tl.fromTo(papers, { x: (i: number) => (i === 0 ? tc.x : i === 3 ? cc.x : binAt(i).x), y: (i: number) => (i === 0 ? tc.y - 97 : i === 3 ? cc.y - 97 : binAt(i).y), scale: (i: number) => (i === 0 || i === 3 ? 1.8 : 1) },
    { x: (i: number) => clusterAt(i).x, y: (i: number) => clusterAt(i).y, scale: 1, duration: 1.0, ease: 'power2.inOut', stagger: 2.6 / PAPERS }, s(0, 1.4))

  // triangle
  tl.fromTo(one('.incident'), { opacity: 1 }, { opacity: 0, duration: 0.4 }, s(1, 0.1))
  tl.fromTo(one('.tri'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, s(1, 0.4))
  tl.fromTo(one('.slider'), { x: TRI.d.x, y: TRI.d.y }, { x: TRI.e.x, y: TRI.e.y, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, s(1, 1.0))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
