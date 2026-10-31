import { gsapScene } from '@lincyaw/addon-motion/scene'
import { frame, pick } from './kit.ts'
import { BOXES, LIT } from './trail.ts'

// Chapter 3 (the turn). The "?" between the services unfolds into the Protobuf definition both were generated from.
// Bindings fan out of it (Go, C++, Java, Python); the Go client stub and the C++ server stub each snap onto the same
// service, and the call's trail continues through the definition into the C++ service, which lights up.
const CSS = BOXES + `
  .svc { width: 26cqw; } .svc.go { left: 4cqw; } .svc.cc { right: 4cqw; }
  .fn { left: 1.4cqw; right: 1.4cqw; font-size: 1.3cqw; }
  .proto { position: absolute; left: 38cqw; top: 12cqh; width: 24cqw; padding: 1.1cqw; background: #f6d5d1; border: 0.22cqw solid var(--ink); box-shadow: 0.55cqw 0.55cqw 0 var(--ink); }
  .proto .fn0 { font-family: 'Silkscreen', monospace; font-size: 1.3cqw; color: var(--muted); margin-bottom: 0.8cqh; }
  .proto pre { margin: 0; font-family: 'IBM Plex Mono', monospace; font-size: 1.15cqw; line-height: 1.5; white-space: pre; }
  .bind { position: absolute; top: 44cqh; width: 8.5cqw; height: 5.5cqh; border: 0.18cqw solid var(--ink); background: var(--white);
    font-family: 'Silkscreen', monospace; font-size: 1.15cqw; line-height: 5cqh; text-align: center; }
  .bind.off { border-color: var(--line); color: var(--muted); }
  svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .br { stroke: var(--ink); stroke-width: 0.2; fill: none; }
  .snap { stroke: var(--acc); stroke-width: 0.35; stroke-dasharray: 0.9 0.6; fill: none; }
  .trail { stroke: var(--acc); stroke-width: 0.6; fill: none; }
`

export default gsapScene(({ root, gsap, durations }) => {
  const f = frame(root, CSS, `
    <div class="card svc go"><div class="nm">Go</div><div class="sub">frontend service</div>
      <div class="fn f3 lit" style="top:36cqh">client.SayHello(req)</div></div>
    <div class="card svc cc"><div class="nm">C++</div><div class="sub">greeter service</div>
      <div class="fn s1" style="top:36cqh">SayHello(ctx, req)</div></div>
    <svg viewBox="0 0 100 56.25" preserveAspectRatio="none">
      <path class="br b0" d="M 50 19 L 50 23 L 35.25 23 L 35.25 24.75" />
      <path class="br b1" d="M 50 23 L 44.75 23 L 44.75 24.75" />
      <path class="br b2" d="M 50 23 L 54.25 23 L 54.25 24.75" />
      <path class="br b3" d="M 50 23 L 63.75 23 L 63.75 24.75" />
      <path class="snap s-go" d="M 35.25 27.9 L 35.25 33.6 L 29 33.6" />
      <path class="snap s-cc" d="M 63.75 27.9 L 63.75 33.6 L 71 33.6" />
      <path class="trail t" d="M 28 32 C 38 10, 62 10, 72 32" />
    </svg>
    <div class="proto"><div class="fn0">greeter.proto</div><pre>service Greeter {
  rpc SayHello(HelloRequest)
      returns (HelloReply);
}</pre></div>
    <div class="bind bg" style="left:31cqw">Go</div>
    <div class="bind bj off" style="left:40.5cqw">Java</div>
    <div class="bind bp off" style="left:50cqw">Python</div>
    <div class="bind bc" style="left:59.5cqw">C++</div>
    <div class="label lc" style="left:5.5cqw; top:68cqh">client stub</div>
    <div class="label ls" style="right:5.5cqw; top:68cqh">server stub</div>
    <div class="caption">One .proto, both ends</div>`)
  const D = durations[0] / 1000
  const q = (s: string) => f.querySelectorAll(s)
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(q('.svc'), { autoAlpha: 0, duration: 0.3 }, 0)
    .from(pick(f, '.proto'), { autoAlpha: 0, scale: 0.2, transformOrigin: '50% 100%', duration: 0.7, ease: 'back.out(1.4)' }, 0.08 * D)
    .from(q('.br'), { drawSVG: 0, duration: 0.5, stagger: 0.1 }, 0.25 * D)
    .from(q('.bind'), { autoAlpha: 0, yPercent: -40, duration: 0.4, stagger: 0.1 }, 0.28 * D)
    .from(pick(f, '.s-go'), { drawSVG: 0, duration: 0.5 }, 0.45 * D)
    .from(pick(f, '.lc'), { autoAlpha: 0, duration: 0.3 }, 0.45 * D + 0.3)
    .from(pick(f, '.s-cc'), { drawSVG: 0, duration: 0.5 }, 0.55 * D)
    .from(pick(f, '.ls'), { autoAlpha: 0, duration: 0.3 }, 0.55 * D + 0.3)
    .from(pick(f, '.t'), { drawSVG: 0, duration: 1.2, ease: 'power1.inOut' }, 0.66 * D)
    .set(pick(f, '.s1'), LIT, 0.66 * D + 1.2)
    .from(pick(f, '.caption'), { autoAlpha: 0, yPercent: 40, duration: 0.4 }, 0.78 * D)
    .set({}, {}, D)
  return tl
})
