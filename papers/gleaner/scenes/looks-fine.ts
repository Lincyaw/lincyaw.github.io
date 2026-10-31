import { defineScene } from '@lincyaw/addon-motion/scene'
import { bins, C, caption, el, enter, label, MONO, span, stage, text } from './kit.ts'

// The claim, then the protagonist. `bins`: all traces fill a large bin while a thin one takes 1%; the diagnosis dial
// over the thin bin ends higher (values come at the end of the film). `trace`: the bins give way to one trace from
// Fig. 1 of the paper: three spans, each OK, the root span 47 ms; then its log events slide out from under it, two
// ERROR lines and a WARN, and a red mark stays on the card's edge.
const SPANS = [
  ['BasicController.queryForTravel', 'OK · 47 ms', 0],
  ['routeservice /routes/{routeId}', 'OK', 40],
  ['priceservice /prices/{routeId}/{trainType}', 'OK', 80],
] as const
const LOGS = [
  ['[ERROR] Failed to parse priceConfig: economyRate field missing', C.error],
  ['[ERROR] [queryForTravel][catch price exception]', C.error],
  ['[WARN] Using fallback pricing: economy=95.0, comfort=120.0', C.muted],
] as const

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const b = bins(svg, [0.41, 0.56])
  const card = el(svg, 'g')
  const drawer = el(card, 'g')
  el(drawer, 'rect', { x: 6, y: 6, width: 820, height: 150, fill: C.ink })
  el(drawer, 'rect', { x: 0, y: 0, width: 820, height: 150, fill: C.white, stroke: C.error, 'stroke-width': 3 })
  label(drawer, 24, 26, 'Log events inside the root span', { fill: C.error, 'font-size': 16 })
  LOGS.forEach(([line, color], i) => text(drawer, 24, 64 + i * 32, line, { 'font-family': MONO, 'font-size': 19, fill: color }))
  el(card, 'rect', { x: 6, y: 6, width: 820, height: 210, fill: C.ink })
  el(card, 'rect', { x: 0, y: 0, width: 820, height: 210, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  label(card, 24, 30, 'One trace · Train-Ticket', { 'font-size': 16 })
  const rows = SPANS.map(([name, status, indent], i) => {
    const y = 64 + i * 50
    el(card, 'rect', { x: 24 + indent, y: y - 16, width: 600 - indent, height: 32, fill: C.soft, stroke: C.muted, 'stroke-width': 2 })
    text(card, 36 + indent, y, name, { 'font-family': MONO, 'font-size': 17 })
    const ok = text(card, 800, y, `✓ ${status}`, { 'text-anchor': 'end', 'font-size': 22, 'font-weight': 600 })
    return ok
  })
  const mark = el(card, 'circle', { cx: 820, cy: 0, r: 14, fill: C.error, stroke: C.ink, 'stroke-width': 3 })
  const line = caption(svg, [[at(0) + 600, 'Too many traces to keep them all.'], [at(0) + 3200, 'Could 1% diagnose better than all?'], [at(1) + 900, 'One trace: every span OK.'], [at(1) + 3800, 'Inside: an error log.']])

  return (ms: number) => {
    const t0 = ms - at(0), t1 = ms - at(1)
    line(ms)
    const fill = span(t0, 500, 3000)
    const gone = span(t1, 0, 700)
    b.set([0.92 * fill, 0.25 * fill], [0.41 * span(t0, 2600, 1600), 0.56 * span(t0, 2900, 1600)], [0, 0])
    b.g.setAttribute('opacity', String(enter(t0, 0, 500) * (1 - gone)))
    // The trace comes forward out of the stream that filled the bins.
    const c = enter(t1, 400, 600)
    const open = span(t1, 3600, 900)
    card.setAttribute('transform', `translate(${227} ${200 - 80 * open + (1 - c) * 60})`)
    card.setAttribute('opacity', String(c))
    rows.forEach((ok, i) => ok.setAttribute('opacity', String(enter(t1, 1300 + i * 400))))
    drawer.setAttribute('transform', `translate(0 ${60 + 168 * open})`)
    drawer.setAttribute('opacity', String(open > 0 ? 1 : 0))
    mark.setAttribute('opacity', String(enter(t1, 5200, 300)))
  }
})
