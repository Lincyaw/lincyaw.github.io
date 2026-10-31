import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { aim, GRAPH_CSS, graphSvg, NODES, OLD, pointerSvg, raisePips } from './lib/graph.ts'

// Who gets blamed? `alarm`: the call graph draws itself, a fault rings one service and its alerts stack up; the
// service's metrics, logs and traces travel to an RCA model. `question`: the model's answer, the blue pointer, comes
// out and hovers over the loud service: is that the cause, or only the loudest?
const CAPTIONS = ['A failure starts in one service', 'Which service will the model blame?']

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const css = `${GRAPH_CSS}
    .model rect { fill: var(--pm-color-surface); stroke: var(--pm-color-ink); stroke-width: 3; }
    .model .shadow { fill: var(--pm-color-ink); stroke: none; }
    .model text { font-size: 26px; font-weight: 600; }
    .feed rect { fill: var(--pm-color-surface); stroke: var(--pm-color-ink); stroke-width: 2; }
    .feed text { font-size: 17px; }
    .brand { font-size: 15px; }
    .ask text { font-size: 19px; font-weight: 600; }
  `
  const feeds = ['metrics', 'logs', 'traces'].map((name, i) => `<g class="feed feed-${i}" opacity="0">
      <rect x="-56" y="-17" width="112" height="34" /><text class="mono" x="0" y="6" text-anchor="middle">${name}</text></g>`).join('')
  const svg = `
    ${captionsSvg(CAPTIONS)}
    ${graphSvg()}
    <g class="model" opacity="0">
      <rect class="shadow" x="936" y="306" width="230" height="120" />
      <rect x="930" y="300" width="230" height="120" />
      <text x="1045" y="352" text-anchor="middle">RCA model</text>
      <text class="mono muted" x="1045" y="388" text-anchor="middle" style="font-size:16px;font-weight:400">names a service</text>
    </g>
    ${feeds}
    <g class="ask">
      <text class="ask-cause" x="${NODES.find(n => n.id === OLD.cause)!.x + 70}" y="250" style="fill:${COLOR.cause}" opacity="0">the cause?</text>
      <text class="ask-loud" x="${NODES.find(n => n.id === OLD.cause)!.x + 70}" y="280" style="fill:${COLOR.loud}" opacity="0">or just the loudest?</text>
    </g>
    ${pointerSvg('?')}
    <text class="mono muted brand" x="40" y="696" opacity="0">FSE 2026 · RETHINKING THE EVALUATION OF MICROSERVICE RCA</text>
  `
  const el = frame(root, css, svg)
  const q = (sel: string) => el.querySelectorAll(sel)
  const one = (sel: string) => el.querySelector(sel)
  const g = NODES.find(n => n.id === OLD.cause)!
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // alarm
  tl.fromTo(q('.node'), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.06 }, s(0))
  tl.fromTo(q('.edge'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.07, ease: 'power1.inOut' }, s(0, 0.3))
  tl.fromTo(one('.brand'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, s(0, 0.4))
  tl.fromTo(one(`.ring-${OLD.cause}`), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, s(0, 2.0))
  raisePips(tl, el, OLD.cause, OLD.pips[OLD.cause]!, s(0, 2.5))
  tl.fromTo(one('.model'), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6 }, s(0, 3.7))
  ;[0, 1, 2].forEach(i => {
    tl.fromTo(one(`.feed-${i}`), { opacity: 0, x: g.x, y: g.y - 20 + i * 20 }, { opacity: 1, x: 790, y: 300 + i * 60, duration: 0.9, ease: 'power2.inOut', immediateRender: false }, s(0, 4.4 + i * 0.35))
  })

  // question: the inputs have reached the model; its answer comes out
  tl.fromTo(el.querySelectorAll('.feed'), { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, s(1))
  tl.fromTo(one('.pointer'), { opacity: 0, x: 935, y: 330 }, { opacity: 1, x: aim(g.id).x, y: aim(g.id).y, duration: 1.3, ease: 'power3.inOut', immediateRender: false }, s(1, 0.1))
  tl.fromTo(one('.ask-cause'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, s(1, 1.5))
  tl.fromTo(one('.ask-loud'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, s(1, 2.2))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
