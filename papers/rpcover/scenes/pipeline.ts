import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 4. The paper's workflow (Fig. 2) as one flow: every service's source goes through its language's SCIP
// indexer (① index), the gRPC Matcher joins the stubs through the .proto definitions (② match), and one merged index
// comes out as LSIF for graph viewers (③ merge). A token travels the arrows once, step by step.
const LANGS = ['C++', 'Java', 'Python', 'Go', 'TS']

const CSS = `
  .src { position: absolute; left: 4cqw; width: 11cqw; height: 7cqh; border: 0.18cqw solid var(--ink); background: var(--white);
    font-family: 'Silkscreen', monospace; font-size: 1.3cqw; line-height: 6.4cqh; text-align: center; }
  .box { top: 33cqh; height: 22cqh; padding: 1.2cqw; text-align: center; }
  .box .n { font-family: 'Silkscreen', monospace; font-size: 2.6cqw; color: var(--acc); }
  .box .t { font-weight: 600; font-size: 1.9cqw; margin-top: 0.6cqh; }
  .box .s { font-size: 1.25cqw; color: var(--muted); margin-top: 0.6cqh; }
  .b1 { left: 22cqw; width: 19cqw; } .b2 { left: 50cqw; width: 19cqw; background: #f4f1fa; } .b3 { left: 78cqw; width: 18cqw; }
  .proto { position: absolute; left: 51.5cqw; top: 9cqh; width: 16cqw; height: 9cqh; background: #f6d5d1; border: 0.22cqw solid var(--ink);
    font-family: 'IBM Plex Mono', monospace; font-size: 1.3cqw; line-height: 8.4cqh; text-align: center; }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .ar { stroke: var(--ink); stroke-width: 0.35; fill: none; }
  .tok { fill: var(--acc); }
  .caption { bottom: 8cqh; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const ys = LANGS.map((_, i) => 18 + i * 11) // cqh
  const u = (cqh: number) => cqh * 0.5625 // cqh → viewBox y
  const f = frame(root, CSS, `
    ${LANGS.map((l, i) => `<div class="src s${i}" style="top:${ys[i]}cqh">${l}</div>`).join('')}
    <div class="card box b1"><div class="n">①</div><div class="t">SCIP indexers</div><div class="s">calls inside each service</div></div>
    <div class="proto">.proto files</div>
    <div class="card box b2"><div class="n">②</div><div class="t">gRPC Matcher</div><div class="s">joins stubs across services</div></div>
    <div class="card box b3"><div class="n">③</div><div class="t">One index</div><div class="s">LSIF, for graph viewers</div></div>
    <svg viewBox="0 0 100 56.25" preserveAspectRatio="none">
      ${ys.map((y, i) => `<path class="ar a0 a0-${i}" d="M 15 ${u(y + 3.5)} L 22 ${u(44)}" />`).join('')}
      <path class="ar a1" d="M 41 ${u(44)} L 50 ${u(44)}" />
      <path class="ar a2" d="M 59.5 ${u(18)} L 59.5 ${u(33)}" />
      <path class="ar a3" d="M 69 ${u(44)} L 78 ${u(44)}" />
      <circle class="tok" r="0.8" cx="15" cy="${u(ys[3] + 3.5)}" />
    </svg>
    <div class="caption">① Index ② Match ③ Merge</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const tok = pick<SVGCircleElement>(f, '.tok')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(q('.src'), { autoAlpha: 0, xPercent: -30, duration: 0.4, stagger: 0.08 }, 0)
    .from(q('.a0'), { drawSVG: 0, duration: 0.5, stagger: 0.05 }, 0.12 * D)
    .from(pick(f, '.b1'), { autoAlpha: 0, scale: 0.9, duration: 0.45 }, 0.16 * D)
    .from(pick(f, '.a1'), { drawSVG: 0, duration: 0.4 }, 0.34 * D)
    .from(pick(f, '.proto'), { autoAlpha: 0, yPercent: -30, duration: 0.4 }, 0.36 * D)
    .from(pick(f, '.a2'), { drawSVG: 0, duration: 0.4 }, 0.4 * D)
    .from(pick(f, '.b2'), { autoAlpha: 0, scale: 0.9, duration: 0.45 }, 0.4 * D)
    .from(pick(f, '.a3'), { drawSVG: 0, duration: 0.4 }, 0.58 * D)
    .from(pick(f, '.b3'), { autoAlpha: 0, scale: 0.9, duration: 0.45 }, 0.6 * D)
    // the token: Go source → ① → ② → ③
    .from(tok, { autoAlpha: 0, duration: 0.2 }, 0.66 * D)
    .to(tok, { attr: { cx: 31.5, cy: u(44) }, duration: 0.6, ease: 'power2.inOut' }, 0.66 * D + 0.2)
    .to(tok, { attr: { cx: 59.5 }, duration: 0.6, ease: 'power2.inOut' }, 0.66 * D + 0.9)
    .to(tok, { attr: { cx: 87 }, duration: 0.6, ease: 'power2.inOut' }, 0.66 * D + 1.6)
    .to(tok, { autoAlpha: 0, duration: 0.25 }, 0.66 * D + 2.2)
    .from(pick(f, '.caption'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.8 * D)
    .set({}, {}, D)
  return tl
})
