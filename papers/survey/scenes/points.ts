import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { CARD_W, CARDS, type CardId, cardsSvg, clusterAt, dotsSvg, edgesSvg, GOALS_CSS, goalsSvg, INCIDENT_CSS, PAPERS, TRI, TRI_CSS, triangleSvg } from './lib/incident.ts'

// Points, not the path. Starts where "Sorted by goal" rests (papers clustered under the seven goals). `points`: the
// goals step back, the incident returns, and the papers settle on its events: most on the root cause, fewer on the
// symptom, few on the trigger (the split is illustrative: the survey states the pattern, Sec. 3.3, not per-event
// counts). The edges stay dark: no paper returns the path. Beside it, what the papers study as root causes:
// resource faults 56.9% (Fig. 8). `hold`: the missing path traces itself in the lens colour, a question mark on it,
// and the paper's card comes up.
const PILES: Record<CardId, number> = { cause: 95, symptom: 32, trigger: 8 }
/** The pile a paper ends in, filled bottom-up above its card. */
const pileAt = (i: number) => {
  let k = i
  for (const id of ['cause', 'symptom', 'trigger'] as CardId[]) {
    if (k < PILES[id]) {
      const c = CARDS[id]
      return { x: c.x + 16 + (k % 12) * 19.5, y: c.y - 16 - Math.floor(k / 12) * 19 }
    }
    k -= PILES[id]
  }
  throw new Error('more papers than piles')
}
// Resource 148, infrastructure 32, service 31, code 22, configuration 16, user request 11 (paper, Fig. 8).
const TYPES = [148, 32, 31, 22, 16, 11]

const CAPTIONS = ['Papers find points, mostly the root cause', null]

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const total = TYPES.reduce((a, b) => a + b, 0)
  let angle = -Math.PI / 2
  const R = 70, DX = 1105, DY = 610
  const slices = TYPES.map((n, i) => {
    const a0 = angle, a1 = angle + (n / total) * 2 * Math.PI
    angle = a1
    const p = (a: number, r: number) => `${(DX + Math.cos(a) * r).toFixed(1)} ${(DY + Math.sin(a) * r).toFixed(1)}`
    const large = a1 - a0 > Math.PI ? 1 : 0
    return `<path class="slice${i === 0 ? ' resource' : ''}" d="M ${p(a0, R)} A ${R} ${R} 0 ${large} 1 ${p(a1, R)} L ${p(a1, 38)} A 38 38 0 ${large} 0 ${p(a0, 38)} Z" />`
  }).join('')
  const a = CARDS.cause, z = CARDS.symptom
  const css = `${INCIDENT_CSS}${GOALS_CSS}${TRI_CSS}
    .slice { fill: var(--pm-color-line); stroke: var(--pm-color-bg); stroke-width: 2; }
    .slice.resource { fill: ${COLOR.cause}; }
    .donut-label { font-size: 20px; font-weight: 600; }
    .zero { font-size: 22px; }
    .path { fill: none; stroke: ${COLOR.lens}; stroke-width: 6; stroke-dasharray: 1 1; stroke-dashoffset: 1; }
    .qmark { font-size: 64px; font-weight: 600; fill: ${COLOR.lens}; }
    .endcard .t { font-size: 34px; font-weight: 600; }
    .endcard .l { font-size: 20px; }
  `
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="incident">${edgesSvg()}${cardsSvg()}</g>
    <g class="was">${goalsSvg(false)}${triangleSvg(false)}</g>
    <g class="papers">${dotsSvg()}</g>
    <text class="mono muted" x="${a.x}" y="96" style="font-size:14px" opacity="0" data-k="illus">ILLUSTRATIVE SPLIT · PAPER, SEC. 3.3</text>
    <text class="zero" x="${a.x}" y="520" opacity="0">papers that return the path: <tspan style="font-weight:600">0</tspan></text>
    <g class="donut" opacity="0">${slices}
      <text class="donut-label" x="${DX - 95}" y="${DY - 4}" text-anchor="end" style="fill:${COLOR.cause}">resource faults 56.9%</text>
      <text class="mono muted" x="${DX - 95}" y="${DY + 22}" text-anchor="end" style="font-size:14px">CAUSES STUDIED · PAPER, FIG. 8</text></g>
    <path class="path" d="M ${a.x + CARD_W + 4} ${a.y + 75} L ${z.x - 6} ${z.y + 75}" pathLength="1" />
    <text class="qmark" x="${(a.x + CARD_W + z.x) / 2 - 18}" y="${a.y + 52}" opacity="0">?</text>
    <g class="endcard" opacity="0">
      <rect x="0" y="0" width="1280" height="720" style="fill:var(--pm-color-bg);opacity:0.88" />
      <text class="t" x="640" y="300" text-anchor="middle">Points found. The path is next.</text>
      <text class="t" x="640" y="420" text-anchor="middle" style="font-size:28px">A Goal-Driven Survey on Root Cause Analysis</text>
      <text class="l" x="640" y="462" text-anchor="middle">Aoyang Fang et al. · 135 papers · arXiv 2025</text>
      <text class="mono muted" x="640" y="500" text-anchor="middle" style="font-size:17px">ARXIV 2510.19593</text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const papers = Array.from(all('.paper'))
  papers.forEach((p, i) => gsap.set(p, { x: clusterAt(i).x, y: clusterAt(i).y }))
  gsap.set([papers[0]!, papers[3]!], { attr: { class: 'paper lifted' } })
  gsap.set(one('.slider'), { x: TRI.e.x, y: TRI.e.y })

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  // points
  tl.fromTo(one('.was'), { opacity: 1 }, { opacity: 0, duration: 0.5 }, s(0, 0.05))
  tl.fromTo(one('.incident'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, s(0, 0.1))
  tl.fromTo(papers, { x: (i: number) => clusterAt(i).x, y: (i: number) => clusterAt(i).y },
    { x: (i: number) => pileAt(i).x, y: (i: number) => pileAt(i).y, duration: 1.1, ease: 'power2.inOut', stagger: 2.2 / PAPERS }, s(0, 0.6))
  tl.fromTo(one('[data-k="illus"]'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 3.2))
  tl.fromTo(all('.edge'), { opacity: 1 }, { opacity: 0.25, duration: 0.25, yoyo: true, repeat: 3 }, s(0, 3.6))
  tl.fromTo(one('.zero'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, s(0, 4.4))
  tl.fromTo(one('.donut'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 5.4))
  tl.fromTo(all('.slice'), { scale: 0, transformOrigin: `${DX}px ${DY}px` }, { scale: 1, duration: 0.5, stagger: 0.08 }, s(0, 5.5))
  // hold
  tl.fromTo(one('.path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power1.inOut' }, s(1, 0.2))
  tl.fromTo(one('.qmark'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, s(1, 1.2))
  tl.fromTo(one('.endcard'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, s(1, 2.4))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
