import { defineScene } from '@lincyaw/addon-motion/scene'
import { C, el, enter, label, PIXEL, shuffled, span, stage, text } from './kit.ts'

// The finding as a count, one state (`grid`). 200 small chains stand for the answers of 11 frontier LLMs (the means
// of the abstract). First the roots of 152 of them turn green: the agent named a correct root-cause service, 76.0%.
// Then the chains are checked: 123 connect to the symptom, 61.5%; in the other 29 a red gap stays where a hop is
// missing, and those 29 pulse once. The title card settles under the grid.
const COLS = 20, ROWS = 10, N = COLS * ROWS
const RIGHT = 152, CONNECTED = 123

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  label(svg, 60, 70, '11 frontier LLMs, graded on the chain', { 'font-size': 22, fill: C.ink })
  const order = shuffled(N, 20260630)
  const rank = new Map(order.map((cell, i) => [cell, i]))
  const cells = Array.from({ length: N }, (_, i) => {
    const x = 60 + (i % COLS) * 38, y = 130 + Math.floor(i / COLS) * 44
    const g = el(svg, 'g', { transform: `translate(${x} ${y})` })
    const l1 = el(g, 'line', { x1: 8, y1: 0, x2: 16, y2: 0, 'stroke-width': 3 })
    const l2 = el(g, 'line', { x1: 20, y1: 0, x2: 26, y2: 0, 'stroke-width': 3 })
    const root_ = el(g, 'rect', { x: 0, y: -5, width: 10, height: 10 })
    const mid = el(g, 'circle', { cx: 18, cy: 0, r: 4 })
    const end = el(g, 'circle', { cx: 29, cy: 0, r: 4 })
    const gap = el(g, 'line', { x1: 13, y1: -9, x2: 13, y2: 9, stroke: C.gap, 'stroke-width': 4 })
    return { g, l1, l2, root: root_, mid, end, gap, x, y, rank: rank.get(i)! }
  })
  const right = text(svg, 900, 210, '0.0%', { 'font-family': PIXEL, 'font-size': 64, fill: C.right })
  const rightLabel = label(svg, 900, 268, 'name a correct service', { 'font-size': 18, fill: C.right })
  const conn = text(svg, 900, 360, '0.0%', { 'font-family': PIXEL, 'font-size': 64, fill: C.ink })
  const connLabel = label(svg, 900, 418, 'connect it to the symptom', { 'font-size': 18, fill: C.ink })
  const gapNote = label(svg, 900, 480, 'right name, broken chain', { 'font-size': 18, fill: C.gap })
  const source = label(svg, 60, 590, 'Means over 11 LLMs · abstract, Table 2', { 'font-size': 14 })
  const card = el(svg, 'g')
  el(card, 'rect', { x: 0, y: 620, width: 1280, height: 100, fill: C.ink })
  text(card, 60, 670, 'Check the chain, not the name.', { 'font-size': 34, 'font-weight': 700, fill: C.white })
  text(card, 1220, 655, 'OpenRCA 2.0', { 'text-anchor': 'end', 'font-size': 26, 'font-weight': 600, fill: C.white })
  text(card, 1220, 690, 'arXiv 2606.27154', { 'text-anchor': 'end', 'font-family': PIXEL, 'font-size': 16, fill: C.line })

  return (ms: number) => {
    const t = ms - at(0)
    const named = span(t, 3800, 2000), linked = span(t, 7500, 2000)
    const pulse = t > 9800 && t < 11000 ? 1 + 0.35 * Math.sin(((t - 9800) / 1200) * Math.PI) : 1
    for (const c of cells) {
      const shown = enter(t, (c.x + c.y) * 1.2, 300)
      c.g.setAttribute('opacity', String(shown))
      const isRight = c.rank < RIGHT && c.rank < named * RIGHT
      const isChecked = c.rank < RIGHT && c.rank < linked * RIGHT
      const isLinked = isChecked && c.rank < CONNECTED
      const isGap = isChecked && c.rank >= CONNECTED
      c.root.setAttribute('fill', isRight ? C.right : C.line)
      const chain = isLinked ? C.ink : C.line
      c.l1.setAttribute('stroke', isGap ? 'none' : chain)
      c.l2.setAttribute('stroke', chain)
      c.mid.setAttribute('fill', chain)
      c.end.setAttribute('fill', chain)
      c.gap.setAttribute('opacity', isGap ? '1' : '0')
      c.g.setAttribute('transform', `translate(${c.x} ${c.y}) scale(${isGap ? pulse : 1})`)
    }
    right.textContent = `${(76.0 * named).toFixed(1)}%`
    right.setAttribute('opacity', String(enter(t, 3600)))
    rightLabel.setAttribute('opacity', String(enter(t, 3600)))
    conn.textContent = `${(61.5 * linked).toFixed(1)}%`
    conn.setAttribute('opacity', String(enter(t, 7300)))
    connLabel.setAttribute('opacity', String(enter(t, 7300)))
    gapNote.setAttribute('opacity', String(enter(t, 9800)))
    source.setAttribute('opacity', String(enter(t, 3600)))
    const c = enter(t, 11500, 600)
    card.setAttribute('transform', `translate(0 ${(1 - c) * 100})`)
  }
})
