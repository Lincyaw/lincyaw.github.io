import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, box, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Learned rules, skipped pairs. `rules` (paper, Fig. 9 and Table 6, Batch #1 on NeuG): 26 raw reports reach the issue
// gate, which matches 13 to known issues; the other 13 are clustered into 3 clusters; the agents (a coordinator with
// cluster-splitting, deep-analysis and rules-synthesis sub-agents) make 4 analysis units of them, which end as 2 adapter
// rules, 1 gate rule and 1 bug. Adapter rules go back to the target adapter, the gate rule back to the gate: 4 items to
// inspect instead of 26 (84.6% less). `triage` (§5.4): each equivalent pair is compiled with EXPLAIN before it runs;
// a pair with the same plan is skipped, a pair with different plans runs, and different results make a candidate bug.
// The plan sketches in `triage` are illustrative.
const CAPTIONS = [
  "GraphWeave's agents turn each cluster of reports into a rule",
  'Before running a pair, compare plans; same plan: skip it',
]
const N = 26
// which of the 26 the gate matches (13), and the cluster of each of the other 13 (5, 4, 4)
const GATED = new Set([0, 2, 3, 6, 8, 11, 12, 15, 17, 19, 21, 23, 25])
const IX = 56, IY = 236, IS = 28, IC = 5
const GATE_X = 238
const CL = [[372, 254], [372, 322], [372, 390]]
const KX = 56, KY = 448

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .tag { font-size: 15px; }
    .sq { fill: ${C.ink}; }
    .gate { fill: ${C.weave}; }
    .ring { fill: none; stroke: ${C.ink}; stroke-width: 2.5; }
    .agents { fill: ${C.weaveSoft}; stroke: ${C.weave}; stroke-width: 3; }
    .ag { fill: ${C.white}; stroke: ${C.weave}; stroke-width: 2.5; }
    .ag-text { font-size: 16px; }
    .out { fill: ${C.white}; stroke: ${C.weave}; stroke-width: 3; }
    .out-bug { fill: ${C.weave}; stroke: ${C.ink}; stroke-width: 2.5; }
    .out-text { font-size: 18px; font-weight: 600; }
    .fb { fill: none; stroke: ${C.weave}; stroke-width: 3; }
    .fb-head { fill: ${C.weave}; }
    .fb-label { font-size: 16px; font-weight: 600; }
    .adapter { fill: ${C.white}; stroke: ${C.weave}; stroke-width: 3; }
    .read { font-size: 26px; font-weight: 600; }
    .flow { stroke: ${C.ink}; stroke-width: 2.5; fill: none; }
    .col { font-size: 15px; }
    .chip { fill: ${C.white}; stroke: ${C.ink}; stroke-width: 2.5; }
    .chip-text { font-size: 20px; }
    .ex { fill: ${C.paper}; stroke: ${C.ink}; stroke-width: 2.5; }
    .pb { fill: ${C.ink}; }
    .rel { font-size: 30px; font-weight: 600; }
    .res { font-size: 20px; font-weight: 600; }
    .strike { stroke: ${C.dim}; stroke-width: 3; }
  `
  const inPos = (k: number) => [IX + (k % IC) * IS, IY + Math.floor(k / IC) * IS]
  let gi = 0, ci = 0
  const counts = [0, 0, 0]
  const dest = Array.from({ length: N }, (_, k) => {
    if (GATED.has(k)) { const j = gi++; return { gated: true, x: KX + (j % 7) * 22, y: KY + Math.floor(j / 7) * 22 } }
    const c = ci < 5 ? 0 : ci < 9 ? 1 : 2
    const j = counts[c]++
    ci++
    const [cx, cy] = CL[c]
    const ang = (j / (c === 0 ? 5 : 4)) * Math.PI * 2
    return { gated: false, x: cx - 6 + Math.cos(ang) * 13, y: cy - 6 + Math.sin(ang) * 13 }
  })
  const squares = Array.from({ length: N }, (_, k) => {
    const [x, y] = inPos(k)
    return `<rect class="sq sq-${k}" x="${x}" y="${y}" width="20" height="20" />`
  }).join('')
  const outs: [string, boolean][] = [['adapter rule', false], ['adapter rule', false], ['gate rule', false], ['new bug', true]]
  const outSvg = outs.map(([t, bug], i) => {
    const y = 200 + i * 62
    return `<g class="out-g out-${i}">
      <rect class="shadow" x="${946}" y="${y + 6}" width="230" height="44" />
      <rect class="${bug ? 'out-bug' : 'out'}" x="940" y="${y}" width="230" height="44" />
      <text class="out-text" x="1055" y="${y + 29}" text-anchor="middle" style="fill:${bug ? C.white : C.weave}">${t}</text></g>`
  }).join('')
  const rules = `
    <g class="rules">
      <text class="px tag muted" x="${IX}" y="150">BATCH #1 · 26 REPORTS</text>
      <text class="px tag weave" x="${GATE_X + 13}" y="190" text-anchor="middle">ISSUE GATE</text>
      <rect class="gate" x="${GATE_X}" y="204" width="26" height="224" />
      <text class="px tag muted kn-label" x="${KX}" y="${KY + 84}">13 MATCH KNOWN ISSUES</text>
      <text class="px tag muted cl-label" x="${CL[0][0]}" y="210" text-anchor="middle">3 CLUSTERS</text>
      ${CL.map(([x, y], c) => `<circle class="ring ring-${c}" cx="${x}" cy="${y}" r="30" />`).join('')}
      <g class="agents-g">
        <rect class="agents" x="440" y="176" width="440" height="252" />
        <text class="px tag weave" x="456" y="202">AGENTS</text>
        <rect class="ag ag-0" x="456" y="216" width="408" height="44" /><text class="ag-text" x="660" y="244" text-anchor="middle">coordinator: audits the evidence</text>
        <rect class="ag ag-1" x="456" y="292" width="128" height="116" /><text class="ag-text" x="520" y="346" text-anchor="middle">split</text><text class="ag-text" x="520" y="368" text-anchor="middle">clusters</text>
        <rect class="ag ag-2" x="596" y="292" width="128" height="116" /><text class="ag-text" x="660" y="346" text-anchor="middle">deep</text><text class="ag-text" x="660" y="368" text-anchor="middle">analysis</text>
        <rect class="ag ag-3" x="736" y="292" width="128" height="116" /><text class="ag-text" x="800" y="346" text-anchor="middle">synthesize</text><text class="ag-text" x="800" y="368" text-anchor="middle">rules</text>
      </g>
      <path class="flow flow-1" d="M406 322 L 434 322" />
      <path class="flow flow-2" d="M886 302 L 932 302" />
      ${outSvg}
      <path class="fb fb-a" d="M1170 222 H 1236 V 604 H 250" />
      <path class="fb fb-a2" d="M1170 284 H 1236" />
      <path class="fb-head fb-a-head" d="M236 604 l 16 -9 v 18 z" />
      <text class="fb-label weave fb-a-label" x="760" y="594" text-anchor="middle">adapter rules: express the same test in the target's dialect</text>
      <path class="fb fb-g" d="M940 346 H 908 V 470 H ${GATE_X + 13} V 444" />
      <path class="fb-head fb-g-head" d="M${GATE_X + 13} 430 l -9 16 h 18 z" />
      <text class="fb-label weave fb-g-label" x="600" y="462" text-anchor="middle">gate rule: filter this bug's repeats</text>
      <g class="adapter-g">
        <rect class="shadow" x="62" y="582" width="174" height="48" />
        <rect class="adapter" x="56" y="576" width="174" height="48" />
        <text class="px tag weave" x="143" y="606" text-anchor="middle">TARGET ADAPTER</text>
      </g>
      ${squares}
      <text class="read read-el" x="1232" y="664" text-anchor="end"><tspan class="weave">26 reports → 4 to inspect</tspan> · 84.6% less</text>
      <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, FIG. 9, TABLE 6 · BATCH #1 ON NEUG</text>
    </g>`
  // triage rows: [same plan?, same result?]
  const ROWS: [boolean, boolean][] = [[true, true], [false, true], [false, false]]
  const sketch = (x: number, y: number, ws: number[]) => ws.map((w, i) => `<rect class="pb" x="${x - w / 2}" y="${y + i * 12}" width="${w}" height="7" />`).join('')
  const triRows = ROWS.map(([same, sameRes], r) => {
    const y = 200 + r * 140
    const outcome = same
      ? `<text class="res muted out-t" x="900" y="${y + 33}">same plan: never executed</text>`
      : sameRes
        ? `<text class="res out-t" x="900" y="${y + 22}">same result: kept as a</text><text class="res out-t2" x="900" y="${y + 48}">possible performance issue</text>`
        : `<g class="out-t"><rect class="out-bug" x="900" y="${y + 4}" width="230" height="44" /><text class="out-text" x="1015" y="${y + 33}" text-anchor="middle" style="fill:${C.white}">candidate bug</text></g><text class="res out-t2" x="900" y="${y + 76}">different results</text>`
    return `<g class="tri tri-${r}">
      <g class="pair"><rect class="chip" x="56" y="${y}" width="76" height="52" /><text class="mono chip-text" x="94" y="${y + 33}" text-anchor="middle">Q</text>
        <rect class="chip" x="146" y="${y}" width="76" height="52" /><text class="mono chip-text" x="184" y="${y + 33}" text-anchor="middle">Q′</text></g>
      <path class="flow a1" d="M230 ${y + 26} H 288" />
      <rect class="ex" x="296" y="${y}" width="170" height="52" /><text class="mono chip-text" x="381" y="${y + 33}" text-anchor="middle">EXPLAIN</text>
      <path class="flow a2" d="M474 ${y + 26} H 520" />
      <g class="sk">${sketch(570, y + 4, [44, 60, 52, 36])}${sketch(700, y + 4, same ? [44, 60, 52, 36] : [60, 30, 66, 48])}
        <text class="rel ${same ? 'bad' : ''}" x="635" y="${y + 38}" text-anchor="middle">${same ? '=' : '≠'}</text></g>
      <path class="flow a3" d="M760 ${y + 26} H 880" />
      <text class="px tag muted verb" x="820" y="${y + 16}" text-anchor="middle">${same ? 'SKIP' : 'RUN'}</text>
      ${same ? `<line class="strike" x1="50" y1="${y + 26}" x2="228" y2="${y + 26}" />` : ''}
      ${outcome}
    </g>`
  }).join('')
  const triage = `
    <g class="triage" opacity="0">
      <text class="px col muted" x="56" y="170">EQUIVALENT PAIR</text>
      <text class="px col muted" x="381" y="170" text-anchor="middle">PLANS FIRST</text>
      <text class="px col muted" x="635" y="170" text-anchor="middle">COMPARE</text>
      <text class="px col muted" x="900" y="170">OUTCOME</text>
      ${triRows}
      <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, §5.4 · PLAN SKETCHES ILLUSTRATIVE</text>
    </g>`
  const svg = `${captionsSvg(CAPTIONS)}${rules}${triage}`
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  const later = (sel: string, from: object, to: object, t: number) => {
    const targets = all(sel)
    if (targets.length) tl.fromTo(targets, from, { ...to, immediateRender: false }, t)
  }

  // rules
  gsap.set([one('.kn-label'), one('.cl-label'), ...all('.ring'), one('.agents-g'), ...all('.flow'), ...all('.out-g'),
    ...all('.fb'), ...all('.fb-head'), ...all('.fb-label'), one('.adapter-g'), one('.read-el')], { opacity: 0 })
  tl.fromTo(all('.sq'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.025 }, s(0, 0.1))
  tl.fromTo(one('.gate'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.4 }, s(0, 0.4))
  // the gate takes the 13 it recognizes; they settle below as known issues
  dest.forEach((d, k) => {
    if (!d.gated) return
    later(`.sq-${k}`, { attr: inPosAttr(k) }, { attr: { x: d.x, y: d.y }, fill: C.dim, duration: 0.6, ease: 'power3.inOut' }, s(0, 1.0 + (k % 7) * 0.04))
  })
  later('.kn-label', { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 1.6))
  later('.ring', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1 }, s(0, 1.7))
  later('.cl-label', { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 1.8))
  // the other 13 pass the gate into three clusters
  dest.forEach((d, k) => {
    if (d.gated) return
    later(`.sq-${k}`, { attr: { ...inPosAttr(k), width: 20, height: 20 } }, { attr: { x: d.x, y: d.y, width: 12, height: 12 }, duration: 0.7, ease: 'power3.inOut' }, s(0, 2.0 + (k % 5) * 0.04))
  })
  later('.flow-1', { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(0, 2.8))
  later('.agents-g', { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.9))
  ;['.ag-0', '.ag-1', '.ag-2', '.ag-3'].forEach((a, i) => later(a, { fill: C.white }, { fill: C.weaveSoft, duration: 0.15, yoyo: true, repeat: 1 }, s(0, 3.2 + i * 0.3)))
  later('.flow-2', { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(0, 4.3))
  outs.forEach((_, i) => later(`.out-${i}`, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 }, s(0, 4.4 + i * 0.18)))
  // feedback: rules go back where they act
  later('.fb-a', { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, s(0, 5.2))
  later('.fb-a2', { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.2 }, s(0, 5.2))
  later('.adapter-g', { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 5.6))
  later('.fb-a-head', { opacity: 0 }, { opacity: 1, duration: 0.1 }, s(0, 5.95))
  later('.fb-a-label', { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 6.0))
  later('.fb-g', { opacity: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, s(0, 5.4))
  later('.fb-g-head', { opacity: 0 }, { opacity: 1, duration: 0.1 }, s(0, 5.95))
  later('.fb-g-label', { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 6.0))
  later('.read-el', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, s(0, 6.4))

  // triage: one row per kind of pair
  tl.to(one('.rules'), { opacity: 0, duration: 0.3, ease: 'power2.in' }, s(1, 0.05))
  later('.triage', { opacity: 0 }, { opacity: 1, duration: 0.01 }, s(1, 0.35))
  ROWS.forEach((_, r) => {
    const t = 0.4 + r * 1.3
    const q = (sel: string) => `.tri-${r} ${sel}`
    gsap.set([...all(`.tri-${r} > *`)], { opacity: 0 })
    later(q('.pair'), { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3 }, s(1, t))
    later(q('.a1'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, s(1, t + 0.2))
    later(q('.ex'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(1, t + 0.25))
    later(q('.ex + text'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(1, t + 0.25))
    later(q('.a2'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, s(1, t + 0.45))
    later(q('.sk'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, t + 0.5))
    later(q('.a3'), { opacity: 0 }, { opacity: 1, duration: 0.15 }, s(1, t + 0.8))
    later(q('.verb'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(1, t + 0.8))
    later(q('.strike'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s(1, t + 0.9))
    later(q('.pair'), { opacity: 1 }, { opacity: ROWS[r][0] ? 0.35 : 1, duration: 0.2 }, s(1, t + 0.9))
    later(q('.out-t'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, t + 1.0))
    later(q('.out-t2'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, t + 1.1))
  })
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl

  function inPosAttr(k: number) {
    const [x, y] = inPos(k)
    return { x, y }
  }
})
