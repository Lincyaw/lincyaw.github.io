import { gsapScene } from '@lincyaw/addon-motion/scene'
import fig2 from '../figures/symptom-only-at-injected-service.png?url'
import { box, captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { aim, GRAPH_CSS, graphSvg, OLD, pointerSvg, setPips } from './lib/graph.ts'

// The shortcut. Starts where "Who gets blamed?" rests: the fault in `train`, its alerts, the pointer over it.
// `rule`: the pointer's question becomes the rule ("most alerts"), and beside the graph the rule's Top@1 on Nezha-TT
// grows next to Nezha's own published score (paper, Table 2). `local`: the graph moves to a corner; the paper's Fig. 2
// shows the same pattern in a public dataset (only the injected services spike), and 737 cases from 11 public
// datasets fill in: 86% are loud only where the fault was injected, or nowhere (Table 3).
const CASES = 737
const HIT = Math.round(CASES * 0.86) // Type I + Type II, Table 3
const COLS = 41

const CAPTIONS = ['On public benchmarks, counting alerts is enough', null]

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const bar = (x: number, v: number, name: string, fill: string, cls: string) => {
    const h = v * 380
    return `<g class="${cls}">
      <rect class="bar" x="${x}" y="${600 - h}" width="130" height="${h}" style="fill:${fill}" />
      <text class="val" x="${x + 65}" y="${585 - h}" text-anchor="middle">${v.toFixed(2)}</text>
      <text class="mono lbl" x="${x + 65}" y="632" text-anchor="middle">${name}</text></g>`
  }
  const dots = Array.from({ length: CASES }, (_, i) => {
    const c = Math.floor(i / 18), r = i % 18
    const xy = `x="${560 + c * 16.5}" y="${318 + r * 16.5}" width="12" height="12"`
    return `<rect class="dot" ${xy} />${i < HIT ? `<rect class="hit" ${xy} />` : ''}`
  }).join('')
  const css = `${GRAPH_CSS}
    .bar { stroke: var(--pm-color-ink); stroke-width: 2.5; }
    .val { font-size: 34px; font-weight: 600; }
    .lbl { font-size: 18px; }
    .panel-head { font-size: 18px; }
    .src { font-size: 15px; }
    .dot { fill: var(--pm-color-line); }
    .hit { fill: ${COLOR.loud}; opacity: 0; }
    .big { font-size: 64px; font-weight: 600; fill: ${COLOR.loud}; }
    .say { font-size: 22px; }
  `
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="graph-wrap">${graphSvg()}${pointerSvg('?', 'pointer p-ask')}${pointerSvg('most alerts', 'pointer p-rule')}</g>
    <g class="bars" opacity="0">
      <text class="mono muted panel-head" x="830" y="150">NEZHA-TT · TOP@1</text>
      ${bar(830, 0.87, 'Nezha', 'var(--pm-color-surface)', 'b-nezha')}
      ${bar(1040, 0.93, 'alert rule', COLOR.pointer, 'b-rule')}
      <text class="mono muted src" x="830" y="672">PAPER, TABLE 2</text>
    </g>
    <g class="cases" opacity="0">
      <g class="dots">${dots}</g>
      <text class="big" x="560" y="690">86%</text>
      <text class="say" x="700" y="660">of 737 cases: loud only where injected,</text>
      <text class="say" x="700" y="688">or nowhere · <tspan class="mono muted" style="font-size:15px">TABLE 3</tspan></text>
    </g>
  `
  const html = `<div class="overlay card fig" style="${box(40, 40, 1200, 212)}opacity:0"><img src="${fig2}" alt="CPU of five services in a public dataset: only the injected ones spike" /></div>
    <div class="overlay fig-cap" style="${box(40, 262, 1200, 30)}opacity:0;font:500 1.2cqw 'IBM Plex Mono',monospace;color:var(--pm-color-muted)">A PUBLIC DATASET (EADRO): CPU FAULTS SHOW ONLY WHERE INJECTED · PAPER, FIG. 2</div>`
  const el = frame(root, css, svg, html)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)

  // The rest frame of the previous section.
  gsap.set(all('.edge'), { strokeDashoffset: 0 })
  gsap.set(one(`.ring-${OLD.cause}`), { opacity: 1 })
  setPips(gsap, el, OLD.pips)
  gsap.set(all('.pointer'), { x: aim(OLD.cause).x, y: aim(OLD.cause).y })
  gsap.set(one('.p-ask'), { opacity: 1 })

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  // rule
  tl.fromTo(one('.p-ask'), { opacity: 1 }, { opacity: 0, duration: 0.3 }, s(0, 0.4))
  tl.fromTo(one('.p-rule'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 0.4))
  tl.fromTo(one('.bars'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 1.2))
  tl.fromTo(one('.b-nezha .bar'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9 }, s(0, 1.6))
  tl.fromTo(one('.b-nezha .val'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.4))
  tl.fromTo(one('.b-rule .bar'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9 }, s(0, 3.0))
  tl.fromTo(one('.b-rule .val'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 3.8))

  // local
  tl.fromTo(one('.bars'), { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, s(1))
  tl.fromTo(one('.graph-wrap'), { scale: 1, x: 0, y: 0 }, { scale: 0.5, x: 0, y: 330, transformOrigin: '0px 0px', duration: 1, ease: 'power3.inOut', immediateRender: false }, s(1, 0.2))
  tl.fromTo(one('.fig'), { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, immediateRender: false }, s(1, 1.0))
  tl.fromTo(one('.fig-cap'), { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, s(1, 1.4))
  tl.fromTo(one('.cases'), { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, s(1, 4.0))
  tl.fromTo(all('.hit'), { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.0035, ease: 'none', immediateRender: false }, s(1, 4.4))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
