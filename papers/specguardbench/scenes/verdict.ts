import { gsapScene } from '@lincyaw/addon-motion/scene'
import { box, C, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Three implementations, one verdict. The agent's check is a gate. `judge`: the gold version passes (ACCEPT) and the
// violating version is stopped (REJECT): both verdicts right, in the agent's colour. `alternative`: a valid
// alternative (it satisfies the rule and differs from gold elsewhere) passes the same gate. Below, a second gate: the
// same check plus one assertion about what the reference happens to do (illustrative). It judges gold and the
// violation right but rejects the alternative: a false alarm, in red.
const CAPTIONS = [
  'The check must accept gold and reject the violation',
  'Assert more than the rule and a correct variant is rejected: a false alarm',
]
type Kind = 'gold' | 'bad' | 'alt'
const NAME: Record<Kind, string> = { gold: 'GOLD', bad: 'VIOLATING', alt: 'VALID ALTERNATIVE' }
const LANES = [0, 1, 2]
const GATE_X = 600, PASS_X = 760, START_X = 96, CARD_W = 300, CARD_H = 46

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .impl rect.face { fill: ${C.white}; stroke-width: 2.5; }
    .impl text { font-size: 17px; }
    .gate-post { stroke-width: 0; }
    .gate-name { font-size: 15px; }
    .stamp { font-size: 22px; }
    .verdict { font-size: 26px; }
    .extra text { font-size: 19px; }
    .divider { stroke: ${C.line}; stroke-width: 2; stroke-dasharray: 8 8; }
  `
  // One gate with its three lanes; `g` is 0 (the agent's check) or 1 (the same check asserting more).
  const gate = (g: number) => {
    const top = g === 0 ? 108 : 412
    const lanes = LANES.map(l => top + 34 + l * 74)
    const kinds: Kind[] = ['gold', 'bad', 'alt']
    const impl = (k: Kind, l: number) => {
      const stroke = k === 'bad' ? C.bad : C.ink
      return `<g class="impl impl-${g}-${k}" opacity="0">
        <rect class="shadow" x="5" y="${-CARD_H / 2 + 5}" width="${CARD_W}" height="${CARD_H}" />
        <rect class="face" x="0" y="${-CARD_H / 2}" width="${CARD_W}" height="${CARD_H}" style="stroke:${stroke}" />
        <text class="px ${k === 'bad' ? 'bad' : ''}" x="14" y="6">${NAME[k]}</text>
      </g>`
    }
    const stamps = kinds.map((k, l) => {
      const accept = k !== 'bad'
      const wrong = g === 1 && k === 'alt'
      const word = wrong ? 'REJECT' : accept ? 'ACCEPT' : 'REJECT'
      const color = wrong ? C.bad : C.agent
      return `<text class="px stamp stamp-${g}-${k}" x="1100" y="${lanes[l]! + 8}" style="fill:${color}" opacity="0">${word}${wrong ? ' ✗' : ' ✓'}</text>`
    }).join('')
    return `<g class="gate-${g}" opacity="${g === 0 ? 1 : 0}">
      <rect class="gate-post" x="${GATE_X}" y="${top}" width="16" height="${lanes[2]! - top + 34}" style="fill:${C.agent}" />
      ${g === 1 ? `<rect class="extra-post" x="${GATE_X + 16}" y="${top}" width="12" height="${lanes[2]! - top + 34}" style="fill:${C.bad}" opacity="0" />` : ''}
      <text class="px gate-name agent" x="${GATE_X + 8}" y="${top - 10}" text-anchor="middle">THE CHECK</text>
      ${kinds.map((k, l) => impl(k, l)).join('')}
      ${stamps}
      <text class="px verdict verdict-${g}" x="1230" y="${top - 10}" text-anchor="end" style="fill:${g === 0 ? C.agent : C.bad}" opacity="0">${g === 0 ? 'FAITHFUL' : 'FALSE ALARM'}</text>
    </g>`
  }
  const svg = `
    ${captionsSvg(CAPTIONS)}
    ${gate(0)}
    <line class="divider" x1="48" y1="384" x2="1232" y2="384" opacity="0" />
    ${gate(1)}
    <g class="extra" opacity="0">
      <text x="${GATE_X + 22}" y="666" text-anchor="middle"><tspan class="bad" style="font-weight:600">+ one assertion about what the reference does</tspan><tspan class="muted"> (illustrative)</tspan></text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const laneY = (g: number, l: number) => (g === 0 ? 108 : 412) + 34 + l * 74
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // An implementation enters at the left, travels to the gate, and either passes through or stops against it.
  const run = (g: number, k: Kind, l: number, t: number, passes: boolean) => {
    const y = laneY(g, l)
    const card = one(`.impl-${g}-${k}`)
    tl.fromTo(card, { opacity: 0, x: START_X - 40, y }, { opacity: 1, x: START_X, y, duration: 0.3 }, t)
    if (passes) {
      tl.fromTo(card, { x: START_X }, { x: PASS_X, duration: 0.9, ease: 'power3.inOut', immediateRender: false }, t + 0.35)
    } else {
      tl.fromTo(card, { x: START_X }, { x: GATE_X - CARD_W - 4, duration: 0.6, ease: 'power3.in', immediateRender: false }, t + 0.35)
      tl.fromTo(card, { x: GATE_X - CARD_W - 4 }, { x: GATE_X - CARD_W - 18, duration: 0.25, ease: 'power2.out', immediateRender: false }, t + 0.95)
    }
    tl.fromTo(one(`.stamp-${g}-${k}`), { opacity: 0, scale: 1.4, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.in' }, t + 1.15)
  }

  // judge
  run(0, 'gold', 0, s(0, 0.2), true)
  run(0, 'bad', 1, s(0, 1.4), false)
  // alternative
  run(0, 'alt', 2, s(1, 0.1), true)
  tl.fromTo(one('.verdict-0'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(1, 1.4))
  tl.fromTo(one('.divider'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, 1.9))
  tl.fromTo(one('.gate-1'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(1, 2.0))
  tl.fromTo(one('.extra-post'), { opacity: 0, scaleY: 0, transformOrigin: '50% 0%' }, { opacity: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' }, s(1, 2.4))
  tl.fromTo(one('.extra'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, s(1, 2.6))
  run(1, 'gold', 0, s(1, 3.2), true)
  run(1, 'bad', 1, s(1, 3.8), false)
  run(1, 'alt', 2, s(1, 4.6), false)
  tl.fromTo(one('.verdict-1'), { opacity: 0, scale: 1.3, transformOrigin: '100% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.in' }, s(1, 6.1))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
