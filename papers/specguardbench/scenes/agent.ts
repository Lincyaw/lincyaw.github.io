import { gsapScene } from '@lincyaw/addon-motion/scene'
import { box, C, captionsSvg, esc, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// An agent writes the checks. `inputs`: the rule, the repository and the reference version go into the coding agent,
// which writes test scenarios (the argument of each call, as the paper's App. B harness by Codex / GPT-5.6-sol yields
// them) and one check drawn as a switch: not None, a str or a Cosmology → must raise TypeError; otherwise → assert
// nothing. `route`: each scenario travels down its branch of the switch.
const CAPTIONS = [
  'The agent reads the rule and writes scenarios and one check',
  'The check asserts only what the rule requires',
]
// [label, must raise TypeError]
const CASES: [string, boolean][] = [
  ['0', true], ['1.0', true], ['False', true], ['b"Planck18"', true], ['[]', true],
  ['None', false], ['"Planck18"', false], ['Planck18', false],
]
const COL_X = 664, COL_Y = 116, STEP = 60
const chipW = (label: string) => 26 + label.length * 11.5

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .in-tag { font-size: 14px; fill: ${C.muted}; }
    .in-text { font-size: 17px; }
    .tree { font-size: 16px; }
    .code { font-size: 16px; }
    .agent-name { font-size: 20px; }
    .flow { stroke: ${C.ink}; stroke-width: 3; fill: none; }
    .chip rect { fill: ${C.white}; stroke: ${C.agent}; stroke-width: 2.5; }
    .chip text { font-size: 18px; }
    .lane-box { stroke-width: 3; }
    .lane-title { font-size: 19px; font-weight: 600; }
    .q-text { font-size: 18px; font-weight: 600; }
    .branch { stroke: ${C.agent}; stroke-width: 3; fill: none; }
    .branch-label { font-size: 15px; }
  `
  const chips = CASES.map(([label], i) => {
    const w = chipW(label)
    return `<g class="chip chip-${i}" opacity="0"><rect x="0" y="-19" width="${w}" height="38" /><text class="mono" x="13" y="7">${esc(label)}</text></g>`
  }).join('')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="inputs">
      <g class="in-rule">${box(48, 96, 330, 112)}
        <text class="px in-tag" x="66" y="122">THE RULE</text>
        <text class="in-text" x="66" y="152">Raises TypeError if value is not</text>
        <text class="in-text" x="66" y="178">None, a string, or a Cosmology.</text></g>
      <g class="in-repo">${box(48, 230, 330, 152)}
        <text class="px in-tag" x="66" y="256">THE REPOSITORY</text>
        <text class="mono tree" x="66" y="286">astropy/cosmology/</text>
        <text class="mono tree" x="90" y="312">_src/default.py</text>
        <text class="mono tree" x="90" y="338">realizations.py</text>
        <text class="mono tree muted" x="90" y="364">…</text></g>
      <g class="in-ref">${box(48, 404, 330, 140)}
        <text class="px in-tag" x="66" y="430">REFERENCE VERSION</text>
        <text class="mono code" x="66" y="462">elif not isinstance(value,</text>
        <text class="mono code" x="106" y="486">Cosmology):</text>
        <text class="mono code" x="86" y="510">raise TypeError(...)</text></g>
    </g>
    <path class="flow flow-in" d="M 392 320 L 446 320" />
    <g class="agent-box">${box(452, 262, 150, 116, C.agent)}
      <text class="px agent agent-name" x="527" y="314" text-anchor="middle">CODING</text>
      <text class="px agent agent-name" x="527" y="342" text-anchor="middle">AGENT</text></g>
    <path class="flow flow-out" d="M 610 320 L 650 320" style="stroke:${C.agent}" />
    <text x="${COL_X}" y="94" style="font-size:16px" opacity="0" class="px agent sc-label">SCENARIOS</text>
    <g class="switch" opacity="0">
      <text class="px agent" x="880" y="94" style="font-size:16px">CHECK</text>
      ${box(880, 280, 340, 80, C.agent)}
      <text class="q-text" x="1050" y="315" text-anchor="middle">value is None, a str</text>
      <text class="q-text" x="1050" y="341" text-anchor="middle">or a Cosmology?</text>
      <path class="branch b-no" d="M 1050 280 L 1050 250" />
      <path class="branch b-yes" d="M 1050 360 L 1050 410" />
      <text class="branch-label agent" x="1062" y="272">no</text>
      <text class="branch-label agent" x="1062" y="392">yes</text>
      <rect class="lane-box" x="880" y="112" width="340" height="138" style="fill:${C.agentSoft};stroke:${C.agent}" />
      <text class="lane-title" x="896" y="140">must raise TypeError</text>
      <rect class="lane-box" x="880" y="410" width="340" height="140" style="fill:${C.white};stroke:${C.agent}" />
      <text class="lane-title" x="896" y="438">assert nothing</text>
    </g>
    <g class="chips">${chips}</g>
    <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, APP. B · CHECK WRITTEN BY CODEX / GPT-5.6-SOL</text>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  const scLabel = one('.sc-label')

  // Where each chip rests in its lane after `route`: rows of chips laid left to right.
  const rows: Record<string, number[]> = { r0: [0, 1, 2], r1: [3, 4], n0: [5, 6], n1: [7] }
  const ys: Record<string, number> = { r0: 176, r1: 224, n0: 474, n1: 520 }
  const slots: { x: number, y: number }[] = []
  for (const [row, ids] of Object.entries(rows)) {
    let x = 896
    for (const i of ids) { slots[i] = { x, y: ys[row]! }; x += chipW(CASES[i]![0]) + 12 }
  }

  // inputs
  tl.fromTo(one('.in-rule'), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45 }, s(0, 0.05))
  tl.fromTo(one('.in-repo'), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45 }, s(0, 0.35))
  tl.fromTo(one('.in-ref'), { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45 }, s(0, 0.65))
  tl.fromTo(one('.flow-in'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 1.3))
  tl.fromTo(one('.agent-box'), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, s(0, 1.5))
  tl.fromTo(one('.flow-out'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.3))
  tl.fromTo(scLabel, { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.4))
  CASES.forEach((_, i) => {
    tl.fromTo(one(`.chip-${i}`), { opacity: 0, x: 600, y: 320 }, { opacity: 1, x: COL_X, y: COL_Y + i * STEP, duration: 0.45, ease: 'power3.out' }, s(0, 2.6 + i * 0.32))
  })
  tl.fromTo(one('.switch'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.6 }, s(0, 5.6))
  // route: each chip travels to its lane, the TypeError ones first
  CASES.forEach((_, i) => {
    const n = i
    const to = slots[i]!
    tl.fromTo(one(`.chip-${i}`), { x: COL_X, y: COL_Y + i * STEP }, { x: to.x, y: to.y, duration: 0.55, ease: 'power3.inOut', immediateRender: false }, s(1, 0.15 + n * 0.22))
  })
  tl.fromTo(scLabel, { opacity: 1 }, { opacity: 0.3, duration: 0.3, immediateRender: false }, s(1, 2.0))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
