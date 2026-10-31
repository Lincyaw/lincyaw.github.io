import { defineScene } from '@lincyaw/addon-motion/scene'
import { arrow, C, caption, el, enter, label, lerp, node, PIXEL, span, stage, text } from './kit.ts'

// PAVE's checks on one chain, then the benchmark the chains make. `verify`: every candidate hop starts dashed;
// three checks run in turn, each with its own row of boxes over the hops. Topology strikes an edge the system cannot
// have (Route → Seat); the baseline check gives each service a latency trace with its pre-injection band, and Route,
// whose spike stays inside its band, drops out; time order turns the surviving hops solid, one after another.
// `benchmark`: the verified chain shrinks into one row of a stack of 500, split by system as in Table 1.
const X = { seat: 360, travel: 610, order: 860, gateway: 1110 }
const Y = 430
const ROWS = ['Topology', 'Baseline', 'Time order'] as const
const SYSTEMS = [['TrainTicket', 320], ['Hotel Reservation', 142], ['OTel Demo', 38]] as const

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const verify = el(svg, 'g')
  const title = label(verify, 60, 60, 'PAVE: three checks per hop', { 'font-size': 22, fill: C.ink })
  const rowY = [150, 210, 270]
  const rowLabels = ROWS.map((r, i) => label(verify, 60, rowY[i]!, r, { 'font-size': 18 }))
  const hops = [['seat', 'travel'], ['travel', 'order'], ['order', 'gateway']] as const
  const boxes = hops.map(([a, b]) => rowY.map(y => {
    const g = el(verify, 'g', { transform: `translate(${(X[a] + X[b]) / 2} ${y})` })
    el(g, 'rect', { x: -18, y: -18, width: 36, height: 36, fill: C.white, stroke: C.line, 'stroke-width': 3 })
    const tick = text(g, 0, 2, '✓', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 700, fill: C.right })
    return { g, tick, frame: g.firstElementChild as SVGRectElement }
  }))
  const dashed = hops.map(() => arrow(verify, C.muted, 3, true))
  const solid = hops.map(() => arrow(verify))
  const toRoute = arrow(verify, C.muted, 3, true)
  const routeToSeat = arrow(verify, C.muted, 3, true)
  const cross = text(verify, 0, 0, '×', { 'text-anchor': 'middle', 'font-size': 56, 'font-weight': 700, fill: C.gap })
  const routeCross = text(verify, 0, 0, '×', { 'text-anchor': 'middle', 'font-size': 56, 'font-weight': 700, fill: C.gap })
  const chain = el(svg, 'g')
  const n = { seat: node(chain, 'Seat', 170), travel: node(chain, 'Travel', 170), order: node(chain, 'Order', 170), gateway: node(chain, 'Gateway', 170) }
  const route = node(verify, 'Route', 170)
  // Each service's latency against its pre-injection band; Route's spike stays inside.
  const spark = (x: number, y: number, inside: boolean) => {
    const g = el(verify, 'g', { transform: `translate(${x} ${y})` })
    el(g, 'rect', { x: -60, y: -6, width: 120, height: 16, fill: C.soft })
    const peak = inside ? 0 : -34
    el(g, 'path', { d: `M -60 2 L -15 2 L -5 ${peak + 2} L 8 ${peak} L 18 2 L 60 2`, fill: 'none', stroke: inside ? C.muted : C.ink, 'stroke-width': 3 })
    return g
  }
  const sparks = [spark(X.seat, 520, false), spark(X.travel, 520, false), spark(X.order, 520, false), spark(X.gateway, 520, false), spark(800, 600, true)]

  // The benchmark: a stack of rows by system.
  const bench = el(svg, 'g')
  const count = text(bench, 300, 330, '0', { 'text-anchor': 'middle', 'font-family': PIXEL, 'font-size': 120, fill: C.ink })
  label(bench, 300, 420, 'failures, each with', { 'text-anchor': 'middle', 'font-size': 18 })
  label(bench, 300, 450, 'its verified chain', { 'text-anchor': 'middle', 'font-size': 18 })
  const benchTitle = text(bench, 300, 200, 'OpenRCA 2.0', { 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 700 })
  label(bench, 300, 640, 'Table 1', { 'text-anchor': 'middle', 'font-size': 16 })
  const stackX = 620, stackW = 300, stackTop = 160, scale = 380 / 500
  let top = stackTop
  const bands = SYSTEMS.map(([name, k]) => {
    const h = k * scale
    const g = el(bench, 'g')
    el(g, 'rect', { x: stackX, y: top, width: stackW, height: h, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
    const id = `orca-band-${Math.random().toString(36).slice(2)}`
    const clipPath = el(el(g, 'defs'), 'clipPath', { id })
    const clip = el(clipPath, 'rect', { x: stackX, y: top, width: stackW, height: 0 })
    const lines = el(g, 'g', { 'clip-path': `url(#${id})` })
    for (let y = top + 5; y < top + h - 2; y += 7) {
      el(lines, 'line', { x1: stackX + 20, x2: stackX + 120, y1: y, y2: y, stroke: C.ink, 'stroke-width': 2 })
      el(lines, 'line', { x1: stackX + 135, x2: stackX + 200, y1: y, y2: y, stroke: C.ink, 'stroke-width': 2 })
      el(lines, 'line', { x1: stackX + 215, x2: stackX + 280, y1: y, y2: y, stroke: C.ink, 'stroke-width': 2 })
    }
    const name_ = text(g, stackX + stackW + 30, top + h / 2, `${name} · ${k}`, { 'font-size': 26 })
    const band = { g, clip, lines, name: name_, top, h }
    top += h + 8
    return band
  })

  const line = caption(svg, [[at(0) + 600, 'PAVE follows the fault hop by hop.'], [at(0) + 5300, 'Can this hop exist?'], [at(0) + 7400, 'Did the next service really change?'], [at(0) + 9500, 'Did the effect come after the cause?'], [at(1) + 1000, 'Verified chains, stacked: OpenRCA 2.0.']])
  return (ms: number) => {
    const t = ms - at(0), b = ms - at(1)
    line(ms)
    const away = span(b, 0, 900)
    verify.setAttribute('opacity', String(1 - away))
    title.setAttribute('opacity', String(enter(t, 0)))
    rowLabels.forEach((r, i) => r.setAttribute('opacity', String(enter(t, 400 + i * 150))))
    for (const k of ['seat', 'travel', 'order', 'gateway'] as const) n[k].set(X[k], Y)
    // The chain itself shrinks into the top row of the stack.
    const sx = lerp(1, 0.24, away), cx = lerp(0, stackX + 10 - (X.seat - 85) * 0.24, away), cy = lerp(0, stackTop - 24 - Y * 0.24, away)
    chain.setAttribute('transform', `translate(${cx} ${cy}) scale(${sx})`)
    chain.setAttribute('opacity', String(1 - span(b, 900, 500)))

    hops.forEach(([a, c], i) => {
      dashed[i]!.set(X[a] + 90, Y, X[c] - 90, Y, enter(t, 600, 300))
      solid[i]!.set(X[a] + 90, Y, X[c] - 90, Y, span(t, 9500 + i * 450, 450))
      const marks = [5300 + i * 200, 8300 + i * 200, 9500 + i * 450 + 350]
      boxes[i]!.forEach((box, r) => {
        const on = enter(t, marks[r]!, 250)
        box.tick.setAttribute('opacity', String(on))
        box.frame.setAttribute('stroke', on > 0.5 ? C.ink : C.line)
        box.g.setAttribute('opacity', String(enter(t, 500 + r * 150)))
      })
    })
    // Topology: an edge the system cannot have goes.
    route.set(610, 600, enter(t, 900) * (1 - span(t, 8800, 600)))
    toRoute.set(X.travel, Y + 36, 610, 600 - 36, enter(t, 900, 300), 1 - span(t, 8800, 600))
    routeToSeat.set(610 - 90, 600 - 10, X.seat + 20, Y + 36, enter(t, 900, 300), 1 - span(t, 5800, 500))
    cross.setAttribute('x', String((610 - 90 + X.seat + 20) / 2)); cross.setAttribute('y', String((600 - 10 + Y + 36) / 2))
    cross.setAttribute('opacity', String(enter(t, 5300, 200) * (1 - span(t, 5800, 500))))
    // Baseline: each service against its band; Route's spike is ordinary noise.
    sparks.forEach((s, i) => s.setAttribute('opacity', String(enter(t, 7400 + i * 150) * (i === 4 ? 1 - span(t, 8800, 600) : 1))))
    routeCross.setAttribute('x', '610'); routeCross.setAttribute('y', '600')
    routeCross.setAttribute('opacity', String(enter(t, 8400, 200) * (1 - span(t, 8800, 600))))

    // The benchmark fills band by band while the count rises to 500.
    bench.setAttribute('opacity', String(enter(b, 700, 500)))
    let filled = 0
    bands.forEach((band, i) => {
      const p = span(b, 1000 + i * 900, 900)
      band.clip.setAttribute('height', String(band.h * p))
      band.name.setAttribute('opacity', String(enter(b, 1300 + i * 900)))
      band.g.setAttribute('opacity', String(enter(b, 900 + i * 900, 300)))
      filled += SYSTEMS[i]![1] * p
    })
    count.textContent = String(Math.round(filled))
    benchTitle.setAttribute('opacity', String(enter(b, 800)))
  }
})
