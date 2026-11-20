import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, box, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Two queries, one plan. `collapse` (paper, Fig. 6): a source query and its equivalent rewrite (direction reversed,
// `WHERE true` added). Each compiles, bottom up, to Neo4j's plan; the two plans are the same five operators, so they
// slide into one; both return 500, and a bug in that one plan would give both the same wrong count, so the pair can
// never disagree. `collapse`'s plans merge on the bar after the music changes section (27.75 s, 1.85 s into the state).
// `ratios` (Table 5): the share of comparable equivalent pairs that share a plan, four testers by three databases,
// all inside a red band from 5% to 34%.
const CAPTIONS = [
  'A rewrite compiled to the same plan can never disagree',
  "5–34% of each tester's equivalent pairs share one plan",
]
const PLAN = ['ProduceResults  cnt', 'EagerAggregation  count(*)', 'Filter  b:B', 'Expand(All)  (a)-[:R]->(b)', 'NodeByLabelScan  a:A']
const OPW = 420, OPH = 40, OPG = 10, PY = 236
const LX = 108, RX = 752, MX = 430, CW = 450, CL = LX - 15, CR = RX - 15
// Table 5: same-plan ratio (%), Neo4j / Memgraph / FalkorDB
const RATIOS: [string, number[]][] = [
  ['GraphGenie', [11.29, 15.34, 18.94]],
  ['GRev', [13.71, 5.79, 19.76]],
  ['GraspDB', [5.5, 26.67, 33.24]],
  ['Dinkel', [27.44, 17.44, 34.21]],
]
const DBS = ['Neo4j', 'Memgraph', 'FalkorDB']
const AX = 330, APX = 21, AY = 176, AROW = 96

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .q { font-size: 19px; }
    .q-tag { font-size: 15px; }
    .op { fill: ${C.white}; stroke: ${C.ink}; stroke-width: 2.5; }
    .op-text { font-size: 17px; }
    .link { stroke: ${C.ink}; stroke-width: 2.5; }
    .under { fill: ${C.ink}; }
    .same { font-size: 22px; }
    .res { font-size: 34px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .note { font-size: 20px; font-weight: 600; }
    .bug { fill: ${C.bad}; }
    .t-name { font-size: 22px; font-weight: 600; }
    .axis { stroke: ${C.ink}; stroke-width: 2; }
    .grid { stroke: ${C.line}; stroke-width: 1.5; }
    .tick { font-size: 15px; fill: ${C.muted}; }
    .band { fill: ${C.badSoft}; stroke: ${C.bad}; stroke-width: 2; }
    .dot { fill: ${C.ink}; stroke: ${C.white}; stroke-width: 2; }
    .leg { font-size: 17px; }
    .band-label { font-size: 22px; font-weight: 600; }
    .val { font-size: 16px; font-variant-numeric: tabular-nums; }
  `
  const plan = (x: number, cls: string) => `<g class="${cls}">${PLAN.map((op, i) => {
    const y = PY + i * (OPH + OPG)
    const link = i < PLAN.length - 1 ? `<line class="link" x1="${x + OPW / 2}" y1="${y + OPH}" x2="${x + OPW / 2}" y2="${y + OPH + OPG}" />` : ''
    return `<g class="op-g op-${i}"><rect class="op" x="${x}" y="${y}" width="${OPW}" height="${OPH}" />
      <text class="mono op-text" x="${x + 16}" y="${y + 26}">${op.replace('->', '-&gt;')}</text>${link}</g>`
  }).join('')}</g>`
  const shape = (k: number, x: number, y: number) => k === 0
    ? `<circle class="dot" cx="${x}" cy="${y}" r="11" />`
    : k === 1 ? `<rect class="dot" x="${x - 10}" y="${y - 10}" width="20" height="20" />`
      : `<path class="dot" d="M${x} ${y - 13} L ${x + 13} ${y} L ${x} ${y + 13} L ${x - 13} ${y} Z" />`
  const rows = RATIOS.map(([name, vals], i) => {
    const y = AY + 60 + i * AROW
    return `<g class="r-row r-row-${i}">
      <text class="t-name" x="${AX - 24}" y="${y + 8}" text-anchor="end">${name}</text>
      <line class="grid" x1="${AX}" y1="${y}" x2="${AX + 40 * APX}" y2="${y}" />
      ${vals.map((v, k) => `<g class="dot-g dot-${i}-${k}">${shape(k, AX + v * APX, y)}</g>`).join('')}
    </g>`
  }).join('')
  const ticks = [0, 10, 20, 30, 40].map(v => `<line class="axis" x1="${AX + v * APX}" y1="${AY + 4 * AROW + 30}" x2="${AX + v * APX}" y2="${AY + 4 * AROW + 40}" />
    <text class="tick" x="${AX + v * APX}" y="${AY + 4 * AROW + 62}" text-anchor="middle">${v}%</text>`).join('')
  const lo = 5.5, hi = 34.21
  const legend = DBS.map((d, k) => `<g transform="translate(${AX + 40 * APX - 360 + k * 130}, ${AY - 6})">${shape(k, 0, 0)}<text class="leg" x="20" y="6">${d}</text></g>`).join('')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="collapse">
      <g class="card-l">${box(CL, 96, CW, 100)}
        <text class="px q-tag muted" x="${CL + 16}" y="122">SOURCE</text>
        <text class="mono q" x="${CL + 16}" y="152">MATCH (a:A)-[:R]-&gt;(b:B)</text>
        <text class="mono q" x="${CL + 16}" y="180">RETURN count(*) AS cnt</text>
      </g>
      <g class="card-r">${box(CR, 96, CW, 100)}
        <text class="px q-tag muted" x="${CR + 16}" y="122">EQUIVALENT REWRITE</text>
        <text class="mono q" x="${CR + 16}" y="152"><tspan class="d1">MATCH (b:B)&lt;-[:R]-(a:A)</tspan> <tspan class="d2">WHERE true</tspan></text>
        <text class="mono q" x="${CR + 16}" y="180">RETURN count(*) AS cnt</text>
        <rect class="under under-1" x="${CR + 16}" y="158" width="262" height="3" />
        <rect class="under under-2" x="${CR + 290}" y="158" width="114" height="3" />
      </g>
      ${plan(LX, 'plan-l')}
      ${plan(RX, 'plan-r')}
      <text class="px same muted same-l" x="${MX + OPW / 2}" y="${PY - 12}" text-anchor="middle" opacity="0">ONE PLAN</text>
      <path class="bug bug-mark" d="M${MX + OPW + 18} ${PY + 3 * (OPH + OPG) + 20} l 22 -14 v 28 z" opacity="0" />
      <text class="note bad bug-note" x="${MX + OPW + 50}" y="${PY + 3 * (OPH + OPG) + 27}" opacity="0">a bug here?</text>
      <g class="results" opacity="0">
        <text class="res" x="${MX + 60}" y="520" text-anchor="middle">500</text>
        <text class="res" x="${MX + OPW / 2}" y="520" text-anchor="middle">=</text>
        <text class="res" x="${MX + OPW - 60}" y="520" text-anchor="middle">500</text>
      </g>
      <text class="note bad verdict" x="640" y="580" text-anchor="middle" opacity="0">equal by construction: the pair cannot disagree,</text>
      <text class="note bad verdict2" x="640" y="610" text-anchor="middle" opacity="0">even when the shared plan is wrong</text>
      <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, FIG. 6 · NEO4J EXPLAIN</text>
    </g>
    <g class="ratios" opacity="0">
      <rect class="band" x="${AX + lo * APX}" y="${AY + 20}" width="${(hi - lo) * APX}" height="${4 * AROW - 10}" />
      <text class="band-label bad" x="${AX + ((lo + hi) / 2) * APX}" y="${AY + 4 * AROW + 2}" text-anchor="middle">same plan: 5–34% of pairs</text>
      <line class="axis" x1="${AX}" y1="${AY + 4 * AROW + 30}" x2="${AX + 40 * APX}" y2="${AY + 4 * AROW + 30}" />
      ${ticks}
      ${legend}
      ${rows}
      <text class="val bad" x="${AX + lo * APX + 4}" y="${AY + 60 + 2 * AROW - 22}" text-anchor="start">5.5%</text>
      <text class="val bad" x="${AX + hi * APX}" y="${AY + 60 + 3 * AROW - 20}" text-anchor="middle">34.2%</text>
      <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, TABLE 5 · 5,000 PAIRS PER RUN, MEAN OF 3 RUNS</text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // collapse: the two wordings, their differences, each plan built from its scan up, then the plans merge
  tl.fromTo(one('.card-l'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 }, s(0, 0.1))
  tl.fromTo(one('.card-r'), { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 }, s(0, 0.35))
  tl.fromTo(one('.under-1'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.4 }, s(0, 0.8))
  tl.fromTo(one('.under-2'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.3 }, s(0, 1.1))
  for (const side of ['l', 'r']) {
    for (let i = PLAN.length - 1; i >= 0; i--) {
      const t = 1.4 + (PLAN.length - 1 - i) * 0.2 + (side === 'r' ? 0.1 : 0)
      tl.fromTo(one(`.plan-${side} .op-${i}`), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, s(0, t))
    }
  }
  // 3.69 s in is the bar after the music's section change: the plans meet there
  const M = 3.69
  tl.fromTo(one('.plan-l'), { x: 0 }, { x: MX - LX, duration: 0.6, ease: 'power3.inOut' }, s(0, M - 0.55))
  tl.fromTo(one('.plan-r'), { x: 0 }, { x: MX - RX, duration: 0.6, ease: 'power3.inOut' }, s(0, M - 0.55))
  tl.fromTo(all('.plan-r .op'), { stroke: C.ink }, { stroke: C.bad, duration: 0.2 }, s(0, M + 0.05))
  tl.fromTo(all('.plan-l .op'), { stroke: C.ink }, { stroke: C.bad, duration: 0.2 }, s(0, M + 0.05))
  tl.fromTo(one('.same-l'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, M + 0.1))
  tl.fromTo(one('.results'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, s(0, M + 0.5))
  tl.fromTo(one('.verdict'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, M + 0.9))
  tl.fromTo(one('.bug-mark'), { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.3 }, s(0, M + 1.7))
  tl.fromTo(one('.bug-note'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, M + 1.8))
  tl.fromTo(one('.verdict2'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, M + 2.1))

  // ratios: the single example gives way to every tester's share of such pairs
  tl.to(one('.collapse'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, s(1, 0.05))
  tl.fromTo(one('.ratios'), { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, s(1, 0.35))
  gsap.set(one('.band'), { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set([...all('.r-row')], { opacity: 0 })
  gsap.set([...all('.dot-g')], { opacity: 0 })
  RATIOS.forEach((_, i) => {
    tl.fromTo(one(`.r-row-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, s(1, 0.4 + i * 0.12))
    for (let k = 0; k < 3; k++) {
      tl.fromTo(one(`.dot-${i}-${k}`), { opacity: 0, x: -RATIOS[i][1][k] * APX }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', immediateRender: false }, s(1, 0.9 + i * 0.22 + k * 0.06))
    }
  })
  tl.fromTo(one('.band'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, s(1, 2.3))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
