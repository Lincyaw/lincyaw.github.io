import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 4. Rewritten queries fall into RedisGraph; what comes out is a count of distinct query plans. The bars are
// the paper's Fig. 6 (10 long base queries; distinct plans after 30…300 rewrites each, average of 50 runs), growing
// left to right, the last one counting to 1,253.
const PLANS = [227, 394, 536, 662, 776, 882, 982, 1078, 1167, 1253]
const MAX = 1300

const CSS = `
  .chips { position: absolute; left: 5cqw; top: 9cqh; width: 22cqw; }
  .chip { position: absolute; left: 0; width: 22cqw; height: 3.6cqh; border: 0.18cqw solid var(--ink); background: var(--white);
    font-family: 'IBM Plex Mono', monospace; font-size: 1.15cqw; line-height: 3.2cqh; padding-left: 0.8cqw; white-space: nowrap; overflow: hidden; }
  .chip i { font-style: normal; color: #a86b00; } .chip u { text-decoration: none; color: var(--acc); }
  .db { position: absolute; left: 6cqw; top: 46cqh; width: 20cqw; height: 30cqh; }
  .db svg { width: 100%; height: 100%; overflow: visible; }
  .db rect, .db ellipse { fill: var(--white); stroke: var(--ink); stroke-width: 0.6; }
  .db text { font-family: 'Silkscreen', monospace; font-size: 3.4px; text-anchor: middle; fill: var(--ink); }
  .arrow { position: absolute; left: 27.5cqw; top: 58cqh; width: 7cqw; height: 0.3cqw; background: var(--ink); transform-origin: 0 50%; }
  .chart { left: 37cqw; top: 9cqh; width: 58cqw; height: 72cqh; padding: 2cqw 2cqw 0 4.5cqw; }
  .chart .ttl { font-family: 'Silkscreen', monospace; font-size: 1.6cqw; color: var(--muted); }
  .plot { position: absolute; left: 4.5cqw; right: 2cqw; top: 9cqh; bottom: 9cqh; border-left: 0.18cqw solid var(--ink); border-bottom: 0.18cqw solid var(--ink); }
  .bar { position: absolute; bottom: 0; width: 6%; background: color-mix(in oklab, #c08a00 30%, #ffffff); border: 0.15cqw solid var(--ink); border-bottom: none; transform-origin: 50% 100%; }
  .bar.last { background: var(--acc); }
  .x { position: absolute; bottom: -4.5cqh; width: 6%; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 1.15cqw; color: var(--muted); }
  .xt { position: absolute; left: 4.5cqw; right: 2cqw; bottom: 0.8cqh; text-align: center; font-size: 1.2cqw; color: var(--muted); }
  .big { position: absolute; left: 3%; top: 0; font-family: 'Silkscreen', monospace; font-size: 4.6cqw; line-height: 1; color: var(--acc); }
  .big small { display: block; font-size: 1.4cqw; color: var(--muted); }
  .caption { bottom: 3.2cqh; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const chips = [
    ['MATCH <i>(n4)&lt;-(n2)&lt;-(n1)</i>, <u>(n2)&lt;-(n3)</u>', 0],
    ['MATCH <i>(n3)-&gt;(n2)-&gt;(n4)</i>, <u>(n1)-&gt;(n2)</u>', 1],
    ['MATCH <i>(n1)-&gt;(n2)</i>, <u>(n3)-&gt;(n2)-&gt;(n4)</u>', 2],
    ['MATCH <i>(n2)-&gt;(n4)</i>, <u>(n1)-&gt;(n2)&lt;-(n3)</u>', 3],
  ] as const
  const bars = PLANS.map((v, i) => `<div class="bar${i === PLANS.length - 1 ? ' last' : ''}" style="left:${3 + i * 9.6}%; height:${(v / MAX) * 100}%"></div><div class="x" style="left:${3 + i * 9.6}%">${(i + 1) * 30}</div>`).join('')
  const f = frame(root, CSS, `
    <div class="chips">${chips.map(([t, i]) => `<div class="chip c${i}" style="top:${i * 5}cqh">${t}</div>`).join('')}</div>
    <div class="db"><svg viewBox="0 0 40 60"><rect x="2" y="8" width="36" height="44" /><ellipse cx="20" cy="52" rx="18" ry="6" /><ellipse cx="20" cy="8" rx="18" ry="6" /><text x="20" y="32">RedisGraph</text></svg></div>
    <div class="arrow"></div><div class="label plans" style="left:27.5cqw; top:52cqh">plans</div>
    <div class="card chart"><div class="ttl">distinct query plans</div>
      <div class="plot">${bars}<div class="big"><span class="n">0</span><small>plans · 300 rewrites</small></div></div>
      <div class="xt">rewrites per base query (10 long base queries)</div>
    </div>
    <div class="caption">Many routes, one answer expected</div>
    <div class="src">Fig. 6 · RedisGraph 6.2.6</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const n = pick(f, '.big .n')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.db'), { autoAlpha: 0, duration: 0.4 }, 0)
    .from(q('.chip'), { autoAlpha: 0, xPercent: -20, duration: 0.4, stagger: 0.12 }, 0.05)
  // each chip drops into the database, one after another
  q('.chip').forEach((chip, i) => {
    tl.to(chip, { yPercent: ((50 - i * 5) / 3.6) * 100, scale: 0.5, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0.12 * D + i * 0.35)
  })
  tl.from(pick(f, '.arrow'), { scaleX: 0, duration: 0.4 }, 0.3 * D)
    .from(pick(f, '.plans'), { autoAlpha: 0, duration: 0.3 }, 0.32 * D)
    .from(pick(f, '.chart'), { autoAlpha: 0, xPercent: 4, duration: 0.5 }, 0.32 * D)
    .from(q('.x'), { autoAlpha: 0, duration: 0.3, stagger: 0.04 }, 0.36 * D)
    .from(q('.bar'), { scaleY: 0, duration: 0.5, stagger: 0.32 * D / PLANS.length, ease: 'power2.out' }, 0.4 * D)
    .from(pick(f, '.big'), { autoAlpha: 0, duration: 0.3 }, 0.4 * D)
    .fromTo(n, { textContent: 0 }, { textContent: 1253, snap: { textContent: 1 }, duration: 0.36 * D, ease: 'power1.inOut' }, 0.4 * D)
    .set(n, { textContent: '1,253' }, 0.76 * D + 0.01)
    .from(pick(f, '.caption'), { autoAlpha: 0, duration: 0.4 }, 0.8 * D)
    .from(pick(f, '.src'), { autoAlpha: 0, duration: 0.4 }, 0.8 * D)
    .set({}, {}, D)
  return tl
})
