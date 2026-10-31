// The film's frame and moves, shared by this paper's scenes. A 16:9 frame in container units (1cqw = 1% of its width),
// so a scene looks the same in the page column, on a slide and in the player. The look is the site's pixel theme:
// paper ground, ink outlines with hard offset shadows, square corners, Silkscreen labels, IBM Plex text.
import type { gsap as Gsap } from 'gsap'

type Timeline = ReturnType<typeof Gsap.timeline>
type Targets = Parameters<Timeline['to']>[0]

const ROOT = `.pf { position: absolute; inset: 0; container-type: size; overflow: hidden; background: var(--pm-color-bg); color: var(--pm-color-ink); font-family: var(--pm-font-sans); line-height: 1.25; }`
const BASE = `
  * { box-sizing: border-box; }
  .pos { position: absolute; }
  .px { font-family: var(--px-font, 'Silkscreen', ui-monospace, monospace); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
  .card { background: var(--pm-color-surface); border: 0.22cqw solid var(--pm-color-ink); box-shadow: 0.45cqw 0.45cqw 0 0 var(--pm-color-ink); }
  .chip { display: inline-block; padding: 0.5cqw 1cqw; border: 0.18cqw solid var(--pm-color-ink); background: var(--pm-color-surface); font-size: 1.5cqw; }
  .muted { color: var(--pm-color-muted); }
  .accent { color: var(--px-diagnose, #2546b8); }
  .alarm { color: var(--px-evaluate, #b93a0b); }
  .source { font-size: 1.3cqw; color: var(--pm-color-muted); }
  .cap { left: 50%; top: 94%; font-size: 2.3cqw; font-weight: 600; white-space: nowrap; padding: 0.2cqw 1cqw; background: var(--pm-color-bg); }
`

/** Colors by meaning: one meaning per color across the film. */
export const C = {
  accent: 'var(--px-diagnose, #2546b8)',
  alarm: 'var(--px-evaluate, #b93a0b)',
  ink: 'var(--pm-color-ink)',
  muted: 'var(--pm-color-muted)',
  line: 'var(--pm-color-line)',
  surface: 'var(--pm-color-surface)',
  soft: 'var(--px-diagnose-soft, #e6ebfa)',
}

/** Fills `root` with the frame, the scene's CSS (scoped to the frame) and its markup. */
export function frame(root: HTMLElement, css: string, html: string): HTMLElement {
  root.innerHTML = `<div class="pf"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap"><style>${ROOT}@scope {${BASE}${css}}</style>${html}</div>`
  return root.firstElementChild as HTMLElement
}

/** Seconds. Entering takes longer than leaving; a move between two places takes longest. */
export const DUR = { exit: 0.25, enter: 0.45, move: 0.7, draw: 0.6, stagger: 0.08 }
export const EASE = { enter: 'expo.out', exit: 'power2.in', move: 'power3.inOut', pop: 'back.out(2)', count: 'power3.out' }

/**
 * The moves, each setting its start state when the timeline is built so a seek backwards restores it. Every `.pos`
 * element of `f` is centred on its left/top by GSAP (not by a CSS transform, which GSAP would read as pixels), so
 * entrances offset that centring: they are meant for `.pos` elements.
 */
export function moves(gsap: typeof Gsap, tl: Timeline, f: HTMLElement) {
  gsap.set(f.querySelectorAll('.pos'), { xPercent: -50, yPercent: -50 })
  function enter(targets: Targets, t: number, { from = 'below' as 'below' | 'scale' | 'fade' | 'left', stagger = DUR.stagger, duration = DUR.enter } = {}) {
    const start = from === 'below' ? { yPercent: -20 } : from === 'scale' ? { scale: 0.6 } : from === 'left' ? { xPercent: -80 } : {}
    const rest = Object.fromEntries(Object.keys(start).map(k => [k, k === 'scale' ? 1 : -50]))
    gsap.set(targets, { autoAlpha: 0, ...start })
    tl.to(targets, { autoAlpha: 1, ...rest, duration, stagger, ease: from === 'scale' ? EASE.pop : EASE.enter }, t)
  }
  function exit(targets: Targets, t: number, { duration = DUR.exit } = {}) {
    tl.to(targets, { autoAlpha: 0, duration, ease: EASE.exit }, t)
  }
  function emphasize(target: Targets, t: number, scale = 1.12) {
    tl.to(target, { keyframes: [{ scale, duration: 0.15, ease: 'power2.out' }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }] }, t)
  }
  /** A number runs from `from` to `to`, slowing as it lands. */
  function count(target: HTMLElement, t: number, from: number, to: number, { duration = 0.9, decimals = 0, prefix = '', suffix = '' } = {}) {
    const text = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`
    target.textContent = text(from)
    const value = { v: from }
    tl.to(value, { v: to, duration, ease: EASE.count, modifiers: { v: (v: number) => { target.textContent = text(+v); return v } } }, t)
  }
  /** An SVG line draws from its start to its end. */
  function draw(path: Targets, t: number, { duration = DUR.draw, stagger = 0 } = {}) {
    gsap.set(path, { drawSVG: 0 })
    tl.to(path, { drawSVG: '100%', duration, stagger, ease: 'power2.inOut' }, t)
  }
  /** A wipe uncovers the element from left to right. */
  function reveal(target: Targets, t: number, { duration = 1.2 } = {}) {
    gsap.set(target, { clipPath: 'inset(0% 100% 0% 0%)' })
    tl.to(target, { clipPath: 'inset(0% 0% 0% 0%)', duration, ease: 'power2.inOut' }, t)
  }
  /** A one-line caption: shown from `from` until `to` (or to the end of the scene). */
  function caption(target: Element, from: number, to?: number) {
    enter(target, from, { from: 'below' })
    if (to !== undefined) exit(target, to)
  }
  return { enter, exit, emphasize, count, draw, reveal, caption }
}
