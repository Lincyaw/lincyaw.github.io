import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'

// Chapter 1. One gRPC call from a Go service to a C++ service. Inside the Go box the call chain lights up to the
// client stub and the trail runs to the box edge; there it stops, a "?" sits in the gap, and the C++ side stays grey.
export const BOXES = `
  .svc { top: 20cqh; width: 33cqw; height: 56cqh; padding: 1.6cqw; }
  .svc.go { left: 5cqw; } .svc.cc { right: 5cqw; }
  .svc .nm { font-family: 'Silkscreen', monospace; font-size: 2.2cqw; }
  .svc .sub { font-size: 1.3cqw; color: var(--muted); margin-top: 0.4cqh; }
  .fn { position: absolute; left: 2cqw; right: 2cqw; height: 7.5cqh; border: 0.18cqw solid var(--ink); background: var(--paper);
    font-family: 'IBM Plex Mono', monospace; font-size: 1.45cqw; line-height: 7cqh; padding-left: 1cqw; white-space: nowrap; }
  .fn.lit { border-color: var(--acc); background: var(--acc-soft); color: var(--acc); }
  .svc.cc.dim { border-color: var(--line); box-shadow: 0.55cqw 0.55cqw 0 var(--line); color: var(--muted); }
  .svc.cc.dim .fn { border-color: var(--line); color: var(--muted); background: var(--white); }
`

const CSS = BOXES + `
  .wire { position: absolute; width: 0.4cqw; background: var(--acc); left: 20.5cqw; transform-origin: 50% 0; }
  .out { position: absolute; top: 62.5cqh; left: 34cqw; width: 4cqw; height: 0.4cqw; background: var(--acc); transform-origin: 0 50%; }
  .gap { position: absolute; top: 62.5cqh; left: 38cqw; width: 24cqw; border-top: 0.35cqw dashed var(--line); }
  .q { position: absolute; left: 44cqw; width: 12cqw; top: 50cqh; text-align: center; font-family: 'Silkscreen', monospace; font-size: 6cqw; color: var(--muted); }
  .top { left: 0; right: 0; top: 7cqh; text-align: center; }
`

export const LIT = { borderColor: '#5b4b99', backgroundColor: '#ebe8f3', color: '#5b4b99' }

export default gsapScene(({ root, gsap, durations }) => {
  const f = frame(root, CSS, `
    <div class="label top">one gRPC call · two languages</div>
    <div class="card svc go"><div class="nm">Go</div><div class="sub">frontend service</div>
      <div class="fn f1" style="top:12cqh">main()</div>
      <div class="fn f2" style="top:24cqh">greet(name)</div>
      <div class="fn f3" style="top:36cqh">client.SayHello(req)</div>
    </div>
    <div class="wire w1" style="top:39.5cqh; height:4.5cqh"></div>
    <div class="wire w2" style="top:51.5cqh; height:4.5cqh"></div>
    <div class="out"></div><div class="gap"></div><div class="q">?</div>
    <div class="card svc cc dim"><div class="nm">C++</div><div class="sub">greeter service</div>
      <div class="fn" style="top:36cqh">SayHello(ctx, req)</div>
    </div>
    <div class="caption">Go calls C++. The trail stops.</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(pick(f, '.top'), { autoAlpha: 0, duration: 0.4 }, 0)
    .from(q('.svc'), { autoAlpha: 0, yPercent: 6, duration: 0.5, stagger: 0.2 }, 0.1)
    .from(q('.fn'), { autoAlpha: 0, duration: 0.3, stagger: 0.1 }, 0.5)
    .set(pick(f, '.f1'), LIT, 0.2 * D)
    .from(pick(f, '.w1'), { scaleY: 0, duration: 0.4, ease: 'none' }, 0.2 * D + 0.1)
    .set(pick(f, '.f2'), LIT, 0.2 * D + 0.5)
    .from(pick(f, '.w2'), { scaleY: 0, duration: 0.4, ease: 'none' }, 0.2 * D + 0.6)
    .set(pick(f, '.f3'), LIT, 0.2 * D + 1.0)
    .from(pick(f, '.out'), { scaleX: 0, duration: 0.4, ease: 'none' }, 0.2 * D + 1.1)
    .from(pick(f, '.gap'), { autoAlpha: 0, duration: 0.4 }, 0.2 * D + 1.6)
    .from(pick(f, '.q'), { autoAlpha: 0, scale: 1.8, duration: 0.45, ease: 'back.out(2)' }, 0.2 * D + 1.9)
    .from(pick(f, '.caption'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.62 * D)
    .set({}, {}, D)
  return tl
})
