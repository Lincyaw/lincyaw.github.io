import { COLOR } from './frame.ts'

// The one picture of the film: the paper's OOM incident (Fig. 4) as a graph of three event cards, left to right as
// the incident runs: a code change that leaks memory (root cause), a traffic surge that sets it off (trigger), the
// service running out of memory (symptom). The edges between them are the propagation path. The 135 surveyed papers
// are ink dots; every scene draws the cards and the dots at the same places, so a cut between sections keeps the picture.

export const CARD_W = 250
export const CARD_H = 150
export const CARDS = {
  cause: { x: 110, y: 300, label: 'ROOT CAUSE', color: COLOR.cause },
  trigger: { x: 515, y: 300, label: 'TRIGGER', color: COLOR.trigger },
  symptom: { x: 920, y: 300, label: 'SYMPTOM', color: COLOR.symptom },
}
export type CardId = keyof typeof CARDS
export const centre = (id: CardId) => ({ x: CARDS[id].x + CARD_W / 2, y: CARDS[id].y + CARD_H / 2 })

export const PAPERS = 135
/** A paper dot's place in the grid above the incident. */
export const gridAt = (i: number) => ({ x: 312 + (i % 27) * 25, y: 92 + Math.floor(i / 27) * 25 })

export function cardsSvg(): string {
  const card = (id: CardId, inner: string) => {
    const c = CARDS[id]
    return `<g class="card card-${id}">
      <rect class="shadow" x="${c.x + 7}" y="${c.y + 7}" width="${CARD_W}" height="${CARD_H}" />
      <rect class="face" x="${c.x}" y="${c.y}" width="${CARD_W}" height="${CARD_H}" style="stroke:${c.color}" />
      <rect x="${c.x}" y="${c.y}" width="${CARD_W}" height="30" style="fill:${c.color}" />
      <text class="mono head" x="${c.x + 12}" y="${c.y + 21}">${c.label}</text>
      ${inner}
    </g>`
  }
  const cx = CARDS.cause.x, tx = CARDS.trigger.x, sx = CARDS.symptom.x, y = CARDS.cause.y
  // Small drawings after Fig. 4: the leaking line of code, the request surge, memory climbing to 100%.
  const code = `<text class="mono code" x="${cx + 14}" y="${y + 66}">data_store.append(</text>
    <text class="mono code" x="${cx + 34}" y="${y + 90}">request.form)</text>
    <text class="mono code muted" x="${cx + 14}" y="${y + 120}"># memory leak</text>`
  const surge = `<polyline class="spark spark-trigger" points="${[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64].map((t, i) => `${tx + 20 + t * 3.4},${y + 128 - (i < 12 ? 6 + (i % 2) * 3 : 88 + (i % 2) * 6)}`).join(' ')}" pathLength="1" />
    <text class="mono small" x="${tx + 20}" y="${y + 146}">requests</text>`
  const memory = `<polyline class="spark spark-symptom" points="${[0, 10, 20, 30, 40, 50, 60, 64].map((t, i) => `${sx + 20 + t * 3.4},${y + 128 - [4, 8, 12, 16, 20, 30, 86, 100][i]!}`).join(' ')}" pathLength="1" />
    <text class="mono small" x="${sx + 20}" y="${y + 146}">memory → 100%</text>`
  return card('cause', code) + card('trigger', surge) + card('symptom', memory)
}

/** The propagation path: one dashed edge per hop, drawn as a path of length 1. */
export function edgesSvg(): string {
  const hop = (from: CardId, to: CardId, i: number) => {
    const a = CARDS[from], b = CARDS[to]
    return `<path class="edge edge-${i}" d="M ${a.x + CARD_W + 4} ${a.y + CARD_H / 2} L ${b.x - 14} ${b.y + CARD_H / 2}" pathLength="1" />
      <path class="arrow arrow-${i}" d="M ${b.x - 26} ${b.y + CARD_H / 2 - 10} L ${b.x - 6} ${b.y + CARD_H / 2} L ${b.x - 26} ${b.y + CARD_H / 2 + 10} Z" />`
  }
  return hop('cause', 'trigger', 0) + hop('trigger', 'symptom', 1)
}

export function dotsSvg(): string {
  return Array.from({ length: PAPERS }, (_, i) => {
    const p = gridAt(i)
    return `<rect class="paper paper-${i}" x="-7" y="-7" width="14" height="14" transform="translate(${p.x} ${p.y})" />`
  }).join('')
}

export const INCIDENT_CSS = `
  .card .face { fill: var(--pm-color-surface); stroke-width: 3; }
  .card .shadow { fill: var(--pm-color-ink); }
  .card .head { font-size: 16px; fill: #ffffff; }
  .card .code { font-size: 17px; }
  .card .small { font-size: 14px; fill: var(--pm-color-muted); }
  .spark { fill: none; stroke: var(--pm-color-ink); stroke-width: 3; stroke-dasharray: 1 1; stroke-dashoffset: 0; }
  .edge { fill: none; stroke: var(--pm-color-muted); stroke-width: 4; stroke-dasharray: 0.04 0.03; }
  .arrow { fill: var(--pm-color-muted); }
  .paper { fill: ${COLOR.paper}; }
  .paper.lifted { fill: ${COLOR.lens}; }
`

/** The three bins of the usual sorting, by input data; paper i goes to bin i % 3. */
export const BINS = ['metrics', 'logs', 'traces']
export const binAt = (i: number) => {
  const b = i % 3, k = Math.floor(i / 3)
  return { x: 140 + b * 380 + 30 + (k % 15) * 18, y: 600 + Math.floor(k / 15) * 18 }
}
export function binsSvg(): string {
  return BINS.map((name, b) => `<g class="bin bin-${b}">
    <path d="M ${140 + b * 380} 560 L ${140 + b * 380} 660 L ${440 + b * 380} 660 L ${440 + b * 380} 560" />
    <text class="mono" x="${290 + b * 380}" y="690" text-anchor="middle">${name}</text></g>`).join('')
}
export const BINS_CSS = `
  .bin path { fill: none; stroke: var(--pm-color-ink); stroke-width: 3; }
  .bin text { font-size: 18px; }
`

/** The seven goals of the survey's taxonomy (Sec. 3.2), as a ring of chips round the middle of the stage. */
export const GOALS = ['data correlation', 'robustness', 'adaptive learning', 'real-time', 'interpretability', 'multi-granularity', 'actionability']
export const RING = { x: 640, y: 380 }
export const goalAt = (g: number) => {
  const a = -Math.PI / 2 + (g * 2 * Math.PI) / GOALS.length
  return { x: RING.x + Math.cos(a) * 470, y: RING.y + Math.sin(a) * 270 }
}
/** Paper i in a small cluster under goal i % 7 (illustrative: the film shows the sorting, not the counts). */
export const clusterAt = (i: number) => {
  const g = goalAt(i % GOALS.length), k = Math.floor(i / GOALS.length)
  return { x: g.x - 45 + (k % 6) * 18, y: g.y + 30 + Math.floor(k / 6) * 16 }
}
export function goalsSvg(hidden = true): string {
  return GOALS.map((name, g) => {
    const p = goalAt(g), w = name.length * 11 + 28
    return `<g class="goal goal-${g}"${hidden ? ' opacity="0"' : ''}><rect x="${p.x - w / 2}" y="${p.y - 20}" width="${w}" height="38" /><text class="mono" x="${p.x}" y="${p.y + 6}" text-anchor="middle">${name}</text></g>`
  }).join('')
}
export const GOALS_CSS = `
  .goal rect { fill: var(--pm-color-surface); stroke: ${COLOR.lens}; stroke-width: 3; }
  .goal text { font-size: 18px; fill: ${COLOR.lens}; font-weight: 500; }
`
/** The Effectiveness–Data–Cost triangle (Sec. 3.1). */
export const TRI = { e: { x: 640, y: 255 }, d: { x: 480, y: 520 }, c: { x: 800, y: 520 } }
export function triangleSvg(hidden = true): string {
  return `<g class="tri"${hidden ? ' opacity="0"' : ''}>
      <path d="M ${TRI.e.x} ${TRI.e.y} L ${TRI.c.x} ${TRI.c.y} L ${TRI.d.x} ${TRI.d.y} Z" />
      <text x="${TRI.e.x}" y="${TRI.e.y - 16}" text-anchor="middle">effectiveness</text>
      <text x="${TRI.d.x - 10}" y="${TRI.d.y + 34}" text-anchor="middle">data</text>
      <text x="${TRI.c.x + 10}" y="${TRI.c.y + 34}" text-anchor="middle">cost</text>
      <rect class="slider" x="-9" y="-9" width="18" height="18" />
    </g>`
}
export const TRI_CSS = `
  .tri path { fill: none; stroke: var(--pm-color-ink); stroke-width: 3; }
  .tri text { font-size: 22px; font-weight: 600; }
  .slider { fill: ${COLOR.lens}; }
`
