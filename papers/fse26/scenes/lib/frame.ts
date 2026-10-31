// The film's frame, shared by every scene of this paper: a 16:9 stage whose drawing is one SVG in a 1280 × 720
// viewBox, so the same picture reads the same in the page column, on a slide and in the presentation. HTML laid over
// it (the paper's figures as <img>, which the viewer waits for) is placed in the same coordinates through `box`.
// The site's look: square corners, hard offset shadows, IBM Plex, one meaning per colour.

export const W = 1280
export const H = 720

/** Colours with one meaning each, the same in every scene of the film. */
export const COLOR = {
  cause: '#b93a0b', // the injected fault, the true root cause (the Evaluate thread colour)
  loud: '#c98a0b', // alert loudness: the pips over a service
  pointer: 'var(--pm-color-accent)', // the model's answer
  ink: 'var(--pm-color-ink)',
  muted: 'var(--pm-color-muted)',
  line: 'var(--pm-color-line)',
  surface: 'var(--pm-color-surface)',
  bg: 'var(--pm-color-bg)',
}

const ROOT = `position: absolute; inset: 0; container-type: size; overflow: hidden; font-family: 'IBM Plex Sans', var(--pm-font-sans); color: var(--pm-color-ink); background: var(--pm-color-bg);`
const BASE = `
  * { box-sizing: border-box; }
  svg.stage { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  svg.stage text { font-family: 'IBM Plex Sans', var(--pm-font-sans); fill: var(--pm-color-ink); }
  svg.stage .mono { font-family: 'IBM Plex Mono', var(--pm-font-mono); letter-spacing: 0.04em; }
  svg.stage .muted { fill: var(--pm-color-muted); }
  .overlay { position: absolute; }
  .card { background: #ffffff; border: 0.16cqw solid var(--pm-color-ink); box-shadow: 0.4cqw 0.4cqw 0 0 var(--pm-color-ink); }
  .card img { display: block; width: 100%; height: 100%; object-fit: contain; }
`

/** Fills `root` with the frame; the scene's CSS sits in `@scope`, so two scenes on one page don't restyle each other. */
export function frame(root: HTMLElement, css: string, svg: string, html = ''): HTMLElement {
  root.innerHTML = `<div style="${ROOT}"><style>@scope {${BASE}${css}}</style><svg class="stage" viewBox="0 0 ${W} ${H}" aria-hidden="true">${svg}</svg>${html}</div>`
  return root.firstElementChild as HTMLElement
}

/** CSS that places an overlay at viewBox coordinates. */
export function box(x: number, y: number, w: number, h: number): string {
  return `left:${(x / W) * 100}%;top:${(y / H) * 100}%;width:${(w / W) * 100}%;height:${(h / H) * 100}%;`
}

/** One element by selector; a missing one is a mistake in the scene. */
export function pick<E extends Element = Element>(root: ParentNode, selector: string): E {
  const found = root.querySelector<E>(selector)
  if (!found) throw new Error(`no ${selector} in the scene`)
  return found
}

/** Seconds from a step boundary. */
export const sec = (at: (k: number) => number) => (k: number, offset = 0) => at(k) / 1000 + offset

/**
 * The film has music and no voice, so each state carries one short line at the top left: what the viewer should
 * take from this state. `null` leaves a state without a line.
 */
export function captionsSvg(lines: (string | null)[]): string {
  return lines.map((line, k) => (line ? `<text class="cap cap-${k}" x="40" y="58" opacity="0" style="font-size:30px;font-weight:600">${line}</text>` : '')).join('')
}

/** Each state's line fades in as the state starts and out as the next one starts (the last one stays). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function playCaptions(tl: any, el: Element, lines: (string | null)[], at: (k: number) => number) {
  lines.forEach((line, k) => {
    if (!line) return
    const cap = el.querySelector(`.cap-${k}`)
    tl.fromTo(cap, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at(k) / 1000 + 0.15)
    if (k < lines.length - 1) tl.fromTo(cap, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, at(k + 1) / 1000)
  })
}
