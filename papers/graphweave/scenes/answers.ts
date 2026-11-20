import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, box, captionsSvg, esc, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Both answers are right. `reuse` (paper, Fig. 2 and Fig. 1b): on a graph of one node with one T4 self-loop, the
// pattern -[:T4]-()-[:T4]- has two relationship slots. FalkorDB lets the one edge fill both slots and returns 1 row;
// Neo4j forbids reusing an edge within a pattern and returns 0. A differential tester reports 1 ≠ 0 as a bug, yet
// both rules are legal: a false positive. `dialect` (Fig. 1a): the same two panels, a query with `WITH *` that Neo4j
// accepts and FalkorDB rejects, until it is rewritten with explicit variables.
const CAPTIONS = [
  'One self-loop, two legal rules: 1 row and 0 rows, both right',
  'Or the database spells the same query differently',
]
const Q1 = 'MATCH (n0:L1)-[:T4]-()-[:T4]-() RETURN 1 AS a7'
const Q2 = 'MATCH (a)-[r]->(b) WITH * RETURN a, b'
// panels: FalkorDB left, Neo4j right
const PX = [420, 852], PY = 196, PW = 380, PH = 360

/** A filled arrowhead whose tip is the line's end, pointing along the line. */
function arrowHead(x1: number, y1: number, x2: number, y2: number, len = 15, half = 7): string {
  const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d
  const bx = x2 - ux * len, by = y2 - uy * len
  return `M${x2} ${y2} L ${bx - uy * half} ${by + ux * half} L ${bx + uy * half} ${by - ux * half} Z`
}

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .q { font-size: 24px; }
    .q-tag { font-size: 15px; }
    .node { fill: ${C.white}; stroke: ${C.ink}; stroke-width: 3; }
    .node-label { font-size: 20px; }
    .loop { fill: none; stroke: ${C.ink}; stroke-width: 3; }
    .edge-label { font-size: 18px; }
    .p-name { font-size: 22px; }
    .p-rule { font-size: 17px; }
    .slot { fill: ${C.white}; stroke: ${C.ink}; stroke-width: 2.5; }
    .slot-name { font-size: 17px; }
    .chip { fill: ${C.paper}; stroke: ${C.ink}; stroke-width: 2.5; }
    .bind { stroke: ${C.ink}; stroke-width: 2.5; fill: none; }
    .head { fill: ${C.ink}; }
    .rows { font-size: 34px; font-weight: 600; }
    .verdict { font-size: 22px; font-weight: 600; }
    .x { font-size: 34px; font-weight: 600; }
    .ahead { fill: ${C.ink}; }
    .ok { font-size: 20px; font-weight: 600; }
    .sub { font-size: 17px; }
    .fpbox { fill: ${C.badSoft}; stroke: ${C.bad}; stroke-width: 3; }
  `
  const panel = (i: number, name: string, rule: string) => `
    <g class="panel panel-${i}">${box(PX[i], PY, PW, PH)}
      <text class="px p-name" x="${PX[i] + 20}" y="${PY + 40}">${name}</text>
      <text class="p-rule muted p-rule-${i}" x="${PX[i] + 20}" y="${PY + 68}">${rule}</text>
    </g>`
  // reuse content inside a panel: two slots, one edge chip, the bindings and the row count
  const reuse = (i: number) => {
    const x = PX[i], cx = x + PW / 2
    const s1 = x + 50, s2 = x + PW - 50 - 120
    const chipY = PY + 220
    const ok = i === 0
    return `<g class="reuse reuse-${i}">
      <rect class="slot" x="${s1}" y="${PY + 104}" width="120" height="46" /><text class="slot-name" x="${s1 + 60}" y="${PY + 133}" text-anchor="middle">slot ①</text>
      <rect class="slot" x="${s2}" y="${PY + 104}" width="120" height="46" /><text class="slot-name" x="${s2 + 60}" y="${PY + 133}" text-anchor="middle">slot ②</text>
      <rect class="chip" x="${cx - 60}" y="${chipY}" width="120" height="44" /><text class="mono slot-name" x="${cx}" y="${chipY + 28}" text-anchor="middle">e:T4</text>
      <path class="bind bind-${i}-1" d="M${s1 + 60} ${PY + 150} L ${cx - 20} ${chipY - 2}" />
      <path class="head head-${i}-1" d="${arrowHead(s1 + 60, PY + 150, cx - 20, chipY - 2)}" />
      ${ok
        ? `<path class="bind bind-${i}-2" d="M${s2 + 60} ${PY + 150} L ${cx + 20} ${chipY - 2}" />
           <path class="head head-${i}-2" d="${arrowHead(s2 + 60, PY + 150, cx + 20, chipY - 2)}" />`
        : `<text class="x bad x-${i}" x="${s2 + 60}" y="${PY + 196}" text-anchor="middle">✗</text>`}
      <text class="rows rows-${i}" x="${cx}" y="${PY + 326}" text-anchor="middle">${ok ? '1 row' : '0 rows'}</text>
    </g>`
  }
  const dialect = (i: number) => {
    const x = PX[i], cx = x + PW / 2
    const okNow = i === 1
    return `<g class="dialect dialect-${i}">
      <text class="mono sub" x="${x + 20}" y="${PY + 130}">WITH *</text>
      <text class="ok ${okNow ? '' : 'bad'} d1-${i}" x="${x + 140}" y="${PY + 131}">${okNow ? 'accepted ✓' : 'rejected ✗'}</text>
      <line x1="${x + 20}" y1="${PY + 200}" x2="${x + PW - 20}" y2="${PY + 200}" style="stroke:${C.line};stroke-width:2" class="d-rule-${i}" />
      <text class="mono sub d2-${i}" x="${x + 20}" y="${PY + 246}">WITH a, r, b</text>
      <text class="ok d3-${i}" x="${x + 186}" y="${PY + 247}">accepted ✓</text>
      <text class="verdict d4-${i}" x="${cx}" y="${PY + 326}" text-anchor="middle">${okNow ? 'accepts both' : 'accepts only the rewrite'}</text>
    </g>`
  }
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="qcard">${box(48, 92, 1184, 70)}
      <text class="px q-tag muted" x="66" y="120">QUERY</text>
      <text class="mono q q1" x="150" y="138">${esc(Q1)}</text>
      <text class="mono q q2" x="150" y="138" opacity="0">${esc(Q2)}</text>
    </g>
    <g class="graph">
      <circle class="node" cx="190" cy="390" r="62" />
      <text class="mono node-label" x="190" y="397" text-anchor="middle">n0:L1</text>
      <path class="loop" d="M236 348 C 330 250, 380 410, 252 404" />
      <path class="head loop-head" d="M252 404 l 16 -9 l -2 15 z" />
      <text class="mono edge-label" x="318" y="300">e:T4</text>
      <text class="sub muted" x="190" y="490" text-anchor="middle">one node, one self-loop</text>
    </g>
    <g class="dgraph" opacity="0">
      <text class="px q-tag muted" x="56" y="300">SAME INTENT,</text>
      <text class="px q-tag muted" x="56" y="322">TWO SPELLINGS</text>
      <text class="sub" x="56" y="370">FalkorDB needs the</text>
      <text class="sub" x="56" y="394">variables named</text>
      <text class="sub" x="56" y="418">after <tspan class="mono">WITH</tspan></text>
    </g>
    ${panel(0, 'FALKORDB', 'edge reuse allowed')}
    ${panel(1, 'NEO4J', 'edge reuse not allowed')}
    <text class="p-rule muted p-dia-0" x="${PX[0] + 20}" y="${PY + 68}" opacity="0">needs explicit variables</text>
    <text class="p-rule muted p-dia-1" x="${PX[1] + 20}" y="${PY + 68}" opacity="0">accepts WITH *</text>
    ${reuse(0)}${reuse(1)}
    <g class="dialects" opacity="0">${dialect(0)}${dialect(1)}</g>
    <g class="report">
      <text class="verdict bad rep-1" x="640" y="610" text-anchor="middle">1 ≠ 0 → a differential tester reports a bug</text>
      <g class="fp">
        <rect class="fpbox" x="380" y="630" width="520" height="48" />
        <text class="verdict bad" x="640" y="662" text-anchor="middle">both rules are legal: a false positive</text>
      </g>
    </g>
    <g class="dfp" opacity="0">
      <rect class="fpbox" x="380" y="590" width="520" height="48" />
      <text class="verdict bad" x="640" y="622" text-anchor="middle">the rejection is a dialect false positive</text>
    </g>
    <text class="px src muted src-1" x="1232" y="706" text-anchor="end">PAPER, FIG. 2 · GDSMITH-STYLE QUERY</text>
    <text class="px src muted src-2" x="1232" y="706" text-anchor="end" opacity="0">PAPER, FIG. 1A</text>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  const hide = (sel: string) => gsap.set(one(sel), { opacity: 0 })

  // reuse: query, graph, the two rules, the bindings one slot at a time, the counts, the report and its verdict
  tl.fromTo(one('.qcard'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 }, s(0, 0.1))
  tl.fromTo(one('.q1'), { text: '' }, { text: Q1, duration: 1.1, ease: 'none' }, s(0, 0.3))
  tl.fromTo(one('.graph'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 1.2))
  tl.fromTo(one('.loop'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, s(0, 1.3))
  tl.fromTo(one('.loop-head'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, s(0, 1.85))
  tl.fromTo(one('.panel-0'), { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.35 }, s(0, 1.9))
  tl.fromTo(one('.panel-1'), { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.35 }, s(0, 2.05))
  ;['.reuse-0', '.reuse-1'].forEach((r, i) => tl.fromTo(one(r), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.3 + i * 0.1)))
  for (const sel of ['.bind-0-1', '.bind-0-2', '.bind-1-1']) hide(sel)
  for (const sel of ['.head-0-1', '.head-0-2', '.head-1-1', '.x-1', '.rows-0', '.rows-1', '.rep-1', '.fp']) hide(sel)
  const bind = (b: string, h: string, t: number) => {
    tl.fromTo(one(b), { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, ease: 'power2.inOut', immediateRender: false }, s(0, t))
    tl.fromTo(one(h), { opacity: 0 }, { opacity: 1, duration: 0.1, immediateRender: false }, s(0, t + 0.38))
  }
  bind('.bind-0-1', '.head-0-1', 2.7)
  bind('.bind-0-2', '.head-0-2', 3.2)
  bind('.bind-1-1', '.head-1-1', 3.0)
  tl.fromTo(one('.x-1'), { opacity: 0, scale: 1.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, s(0, 3.5))
  tl.fromTo(one('.rows-0'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, immediateRender: false }, s(0, 3.9))
  tl.fromTo(one('.rows-1'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, immediateRender: false }, s(0, 4.1))
  tl.fromTo(one('.rep-1'), { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, s(0, 4.7))
  tl.fromTo(one('.fp'), { opacity: 0, scale: 1.08, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, s(0, 5.6))

  // dialect: the same panels hold a second case; the graph gives way to the spelling note
  const D = s(1, 0)
  tl.to([one('.reuse-0'), one('.reuse-1'), one('.report'), one('.graph'), one('.p-rule-0'), one('.p-rule-1'), one('.src-1')], { opacity: 0, duration: 0.25, ease: 'power2.in' }, D + 0.05)
  tl.to(one('.q1'), { opacity: 0, duration: 0.2 }, D + 0.05)
  tl.fromTo(one('.q2'), { opacity: 1, text: '' }, { text: Q2, duration: 0.8, ease: 'none', immediateRender: false }, D + 0.3)
  tl.fromTo([one('.p-dia-0'), one('.p-dia-1'), one('.src-2'), one('.dgraph')], { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, D + 0.6)
  tl.fromTo(one('.dialects'), { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, D + 0.9)
  const steps: [string, number][] = [['.d1-1', 1.0], ['.d1-0', 1.4], ['.d-rule-0', 2.2], ['.d-rule-1', 2.2], ['.d2-0', 2.4], ['.d2-1', 2.4], ['.d3-0', 2.9], ['.d3-1', 2.9], ['.d4-0', 3.3], ['.d4-1', 3.3]]
  for (const [sel, t] of steps) {
    gsap.set(one(sel), { opacity: 0 })
    tl.fromTo(one(sel), { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, D + t)
  }
  tl.fromTo(one('.dfp'), { opacity: 0, scale: 1.08, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, D + 3.9)
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
