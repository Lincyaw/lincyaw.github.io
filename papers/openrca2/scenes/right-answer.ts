import { defineScene } from '@lincyaw/addon-motion/scene'
import { arrow, C, caption, el, enter, label, lerp, node, PIXEL, span, stage, text } from './kit.ts'

// Figure 1 of the paper, told in two states. `outcome`: the agent's chain Seat → Order → Gateway draws, Seat is the
// right root cause, and an outcome-only score stamps it correct. `truth`: the verified chain Seat → Travel → Order →
// Gateway grows above it; the agent's row moves down to make room, and a dashed Travel appears in the agent's row
// where its arrow jumps over it.
const X = { seat: 260, travel: 530, order: 800, gateway: 1070 }

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const truthLabel = label(svg, 170, 0, 'What really happened')
  const agentLabel = label(svg, 170, 0, "The agent's answer")
  const tArrows = [arrow(svg), arrow(svg), arrow(svg)]
  const tNodes = { seat: node(svg, 'Seat'), travel: node(svg, 'Travel'), order: node(svg, 'Order'), gateway: node(svg, 'Gateway') }
  const ghost = el(svg, 'g')
  const ghostBox = el(ghost, 'rect', { x: -90, y: -32, width: 180, height: 64, fill: 'none', stroke: C.gap, 'stroke-width': 3, 'stroke-dasharray': '9 8' })
  text(ghost, 0, 1, 'Travel', { 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 600, fill: C.gap, opacity: 0.75 })
  const skipped = label(ghost, 0, 62, 'skipped', { 'text-anchor': 'middle', fill: C.gap, 'font-size': 20 })
  const link = el(svg, 'line', { stroke: C.gap, 'stroke-width': 3, 'stroke-dasharray': '6 8' })
  const aArrows = [arrow(svg), arrow(svg)]
  const aNodes = { seat: node(svg, 'Seat'), order: node(svg, 'Order'), gateway: node(svg, 'Gateway') }
  const rootTag = label(svg, X.seat, 0, 'root cause', { 'text-anchor': 'middle', fill: C.right, 'font-size': 18 })
  const stamp = el(svg, 'g')
  el(stamp, 'rect', { x: 6, y: 6, width: 330, height: 66, fill: C.ink })
  el(stamp, 'rect', { x: 0, y: 0, width: 330, height: 66, fill: C.white, stroke: C.right, 'stroke-width': 4 })
  text(stamp, 165, 34, 'SCORED: CORRECT ✓', { 'text-anchor': 'middle', 'font-family': PIXEL, 'font-size': 24, fill: C.right })
  void ghostBox
  const line = caption(svg, [[at(0) + 1200, 'An AI agent names the root cause.'], [at(0) + 6900, 'Right service. Scored correct.'], [at(1) + 1000, 'But the fault went through Travel.'], [at(1) + 4100, 'Its chain skips Travel.']])

  return (ms: number) => {
    const t0 = ms - at(0), t1 = ms - at(1)
    line(ms)
    // The agent's row: centred on its own, lower once the truth needs the top.
    const down = span(t1, 0, 700)
    const ay = lerp(330, 470, down)
    agentLabel.setAttribute('y', String(ay - 70))
    aNodes.seat.set(X.seat, ay, enter(t0, 0))
    aNodes.order.set(X.order, ay, enter(t0, 300))
    aNodes.gateway.set(X.gateway, ay, enter(t0, 500))
    agentLabel.setAttribute('opacity', String(enter(t0, 0)))
    aArrows[0]!.set(X.seat + 96, ay, X.order - 96, ay, span(t0, 1200, 700))
    aArrows[1]!.set(X.order + 96, ay, X.gateway - 96, ay, span(t0, 2000, 500))
    const right = enter(t0, 5000, 500)
    aNodes.seat.box.setAttribute('stroke', right > 0 ? C.right : C.ink)
    aNodes.seat.box.setAttribute('stroke-width', String(3 + 3 * right))
    rootTag.setAttribute('y', String(ay + 56))
    rootTag.setAttribute('opacity', String(right))
    const s = enter(t0, 6900, 450)
    stamp.setAttribute('transform', `translate(${800 - 165 * (1.25 - 0.25 * s)} ${ay + 80}) rotate(-3) scale(${1.25 - 0.25 * s})`)
    stamp.setAttribute('opacity', String(s))

    // The verified chain grows out of Seat, left to right.
    const ty = 200
    truthLabel.setAttribute('y', String(ty - 70))
    truthLabel.setAttribute('opacity', String(enter(t1, 300)))
    tNodes.seat.set(X.seat, ty, enter(t1, 300))
    tArrows[0]!.set(X.seat + 96, ty, X.travel - 96, ty, span(t1, 700, 450))
    tNodes.travel.set(X.travel, ty, enter(t1, 1100))
    tArrows[1]!.set(X.travel + 96, ty, X.order - 96, ty, span(t1, 1300, 450))
    tNodes.order.set(X.order, ty, enter(t1, 1700))
    tArrows[2]!.set(X.order + 96, ty, X.gateway - 96, ty, span(t1, 1900, 450))
    tNodes.gateway.set(X.gateway, ty, enter(t1, 2300))
    const hot = enter(t1, 1900, 400)
    tNodes.travel.box.setAttribute('stroke', hot > 0 ? C.gap : C.ink)
    tNodes.travel.box.setAttribute('stroke-width', String(3 + 3 * hot))
    // Where the agent's arrow jumps, Travel is missing.
    const g = enter(t1, 4100, 500)
    ghost.setAttribute('transform', `translate(${X.travel} ${ay})`)
    ghost.setAttribute('opacity', String(g))
    skipped.setAttribute('opacity', String(enter(t1, 4500)))
    link.setAttribute('x1', String(X.travel)); link.setAttribute('x2', String(X.travel))
    link.setAttribute('y1', String(ty + 40)); link.setAttribute('y2', String(lerp(ty + 40, ay - 40, g)))
    link.setAttribute('opacity', String(g))
  }
})
