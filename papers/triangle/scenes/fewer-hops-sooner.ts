import { gsapScene } from '@lincyaw/addon-motion/scene'
import { C, frame, moves } from './kit/frame.ts'

// Fewer hops, sooner. `accuracy`: hop accuracy at hops 1–5 (Table II) as paired bars, DeepCT in grey (given the
// discussions engineers wrote) and Triangle in the accent (writing its own). `tte`: the chart steps back and the Time
// to Engage bar loses up to 91% (Table I, production). `end`: the title card.
const HOPS = [[43.4, 54.7], [54.6, 70.4], [60.4, 80.5], [64.4, 86.0], [67.6, 91.7]]
const H = 30 // cqw for 100%

export default gsapScene(({ root, gsap, at }) => {
  const f = frame(root, `
    .chart { position: absolute; left: 8cqw; top: 9cqw; width: 58cqw; height: ${H + 9}cqw; transform-origin: 0% 0%; }
    .chart__title { position: absolute; left: 0; top: 0; font-size: 1.5cqw; }
    .axis { position: absolute; left: 0; right: 0; top: ${H + 4}cqw; border-top: 0.22cqw solid var(--pm-color-ink); }
    .grp { position: absolute; bottom: 5cqw; width: 9cqw; height: ${H}cqw; display: flex; align-items: flex-end; gap: 0.6cqw; }
    .bar { position: relative; width: 4cqw; border: 0.18cqw solid var(--pm-color-ink); transform-origin: bottom center; }
    .bar--d { background: var(--pm-color-muted); }
    .bar--t { background: ${C.accent}; box-shadow: 0.35cqw 0.35cqw 0 0 var(--pm-color-ink); }
    .bar__v { position: absolute; left: 50%; bottom: 100%; transform: translateX(-50%); margin-bottom: 0.4cqw; font-family: var(--pm-font-mono); font-size: 1.25cqw; white-space: nowrap; }
    .bar--t .bar__v { color: ${C.accent}; font-weight: 500; }
    .grp__x { position: absolute; left: 0; right: 0; bottom: -3.4cqw; text-align: center; font-size: 1.3cqw; }
    .legend { left: 83%; font-size: 1.3cqw; text-align: left; width: 28cqw; }
    .legend__sw { display: inline-block; width: 1.6cqw; height: 1.6cqw; vertical-align: middle; margin-right: 0.8cqw; border: 0.18cqw solid var(--pm-color-ink); }
    .legend__note { display: block; margin: 0.6cqw 0 0 2.6cqw; font-family: var(--pm-font-sans); text-transform: none; letter-spacing: 0; font-size: 1.5cqw; color: var(--pm-color-muted); }
    .tte { left: 62%; top: 46%; width: 56cqw; }
    .tte__label { font-size: 1.6cqw; }
    .tte__row { display: flex; align-items: center; gap: 1.5cqw; margin-top: 1cqw; }
    .tte__track { width: 40cqw; height: 5cqw; border: 0.22cqw solid var(--pm-color-ink); background: var(--pm-color-surface); }
    .tte__bar { width: 100%; height: 100%; background: ${C.alarm}; transform-origin: left center; }
    .tte__num { font-family: var(--pm-font-mono); font-size: 7cqw; color: ${C.accent}; line-height: 1; }
    .tte__src { margin-top: 1cqw; }
    .end { left: 50%; top: 50%; text-align: center; width: 84cqw; }
    .end__name { font-size: 7cqw; }
    .end__title { font-size: 2.2cqw; margin-top: 2cqw; }
    .end__meta { font-size: 1.5cqw; margin-top: 2cqw; }
  `, `
    <div class="chart">
      <div class="px chart__title">right team within N hops (%) · Table II</div>
      ${HOPS.map(([d, t], i) => `<div class="grp g${i}" style="left:${3 + i * 11}cqw">
        <div class="bar bar--d" style="height:${d / 100 * H}cqw"><div class="bar__v">${d}</div></div>
        <div class="bar bar--t" style="height:${t / 100 * H}cqw"><div class="bar__v">${t}</div></div>
        <div class="px grp__x">hop ${i + 1}</div></div>`).join('')}
      <div class="axis"></div>
    </div>
    <div class="pos px legend lg1" style="top:36%"><span class="legend__sw" style="background:var(--pm-color-muted)"></span>DeepCT<span class="legend__note">reads discussions engineers wrote</span></div>
    <div class="pos px legend lg2" style="top:54%"><span class="legend__sw" style="background:${C.accent}"></span>Triangle<span class="legend__note">writes its own, from the logs</span></div>
    <div class="pos tte">
      <div class="px tte__label">time to engage · production</div>
      <div class="tte__row"><div class="tte__track"><div class="tte__bar"></div></div><div class="tte__num">0%</div></div>
      <div class="source tte__src">up to 91% shorter, three months before vs after deployment · Table I</div>
    </div>
    <div class="pos end">
      <div class="px end__name accent">Triangle</div>
      <div class="end__title">Empowering Incident Triage with Multi-Agent</div>
      <div class="end__meta muted">Yu*, <b>Fang*</b>, Ma, et al. · ASE 2025 · doi.org/10.1109/ASE63991.2025.00062</div>
    </div>
    <div class="pos cap c1">Right team within five hops: 91.7% vs 67.6%.</div>
    <div class="pos cap c2">In production, tickets reach their team sooner.</div>
    <div class="pos cap c3">What the ticket lacks, agents fetch.</div>
  `)
  const s = (k: number) => at(k) / 1000
  const tl = gsap.timeline()
  const m = moves(gsap, tl, f)
  const q = (sel: string) => f.querySelector(sel)!
  // accuracy: the axis, DeepCT's bars, then Triangle's beside them, hop by hop; the hop-5 pair is marked.
  m.enter(q('.chart__title'), s(0) + 0.1, { from: 'fade' })
  m.enter(f.querySelectorAll('.grp__x'), s(0) + 0.2, { from: 'fade', stagger: 0.05 })
  m.enter(q('.lg1'), s(0) + 0.4, { from: 'fade' })
  const d = [...f.querySelectorAll('.bar--d')], t = [...f.querySelectorAll('.bar--t')]
  gsap.set([...d, ...t], { scaleY: 0 })
  gsap.set(f.querySelectorAll('.bar__v'), { autoAlpha: 0 })
  tl.to(d, { scaleY: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, s(0) + 0.5)
  tl.to(f.querySelectorAll('.bar--d .bar__v'), { autoAlpha: 1, duration: 0.2, stagger: 0.12 }, s(0) + 1.0)
  m.enter(q('.lg2'), s(0) + 2.0, { from: 'fade' })
  tl.to(t, { scaleY: 1, duration: 0.7, stagger: 0.18, ease: 'power2.out' }, s(0) + 2.2)
  tl.to(f.querySelectorAll('.bar--t .bar__v'), { autoAlpha: 1, duration: 0.2, stagger: 0.18 }, s(0) + 2.8)
  m.caption(q('.c1'), s(0) + 3.8, s(1) + 0.1)
  m.emphasize(q('.g4'), s(0) + 4.2, 1.08)
  // tte: the chart steps back; the waiting bar of chapter 1, now Time to Engage, loses up to 91%.
  tl.to(q('.chart'), { scale: 0.45, autoAlpha: 0.5, duration: 0.8, ease: 'power3.inOut' }, s(1) + 0.1)
  m.exit([q('.lg1'), q('.lg2')], s(1) + 0.1)
  m.enter(q('.tte'), s(1) + 0.6, { from: 'fade' })
  tl.to(q('.tte__bar'), { scaleX: 0.09, duration: 1.6, ease: 'power3.inOut' }, s(1) + 1.2)
  m.count(q('.tte__num') as HTMLElement, s(1) + 1.2, 0, 91, { duration: 1.6, prefix: '\u2212', suffix: '%' })
  m.caption(q('.c2'), s(1) + 0.8, s(1) + 3.3)
  m.caption(q('.c3'), s(1) + 3.5, s(2) + 0.1)
  // end: the title card.
  m.exit([q('.chart'), q('.tte')], s(2) + 0.1)
  m.enter(q('.end'), s(2) + 0.4, { from: 'scale' })
  return tl
})
