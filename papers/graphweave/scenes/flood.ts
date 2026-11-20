import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, box, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Four thousand reports. Paper, Table 2. `flood`: eight testers are wired to three mature graph databases, 12 hours
// for each pair, and their raw reports pour into a waffle (one square = 10 reports) while a counter rolls to 4,114.
// `split`: the 314 squares that are false positives (3,136 reports, 76%) turn red, spread through the pile as they
// were in the campaigns; under the pile, GraphGenie's 527 reports on FalkorDB split into 249 false positives and 278
// reports of one single bug.
const CAPTIONS = [
  'Eight testers, 12 h on three mature databases: 4,114 reports',
  '76% are false positives; most of the rest are duplicates',
]
const TESTERS = ['GDsmith', 'GDBMeter', 'Gamera', 'GraphGenie', 'GraspDB', 'GRev', 'GSlicer', 'Dinkel']
const DBS = ['Neo4j', 'Memgraph', 'FalkorDB']
const RAW = 4114, FP = 3136, PER = 10
const CELLS = Math.ceil(RAW / PER) // 412
const RED = Math.round(FP / PER) // 314
const COLS = 30, CELL = 18, STEP = 22, WX = 566, WY = 132
// GraphGenie on FalkorDB (§4.2): 527 raw, 249 false positives, 278 reports of one bug
const GG = { raw: 527, fp: 249, dup: 278 }
const GX = 566, GY = 562, GPX = 1.2

/** A seeded shuffle, so the red squares fall in the same places on every build. */
function redSet(): Set<number> {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const idx = Array.from({ length: CELLS }, (_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return new Set(idx.slice(0, RED))
}

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .tile-name { font-size: 15px; }
    .db-name { font-size: 22px; font-weight: 600; }
    .db-sub { font-size: 15px; }
    .wire { stroke: ${C.line}; stroke-width: 1.5; fill: none; }
    .feed { stroke: ${C.ink}; stroke-width: 3; fill: none; }
    .cell { fill: ${C.ink}; }
    .count { font-size: 46px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .count-unit { font-size: 22px; }
    .key { font-size: 15px; }
    .fp-label { font-size: 24px; font-weight: 600; }
    .gg-label { font-size: 17px; }
    .gg-num { font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .bracket { stroke: ${C.muted}; stroke-width: 2; fill: none; }
  `
  const reds = redSet()
  const tiles = TESTERS.map((t, i) => {
    const y = 112 + i * 56
    return `<g class="tile tile-${i}">${box(48, y, 170, 40)}<text class="px tile-name" x="62" y="${y + 26}">${t.toUpperCase()}</text></g>`
  }).join('')
  const dbY = [150, 300, 450]
  const dbs = DBS.map((d, j) => `<g class="db db-${j}">${box(312, dbY[j], 180, 84)}
      <text class="db-name" x="330" y="${dbY[j] + 38}">${d}</text>
      <text class="db-sub muted" x="330" y="${dbY[j] + 64}">12 h per tester</text></g>`).join('')
  const wires = TESTERS.map((_, i) => DBS.map((__, j) => {
    const y1 = 132 + i * 56, y2 = dbY[j] + 42
    return `<path class="wire" d="M218 ${y1} C 262 ${y1}, 268 ${y2}, 312 ${y2}" />`
  }).join('')).join('')
  // each database's reports flow into the pile: the feeds bend into the waffle's left edge
  const feedTo = [WY + 60, WY + 154, WY + 248]
  const feeds = dbY.map((y, j) => `<path class="feed" d="M498 ${y + 42} C 530 ${y + 42}, 526 ${feedTo[j]}, ${WX - 10} ${feedTo[j]}" />`).join('')
  const cells = Array.from({ length: CELLS }, (_, k) => {
    const x = WX + (k % COLS) * STEP, y = WY + Math.floor(k / COLS) * STEP
    return `<rect class="cell cell-${k}${reds.has(k) ? ' red' : ''}" x="${x}" y="${y}" width="${CELL}" height="${CELL}" />`
  }).join('')
  const rows = Math.ceil(CELLS / COLS)
  const below = WY + rows * STEP + 52
  const ggRed = GG.fp * GPX, ggGrey = GG.dup * GPX
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="wires">${wires}</g>
    ${tiles}
    ${dbs}
    <g class="feeds">${feeds}</g>
    ${cells}
    <text class="count" x="${WX}" y="${below}"><tspan class="num">0</tspan><tspan class="count-unit" dx="12">reports</tspan></text>
    <text class="key muted" x="${WX + COLS * STEP - 4}" y="${WY - 12}" text-anchor="end">1 square = 10 reports</text>
    <text class="fp-label bad fp-label-el" x="${WX + 330}" y="${below - 8}" opacity="0">3,136 false positives · 76%</text>
    <g class="gg" opacity="0">
      <text class="gg-label" x="${GX}" y="${GY - 12}"><tspan style="font-weight:600">GraphGenie on FalkorDB:</tspan> 527 reports</text>
      <rect class="gg-red" x="${GX}" y="${GY}" width="${ggRed}" height="30" style="fill:${C.bad}" />
      <rect class="gg-grey" x="${GX + ggRed}" y="${GY}" width="${ggGrey}" height="30" style="fill:${C.dim}" />
      <text class="gg-num gg-n1" x="${GX + ggRed / 2}" y="${GY + 21}" text-anchor="middle" style="fill:${C.white}">249 false</text>
      <text class="gg-num gg-n2" x="${GX + ggRed + ggGrey / 2}" y="${GY + 21}" text-anchor="middle" style="fill:${C.ink}">278 real reports</text>
      <g class="gg-bracket">
        <path class="bracket" d="M${GX + ggRed + 2} ${GY + 40} v 10 H ${GX + ggRed + ggGrey - 2} v -10" />
        <text class="gg-label" x="${GX + ggRed + ggGrey / 2}" y="${GY + 74}" text-anchor="middle"><tspan style="font-weight:600">all one bug</tspan></text>
      </g>
    </g>
    <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, TABLE 2 · NEO4J, MEMGRAPH, FALKORDB</text>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // flood: testers, wires, databases, then the reports pour in as the counter rolls
  tl.fromTo(all('.tile'), { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.07 }, s(0, 0.1))
  tl.fromTo(all('.db'), { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.12 }, s(0, 0.5))
  tl.fromTo(all('.wire'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.012, ease: 'power2.inOut' }, s(0, 0.7))
  tl.fromTo(all('.feed'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.35, stagger: 0.1 }, s(0, 1.4))
  const POUR = 4.6
  tl.fromTo(all('.cell'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.12, stagger: POUR / CELLS }, s(0, 1.7))
  tl.fromTo(one('.count'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 1.6))
  tl.fromTo(one('.num'), { textContent: 0 }, {
    textContent: RAW, duration: POUR, ease: 'none',
    modifiers: { textContent: (v: number | string) => Math.round(Number(v)).toLocaleString('en-US') },
  }, s(0, 1.7))

  // split: the false positives turn red where they sit, then one campaign is opened up
  tl.to(all('.cell.red'), { fill: C.bad, duration: 0.2, stagger: 0.9 / RED }, s(1, 0.15))
  tl.fromTo(one('.fp-label-el'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, s(1, 1.2))
  tl.fromTo(one('.gg'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, 1.9))
  tl.fromTo(one('.gg-red'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, s(1, 2.0))
  tl.fromTo(one('.gg-grey'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, s(1, 2.5))
  tl.fromTo(one('.gg-n1'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, s(1, 2.5))
  tl.fromTo(one('.gg-n2'), { opacity: 0 }, { opacity: 1, duration: 0.25 }, s(1, 3.0))
  tl.fromTo(one('.gg-bracket'), { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35 }, s(1, 3.4))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
