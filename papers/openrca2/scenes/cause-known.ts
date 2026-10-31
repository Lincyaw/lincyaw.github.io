import { defineScene } from '@lincyaw/addon-motion/scene'
import { arrow, C, caption, el, enter, label, MONO, node, span, stage, text } from './kit.ts'

// The turn of the film, one state (`forward`). The chain greys out and telemetry rises from it: a trace, a latency
// spike, an error log. Reasoning backward from them reaches two candidates that look alike (Seat and Route). Then
// the injected fault, do(Seat = NetworkDelay), lands on Seat: Route drops away and the arrows flip to run forward
// from the known cause, lighting each service as they reach it.
const X = { seat: 260, travel: 530, order: 800, gateway: 1070 }
const Y = 400

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const back = [arrow(svg, C.muted, 3, true), arrow(svg, C.muted, 3, true), arrow(svg, C.muted, 3, true), arrow(svg, C.muted, 3, true)]
  const fwd = [arrow(svg), arrow(svg), arrow(svg)]
  const n = { seat: node(svg, 'Seat'), travel: node(svg, 'Travel'), order: node(svg, 'Order'), gateway: node(svg, 'Gateway') }
  const route = node(svg, 'Route')
  const qs = [X.seat, 395].map((x, i) => {
    const g = el(svg, 'g')
    el(g, 'circle', { cx: 0, cy: 0, r: 22, fill: C.white, stroke: C.muted, 'stroke-width': 3 })
    text(g, 0, 2, '?', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 700, fill: C.muted })
    return { g, x, y: i === 0 ? Y - 52 : 600 - 52 }
  })

  // Telemetry over the services: a trace, a latency spike, an error log.
  const trace = el(svg, 'g')
  for (const [i, w] of [[0, 150], [1, 120], [2, 70]] as const) el(trace, 'rect', { x: -75 + i * 20, y: -40 + i * 22, width: w, height: 14, fill: C.line, stroke: C.muted, 'stroke-width': 2 })
  const spike = el(svg, 'path', { d: 'M -90 20 L -40 20 L -20 16 L -5 -40 L 10 -46 L 25 12 L 45 20 L 90 20', fill: 'none', stroke: C.muted, 'stroke-width': 3 })
  const log = el(svg, 'g')
  el(log, 'rect', { x: -130, y: -26, width: 260, height: 52, fill: C.white, stroke: C.muted, 'stroke-width': 2 })
  text(log, -118, 1, '[ERROR] timeout', { 'font-family': MONO, 'font-size': 22, fill: C.gap })
  const marker = el(svg, 'g')
  el(marker, 'line', { x1: 0, y1: 0, x2: 0, y2: 60, stroke: C.ink, 'stroke-width': 4 })
  el(marker, 'rect', { x: -176, y: -64, width: 352, height: 60, fill: C.ink })
  text(marker, 0, -33, 'do(Seat = NetworkDelay)', { 'text-anchor': 'middle', 'font-family': MONO, 'font-size': 24, fill: C.white })
  const injected = label(svg, X.seat, 0, 'injected on purpose', { 'text-anchor': 'middle', 'font-size': 18, fill: C.ink })
  const line = caption(svg, [[at(0) + 2300, 'Labels stop at the root cause.'], [at(0) + 4200, 'From telemetry, many faults look alike.'], [at(0) + 7100, 'But the fault was injected on purpose.'], [at(0) + 10300, 'Known cause → follow it forward.']])

  return (ms: number) => {
    const t = ms - at(0)
    const grey = 1 - span(t, 10400, 1500)
    for (const k of ['seat', 'travel', 'order', 'gateway'] as const) {
      n[k].set(X[k], Y)
      n[k].box.setAttribute('stroke', C.muted)
      n[k].t.setAttribute('fill', C.muted)
      n[k].shadow.setAttribute('fill', C.line)
    }
    trace.setAttribute('transform', `translate(${X.travel} ${Y - 150})`)
    trace.setAttribute('opacity', String(enter(t, 2300) * (0.35 + 0.65 * grey)))
    spike.setAttribute('transform', `translate(${X.order} ${Y - 150})`)
    spike.setAttribute('opacity', String(enter(t, 2600) * (0.35 + 0.65 * grey)))
    log.setAttribute('transform', `translate(${X.gateway} ${Y - 150})`)
    log.setAttribute('opacity', String(enter(t, 2900) * (0.35 + 0.65 * grey)))

    // Backward from the symptom: two sources fit the same telemetry.
    const fade = 1 - span(t, 7600, 700)
    back[0]!.set(X.gateway - 96, Y + 18, X.order + 96, Y + 18, span(t, 3200, 400), fade)
    back[1]!.set(X.order - 96, Y + 18, X.travel + 96, Y + 18, span(t, 3500, 400), fade)
    back[2]!.set(X.travel - 96, Y + 18, X.seat + 96, Y + 18, span(t, 3800, 400), fade)
    back[3]!.set(X.travel - 40, Y + 36, 430, 600 - 36, span(t, 3800, 400), fade)
    route.set(395, 600, enter(t, 4000) * fade)
    route.box.setAttribute('stroke', C.muted); route.t.setAttribute('fill', C.muted); route.shadow.setAttribute('fill', C.line)
    qs.forEach((q, i) => {
      const o = enter(t, 4200 + i * 250) * (i === 0 ? 1 - span(t, 7100, 300) : fade)
      const pulse = 1 + 0.08 * Math.max(0, Math.sin((t - 4200) / 180)) * (t > 4200 && t < 6800 ? 1 : 0)
      q.g.setAttribute('transform', `translate(${q.x + 110} ${q.y + 20}) scale(${pulse})`)
      q.g.setAttribute('opacity', String(o))
    })

    // The turn: the injected fault lands on Seat.
    const drop = enter(t, 7100, 450)
    marker.setAttribute('transform', `translate(${X.seat} ${Y - 92 - 120 * (1 - drop)})`)
    marker.setAttribute('opacity', String(drop))
    injected.setAttribute('y', String(Y + 58))
    injected.setAttribute('opacity', String(enter(t, 7700)))
    const known = enter(t, 7400, 300)
    if (known > 0) {
      n.seat.box.setAttribute('stroke', C.ink); n.seat.t.setAttribute('fill', C.ink); n.seat.shadow.setAttribute('fill', C.ink)
    }
    // Forward from the cause, each service lit as the arrow reaches it.
    const hops = [['seat', 'travel'], ['travel', 'order'], ['order', 'gateway']] as const
    hops.forEach(([a, b], i) => {
      const p = span(t, 10500 + i * 500, 450)
      fwd[i]!.set(X[a] + 96, Y, X[b] - 96, Y, p)
      if (p >= 1) { n[b].box.setAttribute('stroke', C.ink); n[b].t.setAttribute('fill', C.ink); n[b].shadow.setAttribute('fill', C.ink) }
    })
    line(ms)
  }
})
