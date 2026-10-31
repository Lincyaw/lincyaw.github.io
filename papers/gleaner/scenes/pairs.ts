import { defineScene } from '@lincyaw/addon-motion/scene'
import { C, caption, el, enter, label, lerp, MONO, shuffled, span, stage, text } from './kit.ts'

// Gleaner's idea and its selection. `set`: the trace becomes its event-pair set, the paper's own example pairs
// (Section 3.2); a healthy trace of the same API (illustrative) has its own set; the pair they share joins them, and
// the overlap is counted as a set operation. `select`: the set shrinks to one dot that joins its API's group; an
// alarm on that API raises its quota up to a cap; the selector keeps the unusual (darker) and spread-out dots of every
// group, the near-duplicates fade, and the trace's dot, darkened by its error log, is kept.
const A = [['start_basic', 'log_e_156', 1], ['log_e_156', 'log_e_203', 1], ['log_e_203', 'log_w_78', 2], ['log_w_78', 'end_basic', 0], ['end_basic', 'start_route', 0]] as const
const B = [['start_basic', 'end_basic'], ['end_basic', 'start_route']] as const

function chip(parent: Element, a: string, b: string, kind: number) {
  const g = el(parent, 'g')
  el(g, 'rect', { x: 4, y: 4, width: 380, height: 46, fill: C.ink })
  el(g, 'rect', { x: 0, y: 0, width: 380, height: 46, fill: C.white, stroke: kind === 1 ? C.error : C.ink, 'stroke-width': 3 })
  text(g, 190, 24, `(${a}, ${b})`, { 'text-anchor': 'middle', 'font-family': MONO, 'font-size': 21, fill: kind === 1 ? C.error : C.ink })
  return g
}

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  // `set`
  const setView = el(svg, 'g')
  // The trace as it arrived from the last section: a card with its error mark, which opens into its pairs.
  const card = el(setView, 'g')
  el(card, 'rect', { x: 4, y: 4, width: 300, height: 184, fill: C.ink })
  el(card, 'rect', { x: 0, y: 0, width: 300, height: 184, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  for (const [i, w] of [[0, 220], [1, 176], [2, 132]] as const) el(card, 'rect', { x: 28 + i * 24, y: 32 + i * 48, width: w, height: 28, fill: C.soft, stroke: C.muted, 'stroke-width': 2 })
  el(card, 'circle', { cx: 300, cy: 0, r: 18, fill: C.error, stroke: C.ink, 'stroke-width': 3 })
  const headA = label(setView, 150, 150, 'This trace (with its error log)', { fill: C.ink })
  const headB = label(setView, 750, 150, 'A healthy trace, same API', { fill: C.muted })
  const chipsA = A.map(([a, b, k]) => chip(setView, a, b, k))
  const chipsB = B.map(([a, b]) => chip(setView, a, b, 0))
  const link = el(setView, 'line', { x1: 534, y1: 543, x2: 750, y2: 543, stroke: C.keep, 'stroke-width': 5 })
  const overlap = text(setView, 940, 600, 'shared: 1 of 6 pairs', { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 600, fill: C.keep })
  const illus = label(setView, 940, 632, 'illustrative', { 'text-anchor': 'middle', 'font-size': 14 })
  // `select`
  const sel = el(svg, 'g')
  const cols = [300, 640, 980]
  const groups = cols.map((cx, gi) => {
    const g = el(sel, 'g')
    label(g, cx, 150, `API ${gi + 1}`, { 'text-anchor': 'middle', fill: C.ink, 'font-size': 20 })
    el(g, 'rect', { x: cx - 120, y: 176, width: 240, height: 14, fill: C.soft })
    const quota = el(g, 'rect', { x: cx - 120, y: 176, width: 0, height: 14, fill: C.ink })
    const order = shuffled(24, 97 + gi)
    const dots = Array.from({ length: 24 }, (_, i) => {
      const x = cx - 105 + (i % 6) * 42, y = 250 + Math.floor(i / 6) * 70
      const score = order[i]! / 23
      const shade = score > 0.85 ? C.ink : score > 0.6 ? C.muted : C.line
      const kept = score > 0.85 || i % 5 === 0
      const d = el(g, 'circle', { cx: x, cy: y, r: 14, fill: shade, stroke: C.white, 'stroke-width': 2 })
      return { d, kept, shade }
    })
    return { g, quota, dots, cx }
  })
  const cap = el(sel, 'line', { x1: 300 + 125, y1: 168, x2: 300 + 125, y2: 198, stroke: C.error, 'stroke-width': 3, 'stroke-dasharray': '5 4' })
  const bell = el(sel, 'g')
  el(bell, 'rect', { x: 180, y: 96, width: 240, height: 34, fill: C.error })
  text(bell, 300, 114, 'ALARM: API 1 ERRORS', { 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: C.white })
  const hero = el(sel, 'g')
  el(hero, 'circle', { cx: 0, cy: 0, r: 18, fill: C.ink, stroke: C.error, 'stroke-width': 6 })
  const keptRing = el(hero, 'circle', { cx: 0, cy: 0, r: 27, fill: 'none', stroke: C.keep, 'stroke-width': 5 })
  const line = caption(svg, [[at(0) + 400, 'Gleaner skips the graph.'], [at(0) + 2000, 'A trace becomes a set of event pairs.'], [at(0) + 6500, 'Compare sets, not graphs.'],
    [at(1) + 600, 'Traces grouped by entry API.'], [at(1) + 2400, 'An alarm raises that API\'s quota.'], [at(1) + 4600, 'Keep traces unusual and unlike each other.'], [at(1) + 7200, 'This trace is kept.']])

  return (ms: number) => {
    const t = ms - at(0), s = ms - at(1)
    line(ms)
    const collapse = span(s, 0, 900)
    setView.setAttribute('opacity', String(1 - collapse))
    headA.setAttribute('opacity', String(enter(t, 1500)))
    const unfold = span(t, 1000, 1200)
    card.setAttribute('transform', `translate(${490 - 150 * unfold} ${240 + 40 * unfold}) scale(${1 - 0.6 * unfold})`)
    card.setAttribute('opacity', String(1 - unfold))
    chipsA.forEach((c, i) => {
      const p = enter(t, 1800 + i * 300, 500)
      c.setAttribute('transform', `translate(${lerp(500, 150, p)} ${lerp(330, 200 + i * 80, p)}) scale(${lerp(0.3, 1, p)})`)
      c.setAttribute('opacity', String(p))
    })
    headB.setAttribute('opacity', String(enter(t, 4000)))
    chipsB.forEach((c, i) => {
      c.setAttribute('transform', `translate(750 ${i === 0 ? 200 : 520})`)
      c.setAttribute('opacity', String(enter(t, 4200 + i * 300)))
    })
    link.setAttribute('opacity', String(enter(t, 5800, 300)))
    overlap.setAttribute('opacity', String(enter(t, 6300)))
    illus.setAttribute('opacity', String(enter(t, 6300)))

    sel.setAttribute('opacity', String(enter(s, 700, 400)))
    const alarm = enter(s, 2400, 300), keep = span(s, 4600, 1500)
    groups.forEach((g, gi) => {
      g.quota.setAttribute('width', String(80 * (1 + (gi === 0 ? 2 * span(s, 2600, 900) : 0)) - (gi > 0 ? 40 * span(s, 2600, 900) : 0)))
      g.dots.forEach(d => d.d.setAttribute('opacity', String(d.kept ? 1 : 1 - 0.85 * keep)))
      g.dots.forEach(d => d.d.setAttribute('fill', d.kept && keep > 0.5 ? C.keep : d.shade))
    })
    cap.setAttribute('opacity', String(alarm))
    bell.setAttribute('opacity', String(alarm))
    // The trace's own dot: from where its set stood into API 1's group.
    const p = span(s, 200, 1000)
    hero.setAttribute('transform', `translate(${lerp(340, 321, p)} ${lerp(360, 460, p)})`)
    keptRing.setAttribute('opacity', String(enter(s, 7000, 300)))
  }
})
