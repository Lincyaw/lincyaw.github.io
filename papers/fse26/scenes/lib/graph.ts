import { COLOR } from './frame.ts'

// The one picture of the film: a service call graph on the left two-thirds of the stage. Every scene draws the same
// nodes at the same places, so a cut between sections keeps the picture. A fault is a red ring on a node; a node's
// alert loudness is a stack of amber pips at its left; the model's answer is the blue pointer, which always goes to the
// tallest stack ("blame the loudest").

export interface Node { id: string, x: number, y: number, label: string }

export const NODES: Node[] = [
  { id: 'ui', x: 140, y: 360, label: 'ui' },
  { id: 'a', x: 300, y: 190, label: 'order' },
  { id: 'b', x: 300, y: 400, label: 'travel' },
  { id: 'k', x: 300, y: 590, label: 'user' },
  { id: 'c', x: 460, y: 120, label: 'price' },
  { id: 'd', x: 460, y: 280, label: 'route' },
  { id: 'e', x: 460, y: 470, label: 'seat' },
  { id: 'j', x: 460, y: 620, label: 'auth' },
  { id: 'f', x: 630, y: 190, label: 'station' },
  { id: 'g', x: 630, y: 340, label: 'train' },
  { id: 'h', x: 630, y: 520, label: 'config' },
]

/** Caller → callee. */
export const EDGES: [string, string][] = [
  ['ui', 'a'], ['ui', 'b'], ['ui', 'k'], ['a', 'c'], ['a', 'd'], ['b', 'd'], ['b', 'e'],
  ['d', 'f'], ['d', 'g'], ['e', 'g'], ['e', 'h'], ['k', 'j'], ['b', 'j'],
]

export const node = (id: string) => NODES.find(n => n.id === id)!

/** The old benchmarks: the fault sits in `train` and only `train` is loud. */
export const OLD = { cause: 'g', pips: { g: 6 } as Record<string, number> }
/** The new benchmark: the fault in `config` spreads to its callers; `travel`, two hops away, is the loudest. */
export const NEW = { cause: 'h', path: ['h', 'e', 'b', 'ui'], pips: { h: 1, e: 3, b: 6, ui: 2 } as Record<string, number> }

const PIP_W = 24
const PIP_H = 9
const PIP_GAP = 4
export const MAX_PIPS = 6

/** The graph's SVG: edges (each a path of length 1 for drawing), nodes, rings, and empty pip stacks on every node. */
export function graphSvg(): string {
  const edges = EDGES.map(([from, to]) => {
    const p = node(from), q = node(to)
    return `<path class="edge edge-${from}-${to}" d="M ${p.x} ${p.y} L ${q.x} ${q.y}" pathLength="1" />`
  }).join('')
  const nodes = NODES.map(n => {
    const pips = Array.from({ length: MAX_PIPS }, (_, i) =>
      `<rect class="pip pip-${n.id}-${i}" x="${n.x - 34 - PIP_W}" y="${n.y + 24 - PIP_H - i * (PIP_H + PIP_GAP)}" width="${PIP_W}" height="${PIP_H}" />`).join('')
    return `<g class="node node-${n.id}">
      <circle class="ring ring-${n.id}" cx="${n.x}" cy="${n.y}" r="33" />
      <rect class="body" x="${n.x - 24}" y="${n.y - 24}" width="48" height="48" />
      <text class="mono name" x="${n.x}" y="${n.y + 50}" text-anchor="middle">${n.label}</text>
      ${pips}
    </g>`
  }).join('')
  return `<g class="graph">${edges}${nodes}</g>`
}

export const GRAPH_CSS = `
  .edge { fill: none; stroke: var(--pm-color-ink); stroke-width: 2.5; stroke-dasharray: 1 1; }
  .edge.hot { stroke: ${COLOR.cause}; stroke-width: 5; }
  .node .body { fill: var(--pm-color-surface); stroke: var(--pm-color-ink); stroke-width: 2.5; }
  .node .name { font-size: 17px; fill: var(--pm-color-muted); }
  .ring { fill: none; stroke: ${COLOR.cause}; stroke-width: 6; opacity: 0; }
  .pip { fill: ${COLOR.loud}; opacity: 0; }
`

/** The pointer: a blue arrow with a tag; its tip is at (0, 0), so moving the group to a node's corner points at it. */
export function pointerSvg(tag: string, cls = 'pointer'): string {
  return `<g class="${cls}" opacity="0">
    <path d="M 0 0 L 0 46 L 12 35 L 22 58 L 31 54 L 21 31 L 37 31 Z" fill="${COLOR.pointer}" stroke="var(--pm-color-ink)" stroke-width="2.5" stroke-linejoin="miter" />
    <g class="tag"><rect x="40" y="40" width="${tag.length * 11 + 22}" height="32" fill="${COLOR.pointer}" stroke="var(--pm-color-ink)" stroke-width="2.5" />
    <text class="mono tag-text" x="51" y="62" style="fill:#ffffff;font-size:17px">${tag}</text></g>
  </g>`
}

/** Where the pointer's group goes to point at a node: its tip just right of and below the node's centre. */
export const aim = (id: string) => ({ x: node(id).x + 14, y: node(id).y + 10 })

/** Tweens a node's pip stack to `n` pips (staggered from the bottom), starting at `t`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function raisePips(tl: any, scope: Element, id: string, n: number, t: number, each = 0.18) {
  for (let i = 0; i < n; i++) tl.fromTo(scope.querySelector(`.pip-${id}-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, t + i * each)
}

/** Shows a stack at once (the state a scene starts from). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setPips(gsapRef: any, scope: Element, pips: Record<string, number>) {
  for (const [id, n] of Object.entries(pips)) for (let i = 0; i < n; i++) gsapRef.set(scope.querySelector(`.pip-${id}-${i}`), { opacity: 1 })
}

/** Small grey services round the graph (11 drawn + 39 = TrainTicket's 50), placed by a fixed rule. */
export function satellitesSvg(count = 39): string {
  const out: string[] = []
  for (let i = 0; out.length < count && i < 400; i++) {
    const a = i * 2.39996, r = 150 + (i % 9) * 32
    const x = 385 + Math.cos(a) * r * 1.1, y = 370 + Math.sin(a) * r * 0.9
    const clear = NODES.every(n => Math.abs(n.x - x) > 70 || Math.abs(n.y - y) > 75) && x > 30 && x < 760 && y > 120 && y < 690
    if (clear) out.push(`<rect class="sat" x="${(x - 8).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="16" height="16" />`)
  }
  return out.join('')
}

/** The new benchmark's fault travelling from the faulty service to its callers: one red line per call edge. */
export function hotSvg(): string {
  return NEW.path.slice(1).map((caller, i) => {
    const p = node(NEW.path[i]!), q = node(caller)
    return `<path class="hot hot-${i}" d="M ${p.x} ${p.y} L ${q.x} ${q.y}" pathLength="1" />`
  }).join('')
}

export const SPREAD_CSS = `
  .hot { fill: none; stroke: ${COLOR.cause}; stroke-width: 7; stroke-dasharray: 1 1; stroke-dashoffset: 1; }
  .sat { fill: var(--pm-color-surface); stroke: var(--pm-color-muted); stroke-width: 2; opacity: 0; }
`
