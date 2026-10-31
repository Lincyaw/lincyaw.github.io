// The film's frame, shared by every scene of this paper (not a scene itself): a 16:9 stage drawn as one SVG in a
// 1280 × 720 viewBox, so the same picture reads the same in the page column, on a slide and in the presentation.
// The site's look: square corners, hard offset shadows, Silkscreen labels, IBM Plex text, one meaning per colour.

export const W = 1280
export const H = 720

/** Colours with one meaning each, the same in every scene of the film. */
export const C = {
  ink: '#17171c',
  paper: '#ffffff',
  white: '#ffffff',
  muted: '#5a5a66',
  line: '#d9d9d0',
  /** What the agent wrote (scenarios, check) and its right verdicts: the LLM agents thread. */
  agent: '#0f766e',
  agentSoft: '#e3f2f0',
  /** The violating version and wrong verdicts. */
  bad: '#b93a0b',
  badSoft: '#f7e6dd',
}

const ROOT = `position:absolute;inset:0;container-type:size;overflow:hidden;background:${C.paper};color:${C.ink};`
const BASE = `
  * { box-sizing: border-box; }
  svg.stage { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  svg.stage text { font-family: 'IBM Plex Sans', var(--pm-font-sans), system-ui, sans-serif; fill: ${C.ink}; }
  svg.stage .px { font-family: 'Silkscreen', ui-monospace, monospace; letter-spacing: 0.02em; }
  svg.stage .mono { font-family: 'IBM Plex Mono', var(--pm-font-mono), ui-monospace, monospace; }
  svg.stage .muted { fill: ${C.muted}; }
  svg.stage .agent { fill: ${C.agent}; }
  svg.stage .bad { fill: ${C.bad}; }
  .box { fill: ${C.white}; stroke: ${C.ink}; stroke-width: 3; }
  .shadow { fill: ${C.ink}; stroke: none; }
  .cap { font-size: 28px; font-weight: 600; }
  .src { font-size: 15px; }
`

/** Fills `root` with the frame; the scene's CSS sits in `@scope`, so two scenes on one page don't restyle each other. */
export function frame(root: HTMLElement, css: string, svg: string): HTMLElement {
  if (!document.getElementById('sgb-fonts')) {
    const link = Object.assign(document.createElement('link'), {
      id: 'sgb-fonts',
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Silkscreen&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=swap',
    })
    document.head.append(link)
  }
  root.innerHTML = `<div style="${ROOT}"><style>@scope {${BASE}${css}}</style><svg class="stage" viewBox="0 0 ${W} ${H}" aria-hidden="true">${svg}</svg></div>`
  return root.firstElementChild as HTMLElement
}

/** A white box with a hard offset shadow; `stroke` recolours its outline. */
export function box(x: number, y: number, w: number, h: number, stroke: string = C.ink, cls = ''): string {
  return `<g class="${cls}"><rect class="shadow" x="${x + 6}" y="${y + 6}" width="${w}" height="${h}" />` +
    `<rect class="box" x="${x}" y="${y}" width="${w}" height="${h}" style="stroke:${stroke}" /></g>`
}

/** HTML-escapes text for markup. */
export function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Seconds from a step boundary. */
export const sec = (at: (k: number) => number) => (k: number, offset = 0) => at(k) / 1000 + offset

/** The film has music and no voice, so each state carries one short line at the top left; `null` leaves none. */
export function captionsSvg(lines: (string | null)[]): string {
  return lines.map((line, k) => (line ? `<text class="cap cap-${k}" x="48" y="60" opacity="0">${esc(line)}</text>` : '')).join('')
}

/** Each state's line fades in as the state starts and out as the next one starts (the last one stays). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function playCaptions(tl: any, el: Element, lines: (string | null)[], at: (k: number) => number) {
  lines.forEach((line, k) => {
    if (!line) return
    const cap = el.querySelector(`.cap-${k}`)
    tl.fromTo(cap, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at(k) / 1000 + 0.1)
    if (k < lines.length - 1 && lines[k + 1] !== undefined) tl.fromTo(cap, { opacity: 1 }, { opacity: 0, duration: 0.25, immediateRender: false }, at(k + 1) / 1000 - 0.05)
  })
}

/** Ends the timeline exactly at the scene's total, so the last state holds still. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function holdTo(tl: any, total: number) {
  tl.to({}, { duration: 0.01 }, total / 1000 - 0.01)
}
