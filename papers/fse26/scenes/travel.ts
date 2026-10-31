import { gsapScene } from '@lincyaw/addon-motion/scene'
import { captionsSvg, COLOR, frame, playCaptions, sec } from './lib/frame.ts'
import { GRAPH_CSS, graphSvg, hotSvg, NEW, node, OLD, raisePips, satellitesSvg, setPips, SPREAD_CSS } from './lib/graph.ts'

// Faults that travel. Starts where "The shortcut" rests (the graph small in the corner) and brings the graph back to
// full size, clean. `spread`: the graph becomes TrainTicket-sized (50 services), a fault is injected in `config`, and
// it travels to the callers edge by edge; the alerts pile up two hops away, on `travel`, not at the cause. `keep`: of
// all injections, only the failures users could feel are kept (abstract: 1,430 of 9,152).
const CAPTIONS = ['Our benchmark: faults spread to other services', 'Kept: only failures users could feel']

export default gsapScene(({ root, gsap, at }) => {
  const s = sec(at)
  const path = NEW.path
  const top = 420, bottom = 66
  const css = `${GRAPH_CSS}${SPREAD_CSS}
    .chip rect { fill: var(--pm-color-surface); stroke: var(--pm-color-ink); stroke-width: 2.5; }
    .chip text { font-size: 18px; }
    .tt { font-size: 18px; }
    .funnel .shape { fill: color-mix(in oklab, var(--pm-color-accent) 18%, transparent); stroke: var(--pm-color-ink); stroke-width: 2.5; }
    .funnel .end { stroke: var(--pm-color-ink); stroke-width: 2.5; }
    .funnel text { font-size: 20px; }
    .funnel .count { font-size: 76px; font-weight: 600; font-variant-numeric: tabular-nums; }
  `
  const h = node(NEW.cause)
  const svg = `
    ${captionsSvg(CAPTIONS)}
    <g class="graph-wrap">${satellitesSvg()}<g class="hots">${hotSvg()}</g>${graphSvg()}</g>
    <text class="mono muted tt" x="40" y="96" opacity="0">TRAINTICKET · 50 SERVICES · SHIFTING TRAFFIC</text>
    <g class="chip" opacity="0"><rect x="${h.x + 50}" y="${h.y + 14}" width="196" height="36" /><text class="mono" x="${h.x + 64}" y="${h.y + 38}">31 fault types</text></g>
    <g class="funnel" opacity="0">
      <path class="shape" d="M ${1020 - top / 2} 190 L ${1020 + top / 2} 190 L ${1020 + bottom / 2} 470 L ${1020 - bottom / 2} 470 Z" />
      <rect class="end" x="${1020 - top / 2}" y="170" width="${top}" height="20" style="fill:var(--pm-color-muted)" />
      <rect class="end" x="${1020 - bottom / 2}" y="470" width="${bottom}" height="20" style="fill:${COLOR.cause}" />
      <text class="mono" x="1020" y="155" text-anchor="middle">9,152 INJECTED</text>
      <text x="1020" y="330" text-anchor="middle" style="font-size:19px">users felt it?</text>
      <text class="count" x="1020" y="580" text-anchor="middle">9,152</text>
      <text class="mono muted" x="1020" y="620" text-anchor="middle" style="font-size:18px">FAILURES KEPT · ABSTRACT</text>
    </g>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const all = (sel: string) => el.querySelectorAll(sel)
  gsap.set(all('.edge'), { strokeDashoffset: 0 })
  gsap.set(one(`.ring-${OLD.cause}`), { opacity: 1 })
  setPips(gsap, el, OLD.pips)

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  // spread: from the corner back to full size, the old fault cleared
  tl.fromTo(one('.graph-wrap'), { scale: 0.5, x: 0, y: 330, transformOrigin: '0px 0px' }, { scale: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.inOut' }, s(0))
  tl.fromTo([one(`.ring-${OLD.cause}`), ...Array.from(all(`[class^="pip pip-${OLD.cause}-"]`))], { opacity: 1 }, { opacity: 0, duration: 0.4 }, s(0, 0.2))
  tl.fromTo(all('.sat'), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.03 }, s(0, 1.1))
  tl.fromTo(one('.tt'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, s(0, 1.4))
  tl.fromTo(one('.chip'), { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 }, s(0, 4.2))
  tl.fromTo(one(`.ring-${NEW.cause}`), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, s(0, 5.0))
  raisePips(tl, el, NEW.cause, NEW.pips[NEW.cause]!, s(0, 5.4))
  path.slice(1).forEach((_, i) => {
    const t = s(0, 5.8 + i * 1.0)
    tl.fromTo(one(`.hot-${i}`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.in' }, t)
    const id = path[i + 1]!
    raisePips(tl, el, id, NEW.pips[id]!, t + 0.5, 0.1)
  })
  tl.fromTo(one('.chip'), { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, s(0, 8.8))

  // keep
  tl.fromTo(one('.funnel'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, s(1, 0.1))
  tl.fromTo(one('.count'), { textContent: 9152 }, { textContent: 1430, duration: 1.8, ease: 'power2.inOut', snap: { textContent: 1 }, modifiers: { textContent: (v: string | number) => Math.round(Number(v)).toLocaleString('en-US') } }, s(1, 0.8))
  playCaptions(tl, el, CAPTIONS, at)
  tl.to({}, { duration: 0.01 }, at(2) / 1000 - 0.01)
  return tl
})
