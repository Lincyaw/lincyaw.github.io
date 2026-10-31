import { gsapScene } from '@lincyaw/addon-motion/scene'
import { box, C, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Tests pass, the rule breaks. The paper's example task (App. B): one sentence of astropy's docstring, the gold
// `default_cosmology.validate` and the violating version that also lets int and float through. `rule`: the original
// tests (a class object, a Cosmology instance) pass both versions; the scenarios 1, 0, 2.5 make gold raise TypeError
// and the violating version return the value. `ask`: the violating card is ringed; an empty check waits on the right.
const CAPTIONS = [
  'Original tests pass both; only gold raises TypeError on 1, 0, 2.5',
  'Can a coding agent write the check that catches this?',
]
const PROBES = ['1', '0', '2.5']

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .rule-tag { font-size: 16px; fill: ${C.muted}; }
    .rule-text { font-size: 25px; font-weight: 600; }
    .who { font-size: 20px; }
    .code { font-size: 20px; }
    .tests { font-size: 16px; fill: ${C.muted}; }
    .chip rect { fill: ${C.white}; stroke: ${C.ink}; stroke-width: 2; }
    .chip text { font-size: 17px; }
    .call { font-size: 19px; }
    .out { font-size: 19px; font-weight: 600; }
    .ring { fill: none; stroke: ${C.bad}; stroke-width: 4; }
    .slot rect { fill: ${C.agentSoft}; stroke: ${C.agent}; stroke-width: 3; stroke-dasharray: 10 7; }
    .slot .q { font-size: 64px; font-weight: 600; fill: ${C.agent}; }
  `
  const card = (x: number, kind: 'gold' | 'bad') => {
    const bad = kind === 'bad'
    const widened = bad
      ? `<tspan>(Cosmology, </tspan><tspan class="diff bad" style="font-weight:600">int, float</tspan><tspan>)):</tspan>`
      : `<tspan>Cosmology):</tspan>`
    return `<g class="card card-${kind}">
      ${box(x, 236, 520, 214, bad ? C.bad : C.ink)}
      <text class="px who ${bad ? 'bad' : ''}" x="${x + 22}" y="272">${bad ? 'VIOLATING VERSION' : 'GOLD VERSION'}</text>
      <text class="mono code" x="${x + 22}" y="316">elif not isinstance(value,</text>
      <text class="mono code" x="${x + 70}" y="346">${widened}</text>
      <text class="mono code" x="${x + 46}" y="376">raise TypeError(...)</text>
      <g class="tests tests-${kind}" opacity="0">
        <line x1="${x + 22}" y1="398" x2="${x + 498}" y2="398" style="stroke:${C.line};stroke-width:2" />
        <text class="tests" x="${x + 22}" y="430">original tests: class object ✓  Cosmology instance ✓</text>
      </g>
    </g>`
  }
  const probes = (x: number, kind: 'gold' | 'bad') => PROBES.map((v, i) => {
    const y = 506 + i * 58
    const out = kind === 'gold' ? 'TypeError' : `returns ${v}`
    return `<g class="probe probe-${kind}-${i}" opacity="0">
      <text class="mono call" x="${x + 22}" y="${y + 24}">validate(<tspan style="font-weight:600">${v}</tspan>)</text>
      <text class="arrow-${kind}-${i}" x="${x + 196}" y="${y + 24}" style="font-size:22px" opacity="0">→</text>
      <text class="out out-${kind}-${i} ${kind === 'bad' ? 'bad' : ''} mono" x="${x + 230}" y="${y + 24}" opacity="0">${out}</text>
    </g>`
  }).join('')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="rule">
      ${box(80, 92, 1120, 104)}
      <text class="px rule-tag" x="104" y="124">ASTROPY · DEFAULT_COSMOLOGY.VALIDATE · THE RULE</text>
      <text class="rule-text" x="104" y="170">Raises TypeError: if value is not None, a string, or a Cosmology instance.</text>
    </g>
    ${card(80, 'gold')}
    ${card(680, 'bad')}
    ${probes(80, 'gold')}
    ${probes(680, 'bad')}
    <rect class="ring" x="664" y="220" width="552" height="246" opacity="0" />
    <g class="slot" opacity="0">
      <rect x="1076" y="494" width="124" height="164" />
      <text class="px agent" x="1138" y="526" text-anchor="middle" style="font-size:16px">CHECK</text>
      <text class="q" x="1138" y="616" text-anchor="middle">?</text>
    </g>
    <text class="px src muted" x="1200" y="706" text-anchor="end">PAPER, APP. B · ASTROPY/COSMOLOGY/_SRC/DEFAULT.PY</text>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // rule
  tl.fromTo(one('.rule'), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.5 }, s(0, 0.05))
  tl.fromTo(one('.card-gold'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, s(0, 0.9))
  tl.fromTo(one('.card-bad'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, s(0, 1.1))
  tl.fromTo(one('.diff'), { opacity: 0.15 }, { opacity: 1, duration: 0.25, repeat: 2, yoyo: false }, s(0, 1.8))
  tl.fromTo(one('.tests-gold'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 2.7))
  tl.fromTo(one('.tests-bad'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 3.0))
  PROBES.forEach((_, i) => {
    const t = 4.0 + i * 0.75
    for (const kind of ['gold', 'bad'] as const) {
      const d = kind === 'gold' ? 0 : 0.3
      tl.fromTo(one(`.probe-${kind}-${i}`), { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.35 }, s(0, t + d))
      tl.fromTo(one(`.arrow-${kind}-${i}`), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25 }, s(0, t + d + 0.3))
      tl.fromTo(one(`.out-${kind}-${i}`), { opacity: 0, scale: 0.8, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, s(0, t + d + 0.45))
    }
  })
  // ask
  tl.fromTo(one('.card-gold'), { opacity: 1 }, { opacity: 0.45, duration: 0.4, immediateRender: false }, s(1, 0.1))
  tl.fromTo(all('[class^="probe probe-gold"]'), { opacity: 1 }, { opacity: 0.45, duration: 0.4, immediateRender: false }, s(1, 0.1))
  tl.fromTo(one('.ring'), { opacity: 0, scale: 1.04, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4 }, s(1, 0.3))
  tl.fromTo(one('.slot'), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5 }, s(1, 1.0))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
