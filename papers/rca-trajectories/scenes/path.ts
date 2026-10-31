import { defineScene } from '@lincyaw/addon-motion/scene'
import { C, caption, el, enter, label, MONO, PIXEL, stage, text } from './kit.ts'

// Rounds against the fault's path (the paper's depth plot, Figure 3D). Each dot is one round of tool calls, placed by
// how far its service is from the root cause (d0 the root, d3 the symptom, the grey band services off the path), solid
// when the round acted on what the previous round returned. `correct`: a correct ThinkDepth.ai · Sonnet run, 31 rounds
// (Table 2's mean, 30.5), almost all on the path, ending on the root. `failed`: an incorrect run, 38 rounds (mean 38.2),
// about a third off the path and mostly ignoring its results (Figure 5a's Sonnet shares), ending off the path.
// The runs are illustrative; their lengths and shares follow the paper.
const O = -1
const CORRECT = [3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, O, 1, 1, 1, 1, 1, O, 1, 1, 1, 1, 0]
const FAILED = [3, 3, 2, 2, O, O, O, 2, 2, 3, 3, 2, O, O, 2, 2, 2, 3, O, O, 3, 2, 2, 2, 3, 3, 2, O, O, 2, 2, 2, 3, O, 3, 3, O, O]
// Rounds that acted on the previous result: 16 of the 30 before the last (53%), and 12 of 37 (32%).
const usedCorrect = (i: number) => (i * 7) % 9 < 5
const usedFailed = (i: number) => [1, 3, 8, 10, 15, 16, 21, 23, 25, 29, 30, 34].includes(i)

const X0 = 230, DX = 24
const rx = (i: number) => X0 + i * DX

function panel(svg: SVGSVGElement, top: number, title: string, color: string) {
  const g = el(svg, 'g')
  const lane = (d: number) => (d === O ? top + 26 : top + 76 + (3 - d) * 44)
  el(g, 'rect', { x: X0 - 20, y: top, width: 40 * DX + 40, height: 52, fill: C.band })
  label(g, X0 - 32, top + 26, 'off path', { 'text-anchor': 'end', 'font-size': 14 })
  ;[3, 2, 1, 0].forEach(d => {
    el(g, 'line', { x1: X0 - 20, x2: X0 + 40 * DX + 20, y1: lane(d), y2: lane(d), stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '4 6' })
    label(g, X0 - 32, lane(d), d === 3 ? 'symptom' : d === 0 ? 'root' : `d${d}`, { 'text-anchor': 'end', 'font-size': 14, fill: d === 0 ? C.right : C.muted })
  })
  text(g, 40, top - 22, title.toUpperCase(), { 'font-family': PIXEL, 'font-size': 18, fill: color })
  return { g, lane }
}

function run(svg: SVGSVGElement, depths: number[], used: (i: number) => boolean, lane: (d: number) => number, color: string, last: 'star' | 'cross') {
  const g = el(svg, 'g')
  const trail = el(g, 'polyline', { fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linejoin': 'round', opacity: 0.55 })
  const dots = depths.map((d, i) => {
    if (i === depths.length - 1) return null
    const off = d === O
    return el(g, 'circle', { cx: rx(i), cy: lane(d), r: 7.5, fill: used(i) ? (off ? C.gap : color) : C.paper, stroke: off ? C.gap : color, 'stroke-width': 3 })
  })
  const end = el(g, 'g')
  const lx = rx(depths.length - 1), ly = lane(depths[depths.length - 1]!)
  if (last === 'star') {
    const pts = Array.from({ length: 10 }, (_, k) => {
      const r = k % 2 ? 7 : 16, a = -Math.PI / 2 + (k * Math.PI) / 5
      return `${lx + r * Math.cos(a)},${ly + r * Math.sin(a)}`
    }).join(' ')
    el(end, 'polygon', { points: pts, fill: C.right, stroke: C.ink, 'stroke-width': 2 })
  } else {
    el(end, 'line', { x1: lx - 11, y1: ly - 11, x2: lx + 11, y2: ly + 11, stroke: C.gap, 'stroke-width': 6 })
    el(end, 'line', { x1: lx + 11, y1: ly - 11, x2: lx - 11, y2: ly + 11, stroke: C.gap, 'stroke-width': 6 })
  }
  /** Shows rounds up to `k` (fractional: the next dot is entering). */
  return (k: number) => {
    const n = Math.max(0, Math.min(depths.length, k))
    const pts: string[] = []
    depths.forEach((d, i) => {
      const p = Math.max(0, Math.min(1, n - i))
      if (p > 0) pts.push(`${rx(i)},${lane(d)}`)
      const dot = dots[i]
      if (dot) {
        dot.setAttribute('opacity', String(p))
        dot.setAttribute('r', String(7.5 * (p < 1 ? 0.6 + 0.4 * p : 1)))
      }
    })
    trail.setAttribute('points', pts.join(' '))
    const e = Math.max(0, Math.min(1, (n - (depths.length - 1)) * 2))
    end.setAttribute('opacity', String(e))
    end.setAttribute('transform', `translate(${lx * (1 - (0.6 + 0.4 * e))} ${ly * (1 - (0.6 + 0.4 * e))}) scale(${0.6 + 0.4 * e})`)
  }
}

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const src = text(svg, 1240, 58, 'ThinkDepth.ai · Sonnet · illustrative runs (rounds: Table 2, shares: Fig. 5a)', { 'text-anchor': 'end', 'font-size': 15, fill: C.muted, 'font-family': MONO })
  const legend = el(svg, 'g')
  el(legend, 'circle', { cx: 0, cy: 0, r: 7.5, fill: C.ink, stroke: C.ink, 'stroke-width': 3 })
  text(legend, 16, 1, 'acted on the last result', { 'font-size': 17, fill: C.muted })
  el(legend, 'circle', { cx: 232, cy: 0, r: 7.5, fill: C.paper, stroke: C.ink, 'stroke-width': 3 })
  text(legend, 248, 1, 'ignored it', { 'font-size': 17, fill: C.muted })

  const top = panel(svg, 80, 'Correct run', C.right)
  const bottom = panel(svg, 380, 'Failed run', C.gap)
  const extra = el(svg, 'rect', { x: rx(30) + DX / 2, y: 372, width: 7 * DX, height: 250, fill: C.gap, opacity: 0 })
  const extraTag = label(svg, rx(34), 362, '+7 rounds', { 'text-anchor': 'middle', fill: C.gap, 'font-size': 15 })
  const good = run(svg, CORRECT, usedCorrect, top.lane, C.right, 'star')
  const bad = run(svg, FAILED, usedFailed, bottom.lane, C.ink, 'cross')
  const n1 = label(svg, rx(30), 314, '31 rounds', { 'text-anchor': 'middle', fill: C.right, 'font-size': 15 })
  const n2 = label(svg, rx(37), 640, '38 rounds', { 'text-anchor': 'middle', fill: C.gap, 'font-size': 15 })

  const line = caption(svg, [
    [at(0) + 300, 'Each dot: one round of tool calls, by distance from the root cause.'],
    [at(0) + 4800, 'Correct run: stays on the path, uses what comes back.'],
    [at(1) + 300, 'Failed run: strays off the path, ignores results, runs longer.'],
  ])

  return (ms: number) => {
    const t0 = ms - at(0), t1 = ms - at(1)
    line(ms)
    top.g.setAttribute('opacity', String(enter(t0, 0, 500)))
    src.setAttribute('opacity', String(enter(t0, 200, 500)))
    legend.setAttribute('transform', 'translate(240 30)')
    legend.setAttribute('opacity', String(enter(t0, 2600, 400)))
    good((t0 - 1100) / 165)
    n1.setAttribute('opacity', String(enter(t0, 6400, 400)))

    bottom.g.setAttribute('opacity', String(enter(t1, 0, 400)))
    bad((t1 - 500) / 120)
    const e = enter(t1, 5300, 500)
    extra.setAttribute('opacity', String(0.12 * e))
    extraTag.setAttribute('opacity', String(e))
    n2.setAttribute('opacity', String(enter(t1, 5100, 400)))
  }
})
