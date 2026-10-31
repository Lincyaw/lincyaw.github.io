// The film's one picture: the Online Boutique services of the paper's fault case (Figure 2) on a call graph. Upstream
// is left, downstream right. A node's red halo is how abnormal it looks (illustrative sizes that follow Figure 2a:
// payment and ad shift most, checkout only slows down); an edge is a call between services.
import { C } from './frame.ts'

export interface Node { id: string, label: string, x: number, y: number, loud: number }

export const NODES: Node[] = [
  { id: 'frontend', label: 'frontend', x: 9, y: 50, loud: 0.1 },
  { id: 'ad', label: 'adservice', x: 29, y: 24, loud: 0.95 },
  { id: 'checkout', label: 'checkout', x: 29, y: 62, loud: 0.12 },
  { id: 'payment', label: 'payment', x: 52, y: 30, loud: 1 },
  { id: 'email', label: 'email', x: 52, y: 56, loud: 0.3 },
  { id: 'currency', label: 'currency', x: 52, y: 82, loud: 0.45 },
]

export const EDGES: [string, string][] = [
  ['frontend', 'ad'], ['frontend', 'checkout'], ['checkout', 'payment'], ['checkout', 'email'], ['checkout', 'currency'],
]

const node = (id: string) => NODES.find(n => n.id === id)!
/** Frame percent to the SVG's 160 × 90 user space. */
export const sx = (x: number) => x * 1.6
export const sy = (y: number) => y * 0.9

export const GRAPH_CSS = `
  .g-edges { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .g-halo { width: 12cqw; height: 5.4cqw; background: ${C.alarm}; }
  .g-node { width: 12cqw; height: 5.4cqw; display: grid; place-items: center; font-size: 1.45cqw; }
  .g-node.is-source { background: ${C.accent}; color: var(--pm-color-on-accent); }
  .g-ring { width: 15cqw; height: 8.4cqw; border: 0.45cqw solid ${C.accent}; }
`

/** The markup of the graph: edges under halos under nodes. */
export function graphHtml(): string {
  const edges = EDGES.map(([a, b]) => {
    const p = node(a), q = node(b)
    return `<path class="g-edge" data-edge="${a}-${b}" d="M ${sx(p.x)} ${sy(p.y)} L ${sx(q.x)} ${sy(q.y)}" stroke="${C.ink}" stroke-width="0.35" fill="none" />`
  }).join('')
  const halos = NODES.map(n => `<div class="pos g-halo" data-halo="${n.id}" style="left:${n.x}%; top:${n.y}%"></div>`).join('')
  const nodes = NODES.map(n => `<div class="pos card px g-node" data-node="${n.id}" style="left:${n.x}%; top:${n.y}%">${n.label}</div>`).join('')
  return `<svg class="g-edges" viewBox="0 0 160 90" preserveAspectRatio="none">${edges}</svg>${halos}${nodes}`
}

/** The halo of a node at full alarm: bigger and stronger the more abnormal it looks. */
export const haloOn = (n: Node) => ({ scale: 1 + 0.65 * n.loud, opacity: 0.12 + 0.45 * n.loud })
export const haloOff = { scale: 1, opacity: 0 }
export { node }
