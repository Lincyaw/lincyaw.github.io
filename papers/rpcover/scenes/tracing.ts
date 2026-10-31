import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 2. Tracing needs a running system: four live services, four kinds of calls at different moments on a
// timeline. A time window slides along it; only the calls that happen inside the window get drawn, the others stay
// dashed and grey. The rest frame keeps two calls seen and two never seen.
const SVC = [['Go', 6], ['C++', 30], ['Java', 54], ['Python', 78]] as const
const CALLS = [ // from, to, time on the timeline (0..1), seen by the window
  [0, 1, 0.18, true], [1, 2, 0.34, true], [0, 3, 0.66, false], [2, 3, 0.86, false],
] as const

const CSS = `
  .svc { top: 13cqh; width: 15cqw; height: 13cqh; padding: 1cqw; text-align: center; }
  .svc .nm { font-family: 'Silkscreen', monospace; font-size: 2cqw; }
  .live { font-family: 'Silkscreen', monospace; font-size: 1.2cqw; color: #0f766e; margin-top: 0.6cqh; }
  svg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; }
  .call { fill: none; stroke-width: 0.45; }
  .call.seen { stroke: var(--acc); }
  .call.miss { stroke: var(--line); stroke-dasharray: 1 0.8; }
  .axis { stroke: var(--ink); stroke-width: 0.3; }
  .tick { stroke: var(--ink); stroke-width: 0.3; }
  .tick.seen { stroke: var(--acc); stroke-width: 0.6; }
  .win { fill: color-mix(in oklab, #5b4b99 18%, transparent); stroke: var(--acc); stroke-width: 0.25; }
  .tl, .tlw { font-family: 'Silkscreen', monospace; font-size: 1.5px; fill: var(--muted); }
  .caption { bottom: 6cqh; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const x = (i: number) => SVC[i][1] + 7.5 // centre of a box, in % of width = viewBox units (0..100)
  const arc = (a: number, b: number, k: number) => {
    const xa = x(a), xb = x(b), h = 6 + Math.abs(xb - xa) * 0.12 + k
    return `M ${xa} 15 C ${xa} ${15 + h}, ${xb} ${15 + h}, ${xb} 15`
  }
  const T0 = 15, T1 = 85, TY = 42 // the timeline in viewBox units (y in 56.25 high)
  const f = frame(root, CSS, `
    ${SVC.map(([n, l]) => `<div class="card svc" style="left:${l}cqw"><div class="nm">${n}</div><div class="live">● running</div></div>`).join('')}
    <svg viewBox="0 0 100 56.25" preserveAspectRatio="none">
      ${CALLS.map(([a, b, , seen], i) => `<path class="call ${seen ? 'seen' : 'miss'} c${i}" d="${arc(a, b, i * 1.5)}" />`).join('')}
      <line class="axis" x1="${T0}" y1="${TY}" x2="${T1}" y2="${TY}" />
      ${CALLS.map(([, , t, seen], i) => `<line class="tick ${seen ? 'seen' : ''} k${i}" x1="${T0 + t * (T1 - T0)}" y1="${TY - 1.6}" x2="${T0 + t * (T1 - T0)}" y2="${TY + 1.6}" />`).join('')}
      <rect class="win" x="${T0}" y="${TY - 3}" width="${0.42 * (T1 - T0)}" height="6" />
      <text class="tl" x="${T0}" y="${TY + 5}">time</text><text class="tlw" x="${T0 + 0.21 * (T1 - T0)}" y="${TY - 4}" text-anchor="middle">traced window</text>
    </svg>
    <div class="caption">Tracing sees only what ran</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const win = pick<SVGRectElement>(f, '.win')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(q('.svc'), { autoAlpha: 0, yPercent: -10, duration: 0.4, stagger: 0.08 }, 0)
    .from(q('.axis, .tl'), { autoAlpha: 0, duration: 0.3 }, 0.15 * D)
    .from(q('.tick'), { autoAlpha: 0, duration: 0.3, stagger: 0.05 }, 0.18 * D)
    .from(q('.call.miss'), { autoAlpha: 0, duration: 0.4 }, 0.2 * D)
    .from(win, { attr: { width: 0 }, duration: 0.42 * D, ease: 'none' }, 0.25 * D)
    .from(f.querySelector('.tlw'), { autoAlpha: 0, duration: 0.3 }, 0.3 * D)
  CALLS.forEach(([, , t, seen], i) => {
    if (seen) tl.from(pick(f, `.c${i}`), { drawSVG: 0, duration: 0.5 }, 0.25 * D + (t / 0.42) * 0.42 * D)
  })
  tl.from(pick(f, '.caption'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.72 * D)
    .set({}, {}, D)
  return tl
})
