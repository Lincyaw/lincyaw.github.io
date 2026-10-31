# Gleaner: one-minute film plan

Built with the presmium-animate story process (`references/story.md`, `storyboards.md` "Papers", `lengths.md` 60 s). Fact source: `highlights.md` (arXiv 2604.16810v1); the protagonist trace is Fig. 1. Figures in `figures/`.

## Brief

- Kind: explainer or paper video, 60 s, narrated, video first (the rest frames double as the paper page's stills).
- Audience: SREs, observability engineers and software-engineering researchers who know traces and logs; not necessarily sampling research.
- Before: "Sampling throws evidence away; the more traces you keep, the better the diagnosis."
- After: "A well-chosen 1% of traces can diagnose better than all of them."
- Misconception to confront: more data always means better diagnosis. Parts to name first: a trace, a span's log line, the sampler.
- Assumptions: 16:9, narration only, no music; the title card holds under the last sentence.

## Thesis

After watching, the viewer understands **that a well-chosen 1% of traces can diagnose failures better than all of them**, because they saw a trace marked "OK" reveal an error log that span-level samplers miss, and a thin 1% bin's accuracy dial end above the full bin's.

**And–But–Therefore.** Microservices produce too many traces to keep, and samplers choose by calls, status and latency; **but** the trace that matters can look normal, with its error only in a log that fast samplers can't see and log-aware samplers are too slow to read; therefore Gleaner encodes each trace and its logs as a cheap set of event pairs and keeps anomalous, diverse traces per API, and its 1% sample beats the full data for root cause analysis.

## Pattern

Bottleneck first, the systems-paper row of story.md's table, opened result-first as story.md advises for systems papers under a minute. Gleaner's contribution is resolving a trade-off: the "waste" is the evidence that fast samplers discard and the time log-aware samplers spend on graphs; the borrowed idea is set similarity and diversity selection; the end-to-end proof is downstream RCA against the full data.

## Three storylines

- **A. Follow one trace (recommended).** The protagonist is the Fig. 1 trace: every span OK, an ERROR log inside. It is dropped by a fast sampler, stuck in a slow graph sampler's queue, then unfolded by Gleaner into event pairs, lifted by its anomaly score and kept; it lands in the 1% bin shown in the first shot. Form: a chain, each shot's last object (the trace) is the next shot's first. Rules out: a tour of all baselines and metrics.
- **B. Two bins, rewound.** Do the last thing first: open on the 1% bin and the 100% bin with their diagnosis dials, the small one higher; then rewind the stream to show how each trace in the small bin was chosen, ending back on the dials. Form: one frame that rebuilds itself. Rules out: the semantic blind spot as a story of its own.
- **C. The sieve (bold).** A river of traces through a sieve whose mesh is the sampler: a span-only mesh lets the red-cored trace slip away; a graph mesh clogs; Gleaner's mesh is woven from event pairs and catches the red cores while letting near-duplicates through. Form: one continuous take along the river. Rules out: exact pipeline stages (allocator and selector merge into the mesh), so the metaphor must hand over to Fig. 2 by 0:35.

Recommendation: **A**. A single protagonist makes the blind spot concrete in one glance, carries every boundary, and its return to the opening bin closes the claim with the number. The turn (the trace's span tree unfolding into event pairs) falls at about 0:27, 45% in.

## Picture

- Central picture: one trace card (three span bars, green "OK" marks) with a hidden red log line inside.
- Money frame: step 6, the two bins side by side, the 1% bin holding red-cored traces, its dial at 0.56 above the full bin's 0.41.
- Colours: green = span-level "OK"; red = an error log or alarm; blue = Gleaner's kept traces; grey = discarded or baseline.
- Spatial convention: left = the existing samplers and the full data, right = Gleaner and its sample; up = better diagnosis.
- LOOK: light ground, trace cards drawn like a tracing UI's waterfall (Fig. 1's span labels), one red accent; BANNED: a particle stream as decoration, glowing dark void, text paragraphs.

## Storyboard

Chapters (the story's beats): **A trace that looks fine** 0:00 · **Why samplers drop it** 0:14 · **Traces as sets of pairs** 0:27 · **One percent, better diagnosis** 0:46 · end 1:00.

| # | Chapter · time | Rest frame (the still) | What moves | Carries into the next | Narration | On-screen text |
|---|---|---|---|---|---|---|
| 1 | A trace that looks fine · 0:00–0:06 | Two storage bins: a full one labelled "all traces" and a thin one labelled "1%"; above each a diagnosis dial, the thin bin's needle higher (no values yet) | The full bin fills from a stream; the thin bin takes a trickle; both needles swing, the thin one ends higher | The camera pushes into the stream; one card slows and grows | "Keep the right one percent of your traces, and you can diagnose failures better than with all of them. The question is which." | "1% > 100%?" |
| 2 | 0:06–0:14 | The protagonist card, as `semantic-blind-spot-trace.png` panel (a): Span-1 BasicController.queryForTravel, Status OK, 47 ms; Spans 2–3 OK — then opened to panel (b): the red [ERROR] lines "Failed to parse priceConfig…" and the [WARN] fallback | The card's spans tick green; the card opens like a drawer and the log lines slide out, the ERROR lines red | The card closes, keeping a red dot on its edge where the log sits | "This trace reports success at normal speed, yet hides an error log inside." | "Status OK. Error inside." |
| 3 | Why samplers drop it · 0:14–0:27 | Two lanes. Left: a fast gate that reads only the span bars; the card has fallen into a grey discard pile. Right: a box that redraws the trace as a graph, a neural-network glyph, a queue of cards backing up behind it, a clock labelled "offline training" (Table 1, iTCRL row) | The card passes the left gate, which reads only the green bars, and drops; it is pulled back and enters the right lane, where the queue lengthens while the clock turns | The card lifts out of the queue to centre frame; the lanes dim away | "Fast samplers read only calls, status and latency, so they drop it. Samplers that do read logs turn every trace into a graph for a trained neural network, too slow for a live stream." | "Fast but blind · aware but slow" |
| 4 | Traces as sets of pairs · 0:27–0:37 | The card unfolded into a flat set of chips, the paper's own example pairs (Section 3.2): (start_basic, log_e_156), (log_e_156, log_e_203), (log_e_203, log_w_78), (log_w_78, end_basic), (end_basic, start_route); a second trace's set beside it, shared chips joined by lines | The span tree flattens and breaks into chips (the turn); a second card unfolds next to it; matching chips light in pairs | The chips collapse into one blue dot carrying the red mark, which drops into the pipeline | "Gleaner skips the graph: each trace becomes a set of event pairs, a call followed by a log line, so similar traces simply share pairs." | "Trace → set of event pairs" |
| 5 | 0:37–0:46 | `gleaner-pipeline.png` (Fig. 2), right two-thirds: dots in Normal / Buffer / Alarm columns; an "API-1 Error" alarm with its quota bar raised to a cap line; the selector (relabelled "DPP Selector") keeping a few dark and spread-out dots per column, the protagonist's dot among them | Dots sort into columns by entry API; the alarm fires and its column's quota bar rises; near-duplicate dots fade; the protagonist's dark-red dot glows and stays | The kept dots stream out to the right, into the thin bin from step 1 | "Per API, alarms raise the quota, and a selector keeps traces both unusual and unlike each other. This trace's error log makes it stand out." | "Group · alarm quota · keep diverse" |
| 6 | One percent, better diagnosis · 0:46–1:00 | The two bins from step 1 again, now labelled: dial "ShapleyIQ top-1 accuracy", 0.41 over "all traces" and 0.56 over "Gleaner 1%", source "Table 6"; under the last 5 s the title card: title, authors, ISSTA 2026, arXiv 2604.16810 | The kept dots fall into the thin bin; the full bin's dial counts to 0.41, then the thin bin's to 0.56 | End card (hold ≥ 5 s) | "On Gleaner's one percent, the RCA tool ShapleyIQ ranks the true root cause first 56 percent of the time; on every trace, 41. Chosen well, a sample does not just save storage. It improves the diagnosis." | "Keep less. Diagnose better." |

Numbers spoken: one percent, 56 percent and 41 percent (ShapleyIQ AC@1 at a 1% sampling rate vs unsampled, Table 6). The 47 ms of the protagonist trace (Fig. 1) is shown, not spoken; per-trace speed (0.741 ms, Table 8) and coverage gains (Section 4.3) stay on the paper page.

## Narration

156 words (counted with `wc -w` over the six narration cells), about 2.6 words a second; the title card holds under the last sentence.

> Keep the right one percent of your traces, and you can diagnose failures better than with all of them. The question is which. This trace reports success at normal speed, yet hides an error log inside. Fast samplers read only calls, status and latency, so they drop it. Samplers that do read logs turn every trace into a graph for a trained neural network, too slow for a live stream. Gleaner skips the graph: each trace becomes a set of event pairs, a call followed by a log line, so similar traces simply share pairs. Per API, alarms raise the quota, and a selector keeps traces both unusual and unlike each other. This trace's error log makes it stand out. On Gleaner's one percent, the RCA tool ShapleyIQ ranks the true root cause first 56 percent of the time; on every trace, 41. Chosen well, a sample does not just save storage. It improves the diagnosis.

## Checks

- Durations: 6 + 8 + 13 + 10 + 9 + 14 = 60 s.
- Silent strip: two bins → a trace with a red log → the trace dropped and queued → the trace as chips → the trace's dot kept in the pipeline → two bins with values. The story reads without sound.
- Sources: steps 1 and 6 Table 6 (highlights: Results 5); step 2 Fig. 1 (highlights: Challenge 2); step 3 Section 1, Table 1 (highlights: Challenge 2–3); step 4 Section 3.2 (highlights: Insight, Solution); step 5 Sections 3.3–3.4, Fig. 2 (highlights: Solution). "This trace's error log makes it stand out" rests on the anomaly score counting ERROR logs (highlights: Solution); the protagonist being kept is illustrative.
