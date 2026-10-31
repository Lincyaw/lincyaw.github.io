import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, captionsSvg, esc, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Shown the wrong code. Paper, Table 2 (Lite Set, 100 tasks). `swap`: the reference card the agent is given turns from
// the gold version to the violating one (the red `int, float` of the first chapter); each agent's faithfulness slides
// from its gold-reference value to its violating-reference value, the drop written beside it. `remember`: the picture
// dims under the one line to remember and the paper's card.
const CAPTIONS = [
  'Shown the violating version as reference, every agent loses faithfulness',
  null,
]
// [agent, faithfulness with gold reference, with violating reference]
const ROWS: [string, number, number][] = [
  ['Codex / GPT-5.6-sol', 65, 46],
  ['Claude Code / Claude Opus 5', 52, 21],
  ['OpenCode / DeepSeek-V4-Pro', 52, 28],
  ['OpenCode / GLM-5.3', 68, 39],
]
const X0 = 520, PX = 7, Y0 = 170, ROW = 104

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .ref-face { fill: ${C.white}; stroke-width: 3; }
    .ref-tag { font-size: 16px; }
    .code { font-size: 17px; }
    .agent-name { font-size: 17px; }
    .track { stroke: ${C.line}; stroke-width: 2; }
    .trail { stroke: ${C.bad}; stroke-width: 6; }
    .dot-gold { fill: ${C.white}; stroke: ${C.agent}; stroke-width: 4; }
    .dot-bad { fill: ${C.bad}; stroke: ${C.ink}; stroke-width: 2; }
    .num { font-size: 18px; font-variant-numeric: tabular-nums; }
    .drop { font-size: 22px; font-weight: 600; }
    .tick { font-size: 15px; fill: ${C.muted}; }
    .end-line { font-size: 46px; font-weight: 600; }
    .title { font-size: 25px; font-weight: 600; }
    .byline { font-size: 21px; }
    .links { font-size: 17px; }
  `
  const code = (bad: boolean) => `
    <text class="mono code" x="66" y="352">elif not isinstance(value,</text>
    <text class="mono code" x="106" y="378">${bad ? `(Cosmology, <tspan class="bad" style="font-weight:600">int, float</tspan>)):` : 'Cosmology):'}</text>
    <text class="mono code" x="86" y="404">raise TypeError(...)</text>`
  const rows = ROWS.map(([name, g, b], i) => {
    const y = Y0 + i * ROW
    return `<g class="row row-${i}">
      <text class="mono agent-name" x="${X0}" y="${y - 22}">${esc(name)}</text>
      <line class="track" x1="${X0}" y1="${y}" x2="${X0 + 100 * PX}" y2="${y}" />
      <line class="trail trail-${i}" x1="${X0 + b * PX}" y1="${y}" x2="${X0 + g * PX}" y2="${y}" />
      <circle class="dot-gold" cx="${X0 + g * PX}" cy="${y}" r="13" />
      <text class="num agent" x="${X0 + g * PX}" y="${y + 38}" text-anchor="middle">${g}</text>
      <g class="moving moving-${i}">
        <circle class="dot-bad" cx="${X0 + g * PX}" cy="${y}" r="13" />
      </g>
      <text class="num bad num-bad-${i}" x="${X0 + b * PX}" y="${y + 38}" text-anchor="middle" opacity="0">${b}</text>
      <text class="drop bad drop-${i}" x="${X0 + b * PX - 26}" y="${y + 8}" text-anchor="end" opacity="0">−${g - b}</text>
    </g>`
  }).join('')
  const ticks = [0, 50, 100].map(v => `<text class="tick" x="${X0 + v * PX}" y="${Y0 + 4 * ROW - 24}" text-anchor="middle">${v}%</text>`).join('')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="picture">
      <g class="ref">
        <rect class="shadow" x="54" y="256" width="400" height="176" />
        <rect class="ref-face ref-face-gold" x="48" y="250" width="400" height="176" style="stroke:${C.ink}" />
        <g class="ref-gold"><text class="px ref-tag" x="66" y="284">REFERENCE: GOLD</text>${code(false)}</g>
        <g class="ref-bad" opacity="0"><rect class="ref-face" x="48" y="250" width="400" height="176" style="stroke:${C.bad}" />
          <text class="px ref-tag bad" x="66" y="284">REFERENCE: VIOLATING</text>${code(true)}</g>
      </g>
      <text class="tick" x="${X0 + 50 * PX}" y="${Y0 + 4 * ROW - 2}" text-anchor="middle">faithfulness, share of tasks</text>
      ${ticks}
      ${rows}
      <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, TABLE 2 · LITE SET, 100 TASKS</text>
    </g>
    <g class="endcard" opacity="0">
      <rect x="0" y="0" width="1280" height="720" style="fill:${C.paper};opacity:0.93" />
      <text class="end-line" x="640" y="232" text-anchor="middle">Checks follow the code they are shown,</text>
      <text class="end-line" x="640" y="292" text-anchor="middle">not the specification.</text>
      <line x1="440" y1="350" x2="840" y2="350" style="stroke:${C.agent};stroke-width:4" />
      <text class="title" x="640" y="420" text-anchor="middle">SpecGuardBench: Can Coding Agents Construct Reliable</text>
      <text class="title" x="640" y="454" text-anchor="middle">Validation Harnesses from Natural Language Specifications?</text>
      <text class="byline" x="640" y="512" text-anchor="middle">Zhong, Chen, <tspan style="font-weight:600">Fang</tspan>, Zhang, Tian, Briand, Yu, He · arXiv 2026</text>
      <text class="mono links muted" x="640" y="556" text-anchor="middle">arxiv.org/abs/2610.16870 · github.com/coxhin/SpecGuardBench</text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // swap: the reference card turns over, then each agent's dot slides to its new value
  tl.fromTo(one('.ref'), { scaleX: 1, svgOrigin: '248 338' }, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, s(0, 0.4))
  tl.fromTo(one('.ref-bad'), { opacity: 0 }, { opacity: 1, duration: 0.01 }, s(0, 0.7))
  tl.fromTo(one('.ref'), { scaleX: 0, svgOrigin: '248 338' }, { scaleX: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, s(0, 0.7))
  ROWS.forEach(([, g, b], i) => {
    const t = 1.3 + i * 0.35
    tl.fromTo(one(`.moving-${i}`), { x: 0 }, { x: (b - g) * PX, duration: 1.0, ease: 'power3.inOut' }, s(0, t))
    tl.fromTo(one(`.trail-${i}`), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' }, s(0, t))
    tl.fromTo(one(`.num-bad-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, t + 0.9))
    tl.fromTo(one(`.drop-${i}`), { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.3 }, s(0, t + 1.0))
  })
  // remember
  tl.fromTo(one('.endcard'), { opacity: 0 }, { opacity: 1, duration: 0.7 }, s(1, 0.1))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
