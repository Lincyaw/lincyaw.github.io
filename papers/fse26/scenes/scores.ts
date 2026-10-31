import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { aim, GRAPH_CSS, graphSvg, hotSvg, NEW, node, pointerSvg, satellitesSvg, setPips, SPREAD_CSS } from './lib/graph.ts'

// The scores fall. Starts where "Faults that travel" rests (the fault spread, the alerts two hops from the cause).
// `miss`: the pointer, which always picks the loudest service, lands on `travel`; the cause is elsewhere. Beside the
// graph, each model's Top@1 on the new benchmark (paper, Table 5; DiagFusion, Eadro and Art on its test split) and
// the average of the 11 models, 0.21. `hold`: the picture dims under the number to remember and the paper's card.
const MODELS: [string, number][] = [
  ['MicroRCA', 0.37], ['Baro', 0.36], ['MicroDig', 0.35], ['MicroHECL', 0.34], ['alert rule', 0.28],
  ['CausalRCA', 0.22], ['Shapleyiq', 0.22], ['Eadro', 0.16], ['DiagFusion', 0.13],
  ['MicroRank', 0.04], ['Nezha', 0.04], ['Art', 0.04],
]
const AVERAGE = 0.21
const X0 = 900, SCALE = 600 // pixels for Top@1 = 1

const CAPTIONS = ['Now the loudest service is not the cause', null]

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const rows = MODELS.map(([name, v], i) => {
    const y = 132 + i * 40
    const rule = name === 'alert rule'
    return `<g class="row">
      <text class="mono name" x="${X0 - 12}" y="${y + 21}" text-anchor="end" ${rule ? `style="fill:${COLOR.loud}"` : ''}>${name}</text>
      <rect class="bar" x="${X0}" y="${y}" width="${v * SCALE}" height="28" style="fill:${rule ? COLOR.loud : COLOR.pointer}" />
      <text class="val" x="${X0 + v * SCALE + 8}" y="${y + 21}">${v.toFixed(2)}</text></g>`
  }).join('')
  const avgX = X0 + AVERAGE * SCALE
  const cause = node(NEW.cause)
  const css = `${GRAPH_CSS}${SPREAD_CSS}
    .sat { opacity: 1; }
    .hot { stroke-dashoffset: 0; }
    .name { font-size: 16px; }
    .bar { stroke: var(--pm-color-ink); stroke-width: 2; }
    .val { font-size: 16px; font-variant-numeric: tabular-nums; }
    .avg { stroke: var(--pm-color-ink); stroke-width: 3; stroke-dasharray: 8 6; }
    .avg-label { font-size: 19px; font-weight: 600; }
    .cause-tag { font-size: 20px; font-weight: 600; fill: ${COLOR.cause}; }
    .hero { font-size: 150px; font-weight: 600; }
    .card-title { font-size: 30px; font-weight: 600; }
    .card-line { font-size: 20px; }
  `
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="picture">
      <g class="graph-wrap">${satellitesSvg()}<g class="hots">${hotSvg()}</g>${graphSvg()}</g>
      <text class="cause-tag" x="${cause.x + 44}" y="${cause.y + 8}" opacity="0">cause</text>
      ${pointerSvg('loudest', 'pointer')}
      <g class="chart" opacity="0">
        <text class="mono muted" x="${X0}" y="104" style="font-size:16px">TOP@1 · PAPER, TABLE 5</text>
        ${rows}
        <line class="avg" x1="${avgX}" y1="118" x2="${avgX}" y2="${132 + MODELS.length * 40}" />
        <text class="avg-label" x="${avgX}" y="${152 + MODELS.length * 40}" text-anchor="middle">average of 11 models: 0.21</text>
      </g>
    </g>
    <g class="endcard" opacity="0">
      <rect x="0" y="0" width="1280" height="720" style="fill:var(--pm-color-bg);opacity:0.86" />
      <text class="hero" x="640" y="330" text-anchor="middle">0.21</text>
      <text class="mono muted" x="640" y="380" text-anchor="middle" style="font-size:20px">AVERAGE TOP@1 · 11 MODELS · FAILURES THAT TRAVEL</text>
      <text class=.card-title" x="640" y="500" text-anchor="middle">Rethinking the Evaluation of Microservice RCA</text>
      <text class=.card-title" x="640" y="540" text-anchor="middle">with a Fault Propagation-Aware Benchmark</text>
      <text class="card-line" x="640" y="592" text-anchor="middle">Aoyang Fang et al. · FSE 2026 · direct accept</text>
      <text class="mono muted" x="640" y="630" text-anchor="middle" style="font-size:17px">ARXIV 2510.04711 · DOI 10.1145/3797100</text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  gsap.set(all('.edge'), { strokeDashoffset: 0 })
  gsap.set(one(`.ring-${NEW.cause}`), { opacity: 1 })
  setPips(gsap, el, NEW.pips)
  const loudest = Object.entries(NEW.pips).sort((a, b) => b[1] - a[1])[0]![0]

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  // miss
  tl.fromTo(one('.pointer'), { opacity: 0, x: 1100, y: 360 }, { opacity: 1, x: aim(loudest).x, y: aim(loudest).y, duration: 1.2, ease: 'power3.inOut' }, s(0, 0.2))
  tl.fromTo(one('.cause-tag'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4 }, s(0, 1.7))
  tl.fromTo(one(`.ring-${NEW.cause}`), { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 3, ease: 'power1.inOut' }, s(0, 1.7))
  tl.fromTo(one('.chart'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 2.8))
  tl.fromTo(all('.row .bar'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.6, stagger: 0.12 }, s(0, 3.0))
  tl.fromTo(all('.row .val'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.12 }, s(0, 3.4))
  tl.fromTo(one('.avg'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 5.4))
  tl.fromTo(one('.avg-label'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(0, 5.7))
  // hold
  tl.fromTo(one(".endcard"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, s(1, 0.2))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
