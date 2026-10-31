import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, captionsSvg, frame, holdTo, playCaptions, sec } from './lib/frame.ts'

// Detection is not faithfulness. Paper, Table 1 (291 tasks, gold reference). `detect`: each agent's detection rate,
// the share of tasks whose check rejects the violation, grows as a teal bar. `faithful`: each bar is cut back to the
// faithfulness rate (rejects the violation and accepts gold and the valid alternatives); the part cut off, hatched
// red, is lost to false alarms; a dashed line at 63% stands above every bar.
const CAPTIONS = [
  "Share of tasks where each agent's check rejects the violation",
  'Count the false alarms and no agent is faithful on more than 63%',
]
// [harness, model, detection %, faithfulness %]
const ROWS: [string, string, number, number][] = [
  ['Codex', 'GPT-5.6-sol', 81.8, 61.9],
  ['Claude Code', 'Claude Opus 5', 65.3, 50.2],
  ['OpenCode', 'DeepSeek-V4-Pro', 66.7, 45.0],
  ['OpenCode', 'GLM-5.3', 74.2, 62.9],
]
const X0 = 400, PX = 7.6, Y0 = 128, ROW = 110, BAR = 54
const CEILING = 63

export default gsapScene(({ root, gsap, at, total }) => {
  const s = sec(at)
  const css = `
    .who { font-size: 22px; font-weight: 600; }
    .model { font-size: 18px; }
    .det { fill: ${C.agent}; stroke: ${C.ink}; stroke-width: 2.5; }
    .gap { fill: url(#sgb-hatch); stroke: ${C.bad}; stroke-width: 2.5; }
    .val { font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .gap-label { font-size: 15px; font-weight: 600; }
    .axis { stroke: ${C.ink}; stroke-width: 2; }
    .tick { font-size: 15px; fill: ${C.muted}; }
    .ceiling { stroke: ${C.ink}; stroke-width: 3; stroke-dasharray: 9 7; }
    .ceiling-label { font-size: 18px; }
  `
  const rows = ROWS.map(([who, model, det, faith], i) => {
    const y = Y0 + i * ROW
    return `<g class="row row-${i}">
      <text class="who" x="${X0 - 20}" y="${y + 24}" text-anchor="end">${who}</text>
      <text class="mono model muted" x="${X0 - 20}" y="${y + 48}" text-anchor="end">${model}</text>
      <rect class="det det-${i}" x="${X0}" y="${y}" width="${det * PX}" height="${BAR}" />
      <rect class="gap gap-${i}" x="${X0 + faith * PX}" y="${y}" width="${(det - faith) * PX}" height="${BAR}" opacity="0" />
      <text class="val val-det-${i}" x="${X0 + det * PX + 12}" y="${y + 36}">${det.toFixed(1)}%</text>
      <text class="val val-faith-${i}" x="${X0 + faith * PX - 10}" y="${y + 36}" text-anchor="end" style="fill:${C.white}" opacity="0">${faith.toFixed(1)}%</text>
      <text class="gap-label bad gap-label-${i}" x="${X0 + det * PX + 12}" y="${y + 36}" opacity="0">−${(det - faith).toFixed(1)} pts: false alarms</text>
    </g>`
  }).join('')
  const ticks = [0, 25, 50, 75, 100].map(v => `<line x1="${X0 + v * PX}" y1="${Y0 + 4 * ROW - 40}" x2="${X0 + v * PX}" y2="${Y0 + 4 * ROW - 30}" class="axis" />
    <text class="tick" x="${X0 + v * PX}" y="${Y0 + 4 * ROW - 8}" text-anchor="middle">${v}%</text>`).join('')
  const cx = X0 + CEILING * PX
  const svg = `
    <defs><pattern id="sgb-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="10" height="10" fill="${C.badSoft}" /><line x1="0" y1="0" x2="0" y2="10" stroke="${C.bad}" stroke-width="4" /></pattern></defs>
    ${captionsSvg(CAPTIONS)}
    <line class="axis" x1="${X0}" y1="${Y0 - 16}" x2="${X0}" y2="${Y0 + 4 * ROW - 34}" />
    <line class="axis" x1="${X0}" y1="${Y0 + 4 * ROW - 34}" x2="${X0 + 100 * PX}" y2="${Y0 + 4 * ROW - 34}" />
    ${ticks}
    <text class="tick" x="${X0 + 50 * PX}" y="${Y0 + 4 * ROW + 18}" text-anchor="middle">share of tasks</text>
    ${rows}
    <g class="ceil" opacity="0">
      <line class="ceiling" x1="${cx}" y1="${Y0 - 30}" x2="${cx}" y2="${Y0 + 4 * ROW - 34}" />
      <text class="px ceiling-label" x="${cx + 10}" y="${Y0 - 12}">63%: NO AGENT ABOVE</text>
    </g>
    <text class="px src muted" x="1232" y="706" text-anchor="end">PAPER, TABLE 1 · 291 TASKS · GOLD REFERENCE</text>
  `
  const el = frame(root, css, svg)
  const one = (sel: string) => el.querySelector(sel)
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  // detect
  ROWS.forEach((_, i) => {
    tl.fromTo(one(`.row-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 0.1 + i * 0.25))
    tl.fromTo(one(`.det-${i}`), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, s(0, 1.2 + i * 0.45))
    tl.fromTo(one(`.val-det-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(0, 2.2 + i * 0.45))
  })
  // faithful: the false alarms are cut from each bar, one agent after another
  ROWS.forEach((_, i) => {
    const t = 0.15 + i * 0.32
    tl.fromTo(one(`.gap-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, t))
    tl.fromTo(one(`.val-det-${i}`), { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, s(1, t))
    tl.fromTo(one(`.gap-label-${i}`), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.3 }, s(1, t + 0.15))
    tl.fromTo(one(`.val-faith-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, s(1, t + 0.25))
  })
  tl.fromTo(one('.ceil'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s(1, 1.7))
  tl.fromTo(one('.ceiling'), { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, duration: 0.6, ease: 'power2.inOut' }, s(1, 1.7))
  playCaptions(tl, el, CAPTIONS, at)
  holdTo(tl, total)
  return tl
})
