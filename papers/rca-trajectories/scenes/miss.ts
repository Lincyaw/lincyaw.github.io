import { defineScene } from '@lincyaw/addon-motion/scene'
import { arrow, C, caption, el, enter, label, lerp, MONO, node, PIXEL, span, stage, text } from './kit.ts'

// The held-out incident of Figure 6b (Doubao, AIOps 2025). `incident`: a disk-I/O fault on the TiKV storage node
// tidb-tikv-0 shows to users only as a slow product page; the baseline agent's footprints stay in the service tier and
// stop on Ad, a chronically noisy service; the six failure codes Section 6 assigns to this run pin where they apply.
// `families`: the six tags drop into the three families of Table 3.
const N = {
  tikv: { x: 165, y: 175 }, tidb: { x: 440, y: 175 },
  catalog: { x: 760, y: 175 }, frontend: { x: 1090, y: 175 }, ad: { x: 760, y: 330 },
}
// Tag: code, short meaning, family (0 OMIT, 1 MIS, 2 GEN), where it pins on the map.
const TAGS: [string, string, number, number, number][] = [
  ['MIS2', 'loudest signal trusted', 1, 760, 405],
  ['OMIT1', 'no healthy baseline', 0, 990, 405],
  ['OMIT3', 'storage never probed', 0, 165, 260],
  ['OMIT5', 'no drill-down', 0, 440, 260],
  ['OMIT6', 'no timing check', 0, 300, 330],
  ['GEN3', 'empty query, dropped', 2, 575, 100],
]
const BIN_X = [250, 640, 1030]
const BIN_HEAD = ['Never gathered', 'Gathered, misread', 'Reasoning off the evidence']
const ORDER = [1, 2, 3, 4, 0, 5] // the order the tags fall: the four OMIT, then MIS2, then GEN3

export default defineScene(({ root, at }) => {
  const svg = stage(root)
  const tier = (x: number, w: number, h: number, name: string) => {
    const g = el(svg, 'g')
    el(g, 'rect', { x, y: 70, width: w, height: h, fill: 'none', stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '3 6' })
    label(g, x + 14, 52, name, { 'font-size': 16 })
    return g
  }
  const infra = tier(40, 530, 300, 'Infrastructure tier')
  const service = tier(600, 640, 300, 'Service tier')
  const searched = el(svg, 'rect', { x: 600, y: 70, width: 640, height: 300, fill: C.gap })
  const edges = [arrow(svg, C.muted, 3), arrow(svg, C.muted, 3), arrow(svg, C.muted, 3), arrow(svg, C.muted, 3)]
  const nodes = {
    tikv: node(svg, 'tidb-tikv-0', 230, 56, 22), tidb: node(svg, 'TiDB', 170, 56, 22),
    catalog: node(svg, 'product-catalog', 250, 56, 22), frontend: node(svg, 'frontend', 200, 56, 22), ad: node(svg, 'Ad', 170, 56, 22),
  }
  const fault = label(svg, N.tikv.x, N.tikv.y - 52, 'fault injected', { 'text-anchor': 'middle', 'font-size': 14, fill: C.right })
  const pageRead = text(svg, N.frontend.x, N.frontend.y - 62, 'product page p99 0.25 s → 10 s', { 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 600, fill: C.gap })
  const adRead = text(svg, N.ad.x + 230, N.ad.y - 8, 'errors 0.25% → 0.69%', { 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 600 })
  const adNoise = label(svg, N.ad.x + 230, N.ad.y + 18, 'chronic noise', { 'text-anchor': 'middle', 'font-size': 14 })
  const source = text(svg, 1240, 640, 'Fig. 6b · AIOps 2025 · codes: Section 6', { 'text-anchor': 'end', 'font-size': 15, fill: C.muted, 'font-family': MONO })

  // The baseline's footprints: frontend, catalog, then circling Ad.
  const STEPS: [number, number][] = [[1060, 140], [1120, 145], [1090, 210], [730, 140], [800, 210], [715, 300], [805, 360], [740, 368], [690, 335], [820, 300]]
  const trail = el(svg, 'polyline', { fill: 'none', stroke: C.gap, 'stroke-width': 2.5, 'stroke-dasharray': '5 6', opacity: 0.8 })
  const prints = STEPS.map(() => el(svg, 'circle', { r: 8, fill: C.gap, stroke: C.ink, 'stroke-width': 2 }))
  const answer = el(svg, 'g')
  el(answer, 'rect', { x: 4, y: 4, width: 190, height: 44, fill: C.ink })
  el(answer, 'rect', { x: 0, y: 0, width: 190, height: 44, fill: C.white, stroke: C.gap, 'stroke-width': 3 })
  text(answer, 14, 23, 'ANSWER: AD ✗', { 'font-family': PIXEL, 'font-size': 17, fill: C.gap })

  const bins = BIN_X.map((x, i) => {
    const g = el(svg, 'g')
    el(g, 'rect', { x: x - 185, y: 455, width: 370, height: 168, fill: C.white, stroke: C.gap, 'stroke-width': 3 })
    el(g, 'rect', { x: x - 185, y: 455, width: 370, height: 34, fill: C.gap })
    text(g, x, 473, BIN_HEAD[i]!.toUpperCase(), { 'text-anchor': 'middle', 'font-family': PIXEL, 'font-size': 16, fill: C.white })
    return g
  })
  const tags = TAGS.map(([code, meaning]) => {
    const g = el(svg, 'g')
    el(g, 'rect', { x: -88, y: -18, width: 176, height: 36, fill: C.white, stroke: C.gap, 'stroke-width': 2.5 })
    text(g, -78, -4, code, { 'font-family': PIXEL, 'font-size': 14, fill: C.gap })
    text(g, -78, 10, meaning, { 'font-size': 13, fill: C.ink })
    return g
  })
  // Where each tag sits in its bin: two columns, rows of 42.
  const slot = (k: number) => {
    const fam = TAGS[k]![2]
    const rank = ORDER.filter(j => TAGS[j]![2] === fam).indexOf(k)
    const cols = fam === 0 ? 2 : 1
    return { x: BIN_X[fam]! + (cols === 2 ? (rank % 2 ? 92 : -92) : 0), y: 520 + Math.floor(rank / cols) * 46 }
  }

  const line = caption(svg, [
    [at(0) + 300, 'Disk fault on tidb-tikv-0; users see a slow product page.'],
    [at(0) + 4100, 'The agent blames Ad, a service that is always noisy.'],
    [at(1) + 300, 'Six coded failures, three families.'],
  ])

  return (ms: number) => {
    const t0 = ms - at(0), t1 = ms - at(1)
    line(ms)
    const m = enter(t0, 0, 500)
    infra.setAttribute('opacity', String(m))
    service.setAttribute('opacity', String(m))
    source.setAttribute('opacity', String(m))
    const order = ['tikv', 'tidb', 'catalog', 'frontend', 'ad'] as const
    order.forEach((k, i) => nodes[k].set(N[k].x, N[k].y, enter(t0, 100 + i * 90)))
    edges[0]!.set(N.tikv.x + 120, N.tikv.y, N.tidb.x - 90, N.tidb.y, span(t0, 500, 350))
    edges[1]!.set(N.tidb.x + 90, N.tidb.y, N.catalog.x - 130, N.catalog.y, span(t0, 600, 350))
    edges[2]!.set(N.catalog.x + 130, N.catalog.y, N.frontend.x - 105, N.frontend.y, span(t0, 700, 350))
    edges[3]!.set(N.ad.x + 90, N.ad.y - 10, N.frontend.x - 40, N.frontend.y + 32, span(t0, 800, 350))
    fault.setAttribute('opacity', String(enter(t0, 1100)))
    nodes.tikv.box.setAttribute('stroke', t0 > 1100 ? C.right : C.ink)
    const sym = enter(t0, 1300, 400)
    pageRead.setAttribute('opacity', String(sym))
    nodes.frontend.box.setAttribute('stroke', sym > 0 ? C.gap : C.ink)
    nodes.frontend.box.setAttribute('stroke-width', String(3 + 3 * sym))

    // Footprints, one every 230 ms; the Ad readout as they reach Ad; the answer.
    STEPS.forEach(([x, y], i) => {
      const p = enter(t0, 2100 + i * 230, 250)
      prints[i]!.setAttribute('cx', String(x)); prints[i]!.setAttribute('cy', String(y))
      prints[i]!.setAttribute('opacity', String(p))
    })
    const shown = STEPS.filter((_, i) => t0 >= 2100 + i * 230)
    trail.setAttribute('points', shown.map(([x, y]) => `${x},${y}`).join(' '))
    searched.setAttribute('opacity', String(0.07 * enter(t0, 2100, 1200)))
    const adp = enter(t0, 3300, 400)
    adRead.setAttribute('opacity', String(adp)); adNoise.setAttribute('opacity', String(adp))
    const ans = enter(t0, 4300, 350)
    answer.setAttribute('transform', `translate(${N.ad.x - 300} ${N.ad.y - 22 - (1 - ans) * 12})`)
    answer.setAttribute('opacity', String(ans))

    // Tags pin on the map one at a time, then fall into their bins.
    bins.forEach((g, i) => g.setAttribute('opacity', String(enter(t1, 0 + i * 150, 400))))
    tags.forEach((g, k) => {
      const [, , , px, py] = TAGS[k]!
      const pin = enter(t0, 5400 + k * 330, 300)
      const fall = span(t1, 700 + ORDER.indexOf(k) * 420, 650)
      const s = slot(k)
      g.setAttribute('transform', `translate(${lerp(px, s.x, fall)} ${lerp(py, s.y, fall) - (1 - pin) * 12})`)
      g.setAttribute('opacity', String(pin))
    })
  }
})
