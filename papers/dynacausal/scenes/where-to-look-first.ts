import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, moves } from './kit/frame.ts'

// Where to look first. `bars`: on Train-Ticket (50 services), how often each method ranks the true root cause first
// (AC@1, Table 1); the baselines grow in grey, DynaCausal in the accent past Eadro, whose graph is static.
// `average`: the chart steps back and the average AC@1 over both benchmarks (abstract) counts up to 0.63.
// `end`: the title card.
const BARS: [string, number, string?][] = [
  ['MicroRank', 0.013], ['Nezha', 0.092], ['ART', 0.176], ['Baro', 0.263], ['Eadro', 0.301, 'static graph'], ['DynaCausal', 0.481, 'dynamic graph'],
]
const SCALE = 100 // cqw per unit of AC@1

export default gsapScene(({ root, gsap, at }) => {
  const f = frame(root, `
    .chart { left: 50%; top: 52%; width: 84cqw; height: 44cqw; }
    .chart__title { position: absolute; left: 0; top: 0; font-size: 1.6cqw; }
    .bar-row { position: absolute; left: 0; height: 5cqw; display: flex; align-items: center; gap: 1.2cqw; }
    .bar-row__name { width: 15cqw; text-align: right; font-size: 1.5cqw; }
    .bar-row__bar { height: 3.6cqw; background: var(--pm-color-muted); transform-origin: left center; border: 0.18cqw solid var(--pm-color-ink); }
    .bar-row--DynaCausal .bar-row__bar { background: var(--px-diagnose, #2546b8); box-shadow: 0.45cqw 0.45cqw 0 0 var(--pm-color-ink); }
    .bar-row__val { font-family: var(--pm-font-mono); font-size: 1.7cqw; }
    .bar-row--DynaCausal .bar-row__val { color: var(--px-diagnose, #2546b8); font-weight: 500; font-size: 2.2cqw; }
    .bar-row__tag { font-size: 1.2cqw; }
    .avg { left: 66%; top: 50%; text-align: center; }
    .avg__num { font-family: var(--pm-font-mono); font-size: 16cqw; line-height: 1; color: var(--px-diagnose, #2546b8); }
    .avg__label { font-size: 2cqw; margin-top: 1cqw; }
    .avg__src { margin-top: 1cqw; }
    .end { left: 50%; top: 50%; text-align: center; width: 80cqw; }
    .end__name { font-size: 7cqw; }
    .end__title { font-size: 2.2cqw; margin-top: 2cqw; }
    .end__meta { font-size: 1.5cqw; margin-top: 2cqw; }
  `, `
    <div class="pos chart">
      <div class="px chart__title">train-ticket · ranked first (AC@1) · Table 1</div>
      ${BARS.map(([name, v, tag], i) => `<div class="bar-row bar-row--${name}" style="top:${5 + i * 6.3}cqw">
        <div class="px bar-row__name">${name}</div>
        <div class="bar-row__bar" style="width:${v * SCALE}cqw"></div>
        <div class="bar-row__val">${v.toFixed(3)}</div>
        ${tag ? `<div class="chip px bar-row__tag">${tag}</div>` : ''}
      </div>`).join('')}
    </div>
    <div class="pos avg"><div class="avg__num">0.63</div><div class="px avg__label">average AC@1 · two benchmarks</div><div class="source avg__src">abstract</div></div>
    <div class="pos cap c1">DynaCausal names the source first more often.</div>
    <div class="pos cap c2">Follow the fault, not the loudest service.</div>
    <div class="pos end">
      <div class="px end__name accent">DynaCausal</div>
      <div class="end__title">Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices</div>
      <div class="end__meta muted">Zhang, <b>Fang</b>, Yang, Cheng, Tang, He · arXiv 2510.22613 · 2025</div>
    </div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  const row = (name: string) => f.querySelector(`.bar-row--${name}`)!
  // bars: the chart frame, the grey baselines one by one, then DynaCausal's bar past Eadro's.
  m.enter(f.querySelector('.chart__title')!, s(0) + 0.1, { from: 'fade' })
  BARS.forEach(([name], i) => {
    const r = row(name)
    const t = name === 'DynaCausal' ? s(0) + 2.3 : s(0) + 0.2 + i * 0.25
    m.enter(r.querySelector('.bar-row__name')!, t, { from: 'fade' })
    gsap.set(r.querySelector('.bar-row__bar'), { scaleX: 0 })
    tl.to(r.querySelector('.bar-row__bar'), { scaleX: 1, duration: name === 'DynaCausal' ? 1.4 : 0.6, ease: 'power2.out' }, t)
    m.enter(r.querySelector('.bar-row__val')!, t + 0.4, { from: 'fade' })
  })
  m.count(row('DynaCausal').querySelector<HTMLElement>('.bar-row__val')!, s(0) + 2.3, 0, 0.481, { duration: 1.4, decimals: 3 })
  m.emphasize(row('Eadro').querySelector('.bar-row__bar')!, s(0) + 4.6, 1.06)
  m.caption(f.querySelector('.c1')!, s(0) + 3.8, s(1) + 0.1)
  m.enter(row('DynaCausal').querySelector('.bar-row__tag')!, s(0) + 3.6, { from: 'fade' })
  m.enter(row('Eadro').querySelector('.bar-row__tag')!, s(0) + 4.8, { from: 'fade' })
  // average: the chart steps back to the left; the average counts up beside it.
  tl.to(f.querySelector('.chart')!, { scale: 0.42, left: '22%', top: '50%', autoAlpha: 0.55, duration: 0.8, ease: 'power3.inOut' }, s(1) + 0.1)
  m.enter(f.querySelector('.avg')!, s(1) + 0.6, { from: 'fade' })
  m.caption(f.querySelector('.c2')!, s(1) + 2.6, s(2) + 0.1)
  m.count(f.querySelector<HTMLElement>('.avg__num')!, s(1) + 0.6, 0, 0.63, { duration: 1.6, decimals: 2 })
  // end: everything gives way to the title card.
  m.exit([f.querySelector('.chart')!, f.querySelector('.avg')!], s(2) + 0.1)
  m.enter(f.querySelector('.end')!, s(2) + 0.4, { from: 'scale' })
  return tl
})
