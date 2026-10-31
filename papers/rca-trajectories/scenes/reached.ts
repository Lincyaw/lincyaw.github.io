import { defineScene } from '@lincyaw/addon-motion/scene'
import { arrow, C, caption, chip, el, enter, label, lerp, node, PIXEL, span, stage, text } from './kit.ts'

// Figure 1 of the paper in two states. `score`: the outcome card (final answer "affected service", wrong; the rows
// Acc@k, MRR, MAP) lands first, then the annotated fault path Root cause → Affected → Symptom draws beside it.
// `walk`: a marker walks the path as the agent's trajectory did, stamping a chip per phase with its step range; at
// steps 37–40 it stands on the root cause, and a dashed chip marks the metrics it never queried; it walks back to the
// symptom and its answer line runs to the card.
const X = { root: 150, affected: 420, symptom: 690 }
const Y = 290

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const pathLabel = label(svg, 50, Y - 130, 'Annotated fault path')
  const arrows = [arrow(svg), arrow(svg)]
  const nodes = {
    root: node(svg, 'Root cause', 200, 64, 26),
    affected: node(svg, 'Affected', 200, 64, 26),
    symptom: node(svg, 'Symptom', 200, 64, 26),
  }
  const rootTag = label(svg, X.root, Y + 50, 'where the fault began', { 'text-anchor': 'middle', 'font-size': 13, fill: C.right })

  // The trajectory's footprints, one chip per phase, stacked under the node where it happened.
  const chips = {
    rank: chip(svg, 'Steps 4–7', 'rank by error count'),
    hypo: chip(svg, 'Steps 9–13', 'hypothesis: Affected'),
    query: chip(svg, 'Steps 16–30', 'query to confirm it'),
    reach: chip(svg, 'Steps 37–40', 'reaches the root cause', { color: C.right }),
    unread: chip(svg, 'Its metrics', 'never queried', { color: C.gap, dashed: true }),
    recheck: chip(svg, 'Steps 45–47', 'recheck, then answer'),
  }
  const answerLine = el(svg, 'path', { fill: 'none', stroke: C.gap, 'stroke-width': 3, 'stroke-dasharray': '8 7' })
  const marker = el(svg, 'g')
  el(marker, 'circle', { cx: 0, cy: 0, r: 15, fill: C.white, stroke: C.ink, 'stroke-width': 4 })
  el(marker, 'line', { x1: 11, y1: 11, x2: 24, y2: 24, stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'square' })
  const agentTag = label(marker, 0, -34, 'agent', { 'text-anchor': 'middle', 'font-size': 14, fill: C.ink })

  // The outcome card (Figure 1, right).
  const card = el(svg, 'g')
  el(card, 'rect', { x: 8, y: 8, width: 360, height: 430, fill: C.ink })
  el(card, 'rect', { x: 0, y: 0, width: 360, height: 430, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  text(card, 24, 36, 'OUTCOME METRICS', { 'font-family': PIXEL, 'font-size': 18, fill: C.muted })
  text(card, 24, 92, 'Final answer:', { 'font-size': 24, fill: C.muted })
  text(card, 24, 130, 'affected service', { 'font-size': 32, 'font-weight': 700 })
  const cross = el(card, 'g')
  el(cross, 'line', { x1: -20, y1: -20, x2: 20, y2: 20, stroke: C.gap, 'stroke-width': 9 })
  el(cross, 'line', { x1: 20, y1: -20, x2: -20, y2: 20, stroke: C.gap, 'stroke-width': 9 })
  const rows = ['Acc@k', 'MRR', 'MAP'].map((name, i) => {
    const g = el(card, 'g')
    el(g, 'rect', { x: 24, y: 190 + i * 74, width: 312, height: 56, fill: C.soft })
    text(g, 180, 218 + i * 74, name, { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600 })
    return g
  })

  const line = caption(svg, [
    [at(0) + 400, 'Final answer: the affected service. Scored wrong.'],
    [at(0) + 3400, 'Acc@k, MRR and MAP keep only this line.'],
    [at(1) + 200, 'The trajectory behind it, phase by phase.'],
    [at(1) + 2900, 'Steps 37–40: at the root cause, its metrics never queried.'],
  ])

  return (ms: number) => {
    const t0 = ms - at(0), t1 = ms - at(1)
    line(ms)

    // The card lands first, its cross stamps, the metric rows fill in later.
    const c = enter(t0, 0, 450)
    card.setAttribute('transform', `translate(870 ${lerp(100, 150, c)})`)
    card.setAttribute('opacity', String(c))
    const x = enter(t0, 650, 250)
    cross.setAttribute('transform', `translate(318 112) scale(${lerp(1.6, 1, x)})`)
    cross.setAttribute('opacity', String(x))
    rows.forEach((g, i) => g.setAttribute('opacity', String(enter(t0, 3400 + i * 180, 350))))

    // The annotated path, cause on the left.
    pathLabel.setAttribute('opacity', String(enter(t0, 1400)))
    nodes.root.set(X.root, Y, enter(t0, 1500))
    arrows[0]!.set(X.root + 104, Y, X.affected - 104, Y, span(t0, 1800, 450))
    nodes.affected.set(X.affected, Y, enter(t0, 2150))
    arrows[1]!.set(X.affected + 104, Y, X.symptom - 104, Y, span(t0, 2350, 450))
    nodes.symptom.set(X.symptom, Y, enter(t0, 2700))
    rootTag.setAttribute('opacity', String(enter(t0, 2900)))

    // The walk: symptom → affected → root cause → back to the symptom.
    const legs: [number, number, number][] = [[400, X.symptom, X.symptom], [1100, X.symptom, X.affected], [2500, X.affected, X.root], [4300, X.root, X.symptom]]
    let mx: number = X.symptom
    for (const [start, from, to] of legs) if (t1 >= start) mx = lerp(from, to, span(t1, start, start === 4300 ? 800 : 600))
    marker.setAttribute('transform', `translate(${mx} ${Y - 62})`)
    marker.setAttribute('opacity', String(enter(t1, 0, 300)))
    agentTag.setAttribute('opacity', String(enter(t1, 0, 300)))
    chips.rank.set(X.symptom, Y + 100, enter(t1, 650, 300))
    chips.hypo.set(X.affected, Y + 100, enter(t1, 1700, 300))
    chips.query.set(X.affected, Y + 172, enter(t1, 2150, 300))
    chips.reach.set(X.root, Y + 100, enter(t1, 3100, 300))
    chips.unread.set(X.root, Y + 172, enter(t1, 3500, 400))
    chips.recheck.set(X.symptom, Y + 172, enter(t1, 5150, 300))
    const hot = enter(t1, 3100, 300)
    nodes.root.box.setAttribute('stroke', hot > 0 ? C.right : C.ink)
    nodes.root.box.setAttribute('stroke-width', String(3 + 3 * hot))

    // The answer goes to the card.
    const a = span(t1, 5600, 600)
    const x0 = X.symptom + 105, y0 = Y + 172, x1 = 870, y1 = 270
    const mxp = lerp(x0, x1, a), myp = lerp(y0, y1, a)
    answerLine.setAttribute('d', `M ${x0} ${y0} L ${mxp} ${myp}`)
    answerLine.setAttribute('opacity', String(a > 0.01 ? 1 : 0))
  }
})
