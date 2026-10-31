import { defineScene } from '@lincyaw/addon-motion/scene'
import { bins, C, caption, el, enter, label, PIXEL, span, stage, text } from './kit.ts'

// The opening picture again, now with its numbers (one state, `result`). The kept traces fall into the thin bin; under
// the dial over all traces ShapleyIQ's top-1 accuracy on the unsampled data counts to 0.41, then under Gleaner's
// 1% sample to 0.56 (Table 6). The title card settles under the bins.
export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const b = bins(svg, [0.41, 0.56])
  b.title.textContent = 'SHAPLEYIQ TOP-1 ACCURACY'
  b.names[1]!.textContent = "GLEANER'S 1%"
  const source = label(svg, 640, 140, 'Table 6 · 1% sampling rate', { 'text-anchor': 'middle', 'font-size': 14 })
  const drops = Array.from({ length: 8 }, (_, i) => el(svg, 'circle', { cx: 812, cy: 0, r: 10, fill: C.keep, opacity: 0 }))
  const card = el(svg, 'g')
  el(card, 'rect', { x: 0, y: 620, width: 1280, height: 100, fill: C.ink })
  text(card, 60, 670, 'Keep less. Diagnose better.', { 'font-size': 34, 'font-weight': 700, fill: C.white })
  text(card, 1220, 655, 'Gleaner · ISSTA 2026', { 'text-anchor': 'end', 'font-size': 26, 'font-weight': 600, fill: C.white })
  text(card, 1220, 690, 'arXiv 2604.16810', { 'text-anchor': 'end', 'font-family': PIXEL, 'font-size': 16, fill: C.line })
  const line = caption(svg, [[at(0) + 2600, 'All traces: right first 41% of the time.'], [at(0) + 5200, "Gleaner's 1%: right first 56%."]])

  return (ms: number) => {
    const t = ms - at(0)
    line(t < 8600 ? ms : -1)
    b.g.setAttribute('opacity', String(enter(t, 0, 500)))
    source.setAttribute('opacity', String(enter(t, 2400)))
    drops.forEach((d, i) => {
      const p = span(t, 500 + i * 180, 600)
      d.setAttribute('cy', String(40 + 520 * p))
      d.setAttribute('opacity', String(p > 0 && p < 1 ? 1 : 0))
    })
    const left = span(t, 2600, 1400), right = span(t, 5200, 1400)
    b.set([0.92, 0.25 + 0.6 * span(t, 500, 1800)], [0.41, 0.56], [left, right])
    const c = enter(t, 8600, 600)
    card.setAttribute('transform', `translate(0 ${(1 - c) * 100})`)
  }
})
