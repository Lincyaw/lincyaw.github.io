import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Nineteen bugs in NeuG. Paper, Fig. 10 and §6.4. `bugs`: the unique bugs each integrated tester finds on NeuG 0.1.1,
// run until its count stops growing, grow as ink bars; their sets overlap, and together under GraphWeave they make
// one purple bar of 19, all reported, all confirmed, 13 fixed. `end`: the chart dims under the line to remember and
// the paper's card. The end card starts on the bar where the music changes section (57.29 s).
const CAPTIONS = [
  'On NeuG no tester finds more than 9; together, 19 new bugs',
  null,
]
const ROWS: [string, number][] = [
  ['GDsmith', 2], ['GraphGenie', 3], ['GRev', 2], ['GraspDB', 4], ['Dinkel', 9], ['Gamera', 2], ['GSlicer', 3], ['GDBMeter', 3],
]
const TOTAL = 19
const X0 = 300, PX = 42, Y0 = 108, ROW = 46, BAR = 30

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .name { font-size: 19px; }
    .bar { fill: ${C.ink}; }
    .tot { fill: ${C.weave}; stroke: ${C.ink}; stroke-width: 2.5; }
    .val { font-size: 19px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .tot-name { font-size: 22px; font-weight: 600; }
    .tot-val { font-size: 34px; font-weight: 600; }
    .axis { stroke: ${C.ink}; stroke-width: 2; }
    .tick { font-size: 15px; fill: ${C.muted}; }
    .rule { stroke: ${C.line}; stroke-width: 2; stroke-dasharray: 6 6; }
    .conf { font-size: 24px; font-weight: 600; }
    .end-line { font-size: 46px; font-weight: 600; }
    .title { font-size: 25px; font-weight: 600; }
    .byline { font-size: 21px; }
    .links { font-size: 17px; }
  `
  const rows = ROWS.map(([name, n], i) => {
    const y = Y0 + i * ROW
    return `<g class="row row-${i}">
      <text class="name" x="${X0 - 18}" y="${y + 22}" text-anchor="end">${name}</text>
      <rect class="bar bar-${i}" x="${X0}" y="${y}" width="${n * PX}" height="${BAR}" />
      <text class="val val-${i}" x="${X0 + n * PX + 10}" y="${y + 22}">${n}</text>
    </g>`
  }).join('')
  const ty = Y0 + ROWS.length * ROW + 28
  const ticks = [0, 5, 10, 15, 20].map(v => `<line class="axis" x1="${X0 + v * PX}" y1="${ty + BAR + 22}" x2="${X0 + v * PX}" y2="${ty + BAR + 30}" />
    <text class="tick" x="${X0 + v * PX}" y="${ty + BAR + 50}" text-anchor="middle">${v}</text>`).join('')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="picture">
      <line class="axis" x1="${X0}" y1="${Y0 - 12}" x2="${X0}" y2="${ty + BAR + 22}" />
      <line class="axis" x1="${X0}" y1="${ty + BAR + 22}" x2="${X0 + 20 * PX}" y2="${ty + BAR + 22}" />
      ${ticks}
      <text class="tick" x="${X0 + 10 * PX}" y="${ty + BAR + 74}" text-anchor="middle">unique bugs found on NeuG</text>
      ${rows}
      <line class="rule" x1="${X0}" y1="${ty - 14}" x2="${X0 + 20 * PX}" y2="${ty - 14}" />
      <g class="total">
        <text class="tot-name weave" x="${X0 - 18}" y="${ty + 23}" text-anchor="end">GraphWeave</text>
        <rect class="tot tot-bar" x="${X0}" y="${ty}" width="${TOTAL * PX}" height="${BAR + 4}" />
        <text class="tot-val weave tot-v" x="${X0 + TOTAL * PX + 12}" y="${ty + 30}">19</text>
      </g>
      <text class="conf weave conf-el" x="760" y="200">all 19 confirmed · 13 already fixed</text>
      <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, FIG. 10 · NEUG 0.1.1 · OVERLAPPING SETS</text>
    </g>
    <g class="endcard" opacity="0">
      <rect x="0" y="0" width="1280" height="720" style="fill:${C.paper};opacity:0.96" />
      <text class="end-line" x="640" y="214" text-anchor="middle">Filter reports with learned rules.</text>
      <text class="end-line" x="640" y="274" text-anchor="middle">Skip the pairs that share a plan.</text>
      <line x1="440" y1="330" x2="840" y2="330" style="stroke:${C.weave};stroke-width:4" />
      <text class="title" x="640" y="400" text-anchor="middle">Uncovering Systematic Blind Spots in Graph Database Testing</text>
      <text class="title" x="640" y="434" text-anchor="middle">through Integration and Process-Level Analysis</text>
      <text class="byline" x="640" y="492" text-anchor="middle">Li, <tspan style="font-weight:600">Fang</tspan>, Lai, Xie, Zhao, Shao, Zhang, He · arXiv 2026</text>
      <text class="mono links muted" x="640" y="536" text-anchor="middle">arxiv.org/abs/2611.07754</text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // bugs: each tester's bar, then the one total bar, then its confirmation
  ROWS.forEach((_, i) => {
    tl.fromTo(one(`.row-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(0, 0.1 + i * 0.12))
    tl.fromTo(one(`.bar-${i}`), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, s(0, 0.2 + i * 0.12))
    tl.fromTo(one(`.val-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(0, 0.7 + i * 0.12))
  })
  tl.fromTo(one('.total'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(0, 1.9))
  tl.fromTo(one('.tot-bar'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, s(0, 2.0))
  tl.fromTo(one('.tot-v'), { opacity: 0, scale: 1.4, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, s(0, 3.0))
  tl.fromTo(one('.conf-el'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, s(0, 3.5))
  // end
  tl.fromTo(one('.endcard'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, s(1, 0.05))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
