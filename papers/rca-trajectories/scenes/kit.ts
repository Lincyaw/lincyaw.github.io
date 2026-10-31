// Shared by this paper's scenes: a 1280×720 SVG stage that scales with its box, the site's palette and fonts, and
// small helpers whose results are functions of the time only, so any step can be shown directly.

export const W = 1280
export const H = 720
export const C = {
  ink: '#17171c', paper: '#ffffff', white: '#ffffff', muted: '#5a5a66', line: '#d9d9d0',
  right: '#0f766e', gap: '#b93a0b', guard: '#2546b8', soft: '#f3f3f5', band: '#e6e6ea',
}
export const PIXEL = "'Silkscreen', ui-monospace, monospace"
export const SANS = "'IBM Plex Sans', system-ui, sans-serif"
export const MONO = "'IBM Plex Mono', ui-monospace, monospace"

const NS = 'http://www.w3.org/2000/svg'
type Attrs = Record<string, string | number>

const FONTS = 'https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'

/** The site's theme loads these fonts; a page without it (a standalone build) gets them here. */
function fonts() {
  if (document.querySelector(`link[href="${FONTS}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FONTS
  document.head.appendChild(link)
}

export function stage(root: HTMLElement): SVGSVGElement {
  fonts()
  root.innerHTML = ''
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svg.setAttribute('role', 'img')
  svg.style.cssText = `width:100%;height:auto;display:block;background:${C.paper}`
  root.appendChild(svg)
  return svg
}

export function el<K extends keyof SVGElementTagNameMap>(parent: Element, tag: K, attrs: Attrs = {}): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v))
  parent.appendChild(node)
  return node
}

export function text(parent: Element, x: number, y: number, value: string, attrs: Attrs = {}): SVGTextElement {
  const node = el(parent, 'text', { x, y, 'font-family': SANS, 'font-size': 26, fill: C.ink, 'dominant-baseline': 'middle', ...attrs })
  node.textContent = value
  return node
}

export const label = (parent: Element, x: number, y: number, value: string, attrs: Attrs = {}) =>
  text(parent, x, y, value.toUpperCase(), { 'font-family': PIXEL, 'font-size': 18, fill: C.muted, ...attrs })

export const clamp = (v: number) => Math.max(0, Math.min(1, v))
/** Progress of a move from `start` lasting `dur` (ms), eased in and out. */
export const span = (t: number, start: number, dur: number) => {
  const p = clamp((t - start) / dur)
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2
}
/** Progress of an entrance: decelerating. */
export const enter = (t: number, start: number, dur = 400) => 1 - (1 - clamp((t - start) / dur)) ** 3
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p

/** A service box with a hard offset shadow; `set` places and styles it. */
export function node(parent: Element, name: string, w = 180, h = 64, size = 28) {
  const g = el(parent, 'g')
  const shadow = el(g, 'rect', { x: 6, y: 6, width: w, height: h, fill: C.ink })
  const box = el(g, 'rect', { x: 0, y: 0, width: w, height: h, fill: C.white, stroke: C.ink, 'stroke-width': 3 })
  const t = text(g, w / 2, h / 2 + 1, name, { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 600 })
  return {
    g, box, shadow, t, w, h,
    set(x: number, y: number, o = 1, s = 1) {
      g.setAttribute('transform', `translate(${x - (w * s) / 2} ${y - (h * s) / 2}) scale(${s})`)
      g.setAttribute('opacity', String(o))
    },
  }
}

/** A straight arrow from (x1, y1) to (x2, y2), drawn to `p` of its length. */
export function arrow(parent: Element, color = C.ink, width = 4, dashed = false) {
  const g = el(parent, 'g')
  const line = el(g, 'line', { stroke: color, 'stroke-width': width, 'stroke-linecap': 'square', ...(dashed ? { 'stroke-dasharray': '10 9' } : {}) })
  const head = el(g, 'path', { fill: color })
  return {
    g, line, head,
    set(x1: number, y1: number, x2: number, y2: number, p: number, o = 1) {
      const x = lerp(x1, x2, p), y = lerp(y1, y2, p)
      line.setAttribute('x1', String(x1)); line.setAttribute('y1', String(y1))
      line.setAttribute('x2', String(x)); line.setAttribute('y2', String(y))
      const a = Math.atan2(y2 - y1, x2 - x1), s = 16
      head.setAttribute('d', `M ${x} ${y} L ${x - s * Math.cos(a - 0.45)} ${y - s * Math.sin(a - 0.45)} L ${x - s * Math.cos(a + 0.45)} ${y - s * Math.sin(a + 0.45)} Z`)
      g.setAttribute('opacity', String(p > 0.02 ? o : 0))
    },
  }
}

/**
 * The film's one short line at the foot of the frame (there is no voice): `lines` are [from ms, text] on the
 * section's timeline; the latest started line shows, each rising in as it starts.
 */
export function caption(parent: Element, lines: [number, string][]) {
  const t = text(parent, W / 2, 684, '', { 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 600 })
  return (ms: number) => {
    let current: [number, string] | undefined
    for (const line of lines) if (ms >= line[0]) current = line
    if (!current) { t.setAttribute('opacity', '0'); return }
    const p = enter(ms, current[0], 350)
    if (t.textContent !== current[1]) t.textContent = current[1]
    t.setAttribute('opacity', String(p))
    t.setAttribute('transform', `translate(0 ${(1 - p) * 12})`)
  }
}

/** A deterministic shuffle of 0..n-1, so the same cells are chosen on every render. */
export function shuffled(n: number, seed: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  let s = seed
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) % 2147483648
    const j = s % (i + 1)
    ;[order[i], order[j]] = [order[j]!, order[i]!]
  }
  return order
}

/** A small two-line card: a pixel-font head and a plain line under it; dashed when it marks something missing. */
export function chip(parent: Element, head: string, body: string, opts: { w?: number; color?: string; dashed?: boolean } = {}) {
  const w = opts.w ?? 210, h = 58, color = opts.color ?? C.ink
  const g = el(parent, 'g')
  if (!opts.dashed) el(g, 'rect', { x: 4, y: 4, width: w, height: h, fill: C.ink })
  el(g, 'rect', { x: 0, y: 0, width: w, height: h, fill: C.white, stroke: color, 'stroke-width': 2.5, ...(opts.dashed ? { 'stroke-dasharray': '7 6' } : {}) })
  text(g, 12, 18, head.toUpperCase(), { 'font-family': PIXEL, 'font-size': 15, fill: color })
  text(g, 12, 40, body, { 'font-size': 18, fill: opts.dashed ? color : C.ink })
  return {
    g, w, h,
    /** Places the chip's centre at (x, y); `p` is its entrance (a short drop and fade). */
    set(x: number, y: number, p: number) {
      g.setAttribute('transform', `translate(${x - w / 2} ${y - h / 2 - (1 - p) * 14})`)
      g.setAttribute('opacity', String(p))
    },
  }
}
