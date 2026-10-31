// Shared by this paper's scenes (not a scene itself): a 16:9 frame in container units, the site's palette and the
// pixel look (square corners, hard offset shadows), so every chapter of the film shares one visual language.

const PALETTE = `
  --ink: #17171c; --paper: #f6f6f1; --white: #ffffff; --muted: #5a5a66; --line: #d9d9d0;
  --acc: #5b4b99; --acc-soft: color-mix(in oklab, #5b4b99 14%, #ffffff);
  --warn: #b93a0b; --warn-soft: color-mix(in oklab, #b93a0b 12%, #ffffff);
`

const ROOT = `.pp { position: absolute; inset: 0; container-type: size; overflow: hidden; background: #f6f6f1;
  font-family: 'IBM Plex Sans', var(--pm-font-sans), system-ui, sans-serif; color: #17171c; line-height: 1.25; ${PALETTE} }`

const BASE = `
  * { box-sizing: border-box; }
  .px { font-family: 'Silkscreen', ui-monospace, monospace; letter-spacing: 0.02em; }
  .mono { font-family: 'IBM Plex Mono', var(--pm-font-mono), ui-monospace, monospace; }
  .card { position: absolute; background: var(--white); border: 0.22cqw solid var(--ink); box-shadow: 0.55cqw 0.55cqw 0 var(--ink); }
  .label { position: absolute; font-family: 'Silkscreen', ui-monospace, monospace; font-size: 1.7cqw; color: var(--muted); white-space: nowrap; }
  .caption { position: absolute; left: 0; right: 0; bottom: 4.5cqh; z-index: 2; text-align: center; font-family: 'Silkscreen', ui-monospace, monospace; font-size: 2.6cqw; color: var(--ink); white-space: nowrap; }
  .src { position: absolute; right: 2.4cqw; bottom: 2.2cqh; font-size: 1.35cqw; color: var(--muted); white-space: nowrap; }
`

/** Fills `root` with the frame, the scene's CSS (scoped) and its markup; returns the frame element. */
export function frame(root: HTMLElement, css: string, html: string): HTMLElement {
  // The site's pixel font; the page theme loads it on the web page, the presentation may not.
  if (!document.getElementById('pp-silkscreen')) {
    const link = Object.assign(document.createElement('link'), { id: 'pp-silkscreen', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Silkscreen&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap' })
    document.head.append(link)
  }
  root.innerHTML = `<div class="pp"><style>${ROOT}@scope {${BASE}${css}}</style>${html}</div>`
  return root.firstElementChild as HTMLElement
}

/** One element of the frame by selector; a missing element is a mistake in the scene. */
export function pick<E extends Element = HTMLElement>(root: ParentNode, selector: string): E {
  const found = root.querySelector<E>(selector)
  if (!found) throw new Error(`no ${selector} in the scene`)
  return found
}

/** HTML-escapes text for markup. */
export function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
