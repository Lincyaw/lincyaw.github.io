# RPCover — one-minute film plan

Built with the presmium-animate story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `references/lengths.md`) and the launch event principle. Fact source: `highlights.md`; honors from `brief.md`.

## Brief

- **Kind:** explainer / paper video, 60 s, narrated English, no music (a quiet bed at most). 16:9.
- **Audience:** engineers who have used microservices and gRPC, not dependency-recovery research.
- **Before → after:** "to see who calls whom across services you must run the system and trace it" → "the call graph can be read straight from source, because both ends of every gRPC call come from one shared .proto definition."
- **Parts to name first:** the call, the two services and their languages; then the "blueprint" (the Protocol Buffer definition). "SCIP" and "LSIF" are not spoken; the pipeline figure shows them.

## Thesis

**After watching, the viewer understands that gRPC calls between services in different languages can be traced from source through the one definition both ends share, because they saw a Go client stub and a C++ server stub snap onto the same Protobuf service and a whole system's call graph appear without running it.**

**ABT:** Microservices call each other over gRPC, and code indexers already map the calls inside each service; **but** each indexer reads one language and its trail stops where a Go client calls a C++ server, while tracing needs the system running; **therefore** RPCover joins the two ends through the Protobuf definition both were generated from, and the cross-language call graph appears from source alone.

## Pattern

**Mechanism walk, told as the journey of one call** (story.md table: "Mechanism walk — a method paper, one example through the pipeline"; "Journey of one request — how a system works"; the 60 s guidance: "ABT, puzzle first"). RPCover is a method paper about how calls connect, so following one concrete call (the Greeter `SayHello` of Fig. 3, from a Go client to a C++ server as in Fig. 4) carries the whole mechanism; opening on the call losing its trail is the puzzle.

## Three storylines

1. **Follow one call (recommended).** Shape: one call is the protagonist. It leaves the Go client, its trail goes dark at the service edge, the shared definition lights the way across, it lands in the C++ server; then every call lights and the whole system's graph appears. Form: a chain carried by the call's glowing trail, which survives every boundary. First 2 s: a Go box, a lit call chain, a dark gap. Rules out: an opening number; a tour of the pipeline boxes first.
2. **Islands become a map (bold).** Shape: a split that becomes one. Five language islands (C++, Java, Python, Go, TypeScript) each with its own internal road map; one .proto lighthouse in the sea; bridges grow from it; the islands join into one continent that is the recovered graph. Form: one frame that rebuilds itself. Rules out: the paper's figures until the very end; the metaphor's breaking point (a .proto is generated into each service, not a place between them) needs saying.
3. **Result first.** Shape: result-first reveal. Open on the hotel-reservation graph and "149 of 149", then rewind to how. Form: match cuts between the result and the mechanism. Rules out: a puzzle; the viewer gets the answer before wanting it.

**Chosen: 1.** One concrete call is the smallest picture that proves the thesis, and its trail gives every boundary a carry. Turn at about 0:19 (32%): the "?" in the gap becomes the pink Protobuf card and the trail continues; the turn is a change in the picture.

- **Spatial convention:** left = the caller (Go client), right = the callee (C++ server); the shared definition appears between and below them.
- **One meaning per colour:** the call's trail is the accent; the Protobuf definition keeps the paper's pink; grey means "not traced".
- **Misconception to confront:** "you can only see service dependencies by tracing a running system".
- **Rate:** 141 words in 60 s, about 2.6 words a second with a 4 s final hold; measure the chosen voice and lengthen chapter 5's hold if it speaks slower.

## Chapters

| # | Chapter | Start |
|---|---|---|
| 1 | A call loses its trail | 0:00 |
| 2 | Tracing waits for traffic | 0:12 |
| 3 | The shared blueprint | 0:19 |
| 4 | Every service, one map | 0:32 |
| 5 | The system, drawn from source | 0:43 |

## Storyboard

### 1 · A call loses its trail — 0:00–0:12

- **Rest frame:** two service boxes, "Go" left and "C++" right. Inside the Go box a short call chain lit in the accent ends at `stub.SayHello()` (from `figures/grpc-stub-reference-implementation.png`, client code); between the boxes a dark dashed gap with one "?". The C++ box is grey.
- **What moves:** the chain lights function by function, reaches the box edge and stops; the "?" appears in the gap.
- **Viewer now understands:** a cross-language call is invisible to a tool that reads one language.
- **Narration:** A Go service calls a C++ service over gRPC. Ask a code indexer who answers that call, and the trail stops at the Go service's edge: it reads one language.
- **On-screen text:** Go → C++ ?
- **Carries into 2:** the dark gap stretches downward into a timeline axis.

### 2 · Tracing waits for traffic — 0:12–0:19

- **Rest frame:** the same two boxes, now inside a "running" frame; under them a timeline with a highlighted window; only the call arrows that fired inside that window are drawn, others missing.
- **What moves:** the system powers on (boxes fill), the window slides along the timeline, arrows flash only while it covers them.
- **Viewer now understands:** tracing needs a running system and only sees what happened while it watched.
- **Narration:** Tracing live traffic needs the whole system running, and still only sees the calls made while it watched.
- **On-screen text:** none
- **Carries into 3:** the timeline drops away; the "?" in the gap stays and starts to glow pink.

### 3 · The shared blueprint — 0:19–0:32 (the turn)

- **Rest frame:** `figures/protobuf-bindings-and-stubs.png`: the pink "ProtoBuf Definition" with arrows to C++, Java, PHP and Go bindings; dashed lines Go binding → Client Stub and C++ binding → Server Stub; the "call" arc between the stubs solid in the accent.
- **What moves:** the "?" unfolds into the pink definition card (`service Greeter`, from `figures/grpc-stub-reference-implementation.png`); bindings branch out of it; the Go client stub and the C++ server stub each snap onto the card; the accent trail from chapter 1 continues through the card and lights the C++ box.
- **Viewer now understands:** both ends were generated from one definition, so matching each end to it connects them.
- **Narration:** Both ends, though, were generated from one blueprint, a Protocol Buffer definition. The Go client stub and the C++ server stub carry its service's names, so match both to it, and the trail continues.
- **On-screen text:** One .proto, both ends
- **Carries into 4:** the lit link (client stub → definition → server stub) shrinks into the "gRPC Matcher" box of the next frame.

### 4 · Every service, one map — 0:32–0:43

- **Rest frame:** `figures/rpcover-workflow.png` fully lit: ① target source code → SCIP indexers, ② gRPC proto definitions → gRPC Matcher, ③ LSIF converter → LSIF index.
- **What moves:** the matcher box lands first (the carried link); then the stacked indexer boxes fill on its left as several service boxes drop into them; finally the merged index flows right through the converter. One token travels the arrows once.
- **Viewer now understands:** the same move is done for every service at once: standard indexers map each service, the matcher joins them, one index comes out.
- **Narration:** RPCover does this for every service: standard indexers map each one, its gRPC Matcher joins the stubs across languages, and one merged index opens in a graph viewer.
- **On-screen text:** ① Index ② Match ③ Merge
- **Carries into 5:** the "LSIF Index" card opens like a page and the graph grows out of it.

### 5 · The system, drawn from source — 0:43–1:00

- **Rest frame (held 4 s):** `figures/deathstarbench-hotel-reservation-graph.png` (frontend, search, rate, geo, recommendation, user, profile, reservation, `depend` edges) on the left; on the right **149 / 149 gRPC calls found** with "Table II" under it; the five language chips C++, Java, Python, Go, TypeScript in a row. End card under it: title, ASE 2023 Industry Challenge Track, **Distinguished Paper Award**, Aoyang Fang, Ruiyu Zhou, Xiaoying Tang, Pinjia He; github.com/CUHK-SE-Group/protoc-gen-scip.
- **What moves:** nodes pop out of the index one at a time and the `depend` edges draw in, each edge flashing the accent trail once (the same trail as chapter 1); then the counter rolls to 149 / 149 and the chips land under it. Then nothing moves.
- **Viewer now understands:** a real system's call graph came from source alone, and across the benchmarks no gRPC call was missed. The thing to remember: follow the shared definition.
- **Narration:** Here is DeathStarBench's hotel reservation system, drawn without running it. In two benchmarks across five languages, RPCover found all 149 gRPC calls: follow the shared definition, and no call gets lost. *(149, recall 100%: Table II.)*
- **On-screen text:** 149 / 149 calls found (Table II)

## Narration

Read as one piece:

> A Go service calls a C++ service over gRPC. Ask a code indexer who answers that call, and the trail stops at the Go service's edge: it reads one language. Tracing live traffic needs the whole system running, and still only sees the calls made while it watched. Both ends, though, were generated from one blueprint, a Protocol Buffer definition. The Go client stub and the C++ server stub carry its service's names, so match both to it, and the trail continues. RPCover does this for every service: standard indexers map each one, its gRPC Matcher joins the stubs across languages, and one merged index opens in a graph viewer. Here is DeathStarBench's hotel reservation system, drawn without running it. In two benchmarks across five languages, RPCover found all 149 gRPC calls: follow the shared definition, and no call gets lost.

**Word count: 141.** Spoken number: 149 (Table II; 149 true positives, 0 false negatives). Shown, not spoken: precision 99.33% and recall 100% may appear in the end card's small line (Table II).

## Checks

- Durations add to 60 s; the final frame holds 4 s, plus the end card's line.
- Thumbnail strip (no sound): a trail stopping at a gap → a time window catching some calls → a pink definition joining both ends → the three-step pipeline → the recovered graph and 149 / 149. It reads as "lost call → shared definition finds it → whole system".
- Every claim maps to `highlights.md`: single-language analysis cannot follow a call into another service, tracing needs deployment and a time frame (Challenge); stubs generated from one definition matched by name, SCIP indexers, gRPC Matcher, merged index, LSIF for graph viewers (Solution); without deploying (Task); 149 calls, recall 100%, five languages, two benchmarks (Results, Solution); the award (`brief.md`, Honors).
