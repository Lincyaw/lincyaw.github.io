import { defineScene } from '@lincyaw/addon-motion/scene'
import { C, caption, el, enter, label, lerp, span, stage, text } from './kit.ts'

// Why existing samplers lose the trace, one state (`lanes`). Left, a fast sampler built for speed: it reads the span
// bars (calls, status, latency), all OK, never the log, and the card drops into the discarded pile. Right, a sampler
// built to read logs: the card is redrawn as a graph for a trained neural network, and while it waits, more cards
// queue behind it and the clock keeps turning.
function miniCard(parent: Element) {
  const g = el(parent, 'g')
  el(g, 'rect', { x: 4, y: 4, width: 150, height: 92, fill: C.ink })
  el(g, 'rect', { x: 0, y: 0, width: 150, height: 92, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  for (const [i, w] of [[0, 110], [1, 88], [2, 66]] as const) el(g, 'rect', { x: 14 + i * 12, y: 16 + i * 24, width: w, height: 14, fill: C.soft, stroke: C.muted, 'stroke-width': 2 })
  const dot = el(g, 'circle', { cx: 150, cy: 0, r: 11, fill: C.error, stroke: C.ink, 'stroke-width': 3 })
  return { g, dot }
}

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const lanes = [
    { x: 80, title: 'Built for speed', sub: 'reads calls · status · latency' },
    { x: 680, title: 'Built to read logs', sub: 'graph + trained neural network' },
  ].map(l => {
    const g = el(svg, 'g')
    el(g, 'rect', { x: l.x, y: 200, width: 520, height: 420, fill: 'none', stroke: C.line, 'stroke-width': 3 })
    label(g, l.x + 24, 236, l.title, { fill: C.ink, 'font-size': 20 })
    text(g, l.x + 24, 270, l.sub, { 'font-size': 20, fill: C.muted })
    return g
  })
  // Left: the gate that reads span fields, and the discard pile.
  const gate = el(svg, 'g')
  ;['calls ✓', 'status ✓', 'latency ✓', 'logs —'].forEach((f, i) => {
    const x = 110 + i * 118
    el(gate, 'rect', { x, y: 310, width: 106, height: 40, fill: C.white, stroke: i === 3 ? C.line : C.ink, 'stroke-width': 3 })
    text(gate, x + 53, 331, f, { 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 600, fill: i === 3 ? C.muted : C.ink })
  })
  const pile = el(svg, 'g')
  for (let i = 0; i < 4; i++) el(pile, 'rect', { x: 120 + i * 8, y: 540 - i * 10, width: 150, height: 60, fill: C.soft, stroke: C.line, 'stroke-width': 2 })
  label(pile, 300, 580, 'discarded', { fill: C.muted, 'font-size': 18 })
  // Right: the graph, the model box, the queue and the clock.
  const graph = el(svg, 'g')
  const gn: [number, number][] = [[760, 340], [840, 400], [920, 340], [840, 470], [760, 470]]
  ;[[0, 1], [1, 2], [1, 3], [3, 4], [0, 4]].forEach(([a, c]) => el(graph, 'line', { x1: gn[a!]![0], y1: gn[a!]![1], x2: gn[c!]![0], y2: gn[c!]![1], stroke: C.ink, 'stroke-width': 3 }))
  gn.forEach(([x, y], i) => el(graph, 'circle', { cx: x, cy: y, r: 14, fill: i > 2 ? C.error : C.white, stroke: C.ink, 'stroke-width': 3 }))
  const model = el(svg, 'g')
  el(model, 'rect', { x: 990, y: 330, width: 170, height: 130, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) el(model, 'circle', { cx: 1030 + k * 45, cy: 360 + r * 35, r: 9, fill: C.soft, stroke: C.ink, 'stroke-width': 2 })
  const clock = el(svg, 'g', { transform: 'translate(1075 540)' })
  el(clock, 'circle', { cx: 0, cy: 0, r: 34, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  const hand = el(clock, 'line', { x1: 0, y1: 0, x2: 0, y2: -26, stroke: C.error, 'stroke-width': 4 })
  const training = label(svg, 1075, 596, 'offline training', { 'text-anchor': 'middle', 'font-size': 16 })
  const queue = Array.from({ length: 6 }, () => miniCard(svg)).reverse()
  const hero = miniCard(svg)
  const line = caption(svg, [[at(0) + 1200, 'Fast samplers read only the spans.'], [at(0) + 4000, 'The error log is never read.'], [at(0) + 6400, 'Log-aware samplers build a graph per trace,'], [at(0) + 9400, 'too slow for a live stream.']])

  return (ms: number) => {
    const t = ms - at(0)
    line(ms)
    lanes.forEach((g, i) => g.setAttribute('opacity', String(enter(t, 200 + i * 300))))
    gate.setAttribute('opacity', String(enter(t, 900)))
    pile.setAttribute('opacity', String(enter(t, 900)))
    // The trace enters the fast lane, passes the gate, falls into the pile.
    const into = span(t, 1500, 1200), drop = span(t, 4000, 900)
    const hx = lerp(lerp(565, 280, into), 130, drop), hy = lerp(lerp(60, 380, into), 470, drop)
    hero.g.setAttribute('transform', `translate(${hx} ${hy})`)
    hero.g.setAttribute('opacity', String(enter(t, 0) * (1 - 0.5 * drop)))
    // A copy goes to the log-aware lane and becomes a graph; more traces queue behind it.
    graph.setAttribute('opacity', String(enter(t, 6600, 600)))
    model.setAttribute('opacity', String(enter(t, 6400)))
    queue.forEach((q, i) => {
      const p = enter(t, 7600 + i * 450, 400)
      q.g.setAttribute('transform', `translate(${940 - i * 44} ${520}) scale(0.6)`)
      q.g.setAttribute('opacity', String(p))
    })
    clock.setAttribute('opacity', String(enter(t, 6400)))
    training.setAttribute('opacity', String(enter(t, 6400)))
    hand.setAttribute('transform', `rotate(${Math.max(0, t - 6400) * 0.12})`)
  }
})
