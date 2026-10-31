# DynaCausal: one-minute film plan

Built with the Presmium `presmium-animate` story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `references/lengths.md`). Facts come from `highlights.md`; numbers come from the arXiv version (2510.22613).

## A. Brief

- **Kind:** paper video (explainer), 60 s, video first; the rest frames also serve as the paper page's stills.
- **Audience:** software-engineering and operations people who know microservices and alerts but not RCA models.
- **Before:** the service that looks most abnormal is the one that broke.
- **After:** in a cascade the loudest service is often a victim; the root cause is found by following how the fault spreads.
- **Misconception to confront:** loudest = culprit. The viewer is asked to guess first (predict, then observe).
- **Parts to name first:** a service, an alarm, the call graph. "Root cause" is named only after the reveal.
- **Assumptions:** 16:9, narration with no music, no paid assets.

## B. Thesis

**After watching, the viewer understands** that the service that started a failure is often quieter than its victims, so you find it by following the fault, **because they saw** the loudest services in a real fault case turn out to be victims, and the same graph, with live traffic on its edges, trace the fault back to the quiet source.

**And–But–Therefore:** Microservice faults cascade through calls, AND root cause models rank services by how abnormal they look; BUT the culprit is often quieter than its victims (checkoutservice vs paymentservice, Figure 2); THEREFORE DynaCausal follows the fault over a call graph rebuilt each time window and trains the source to outrank everything it affected.

## C. Pattern, storylines, choice

**Pattern: mechanism walk** (story.md table: a method paper, 1–5 min; one example through the pipeline, the baselines named in the same view). Result-first would open on "AC@1 0.63", a number this audience has no way to feel. The paper's argument rests on a misconception, and its own fault case (Figure 2) is the one picture that makes "loudest ≠ cause" visible. So one example goes through the film and the number arrives once it means something. The opening is puzzle-first, which the 60 s guidance allows.

Three storylines:

1. **The loudest suspect** (recommended). *Form:* one frame rebuilds itself, the same service graph throughout. *First 2 s:* alarms flare on the graph. Beats: guess who broke it → the loud ones are victims and two leading models guessed the same → the edges come alive and the fault is traced upstream → the source rises to rank 1 → Train-Ticket bars, then 0.63. *Rules out:* architecture diagrams as the main picture.
2. **Its own normal.** *Form:* a split screen that becomes one. One service's metric in its normal week on the left and during the fault on the right. A service that is always noisy (currencyservice) is shown to be harmless; the two halves merge into the contrastive idea. Strong on TCD but leaves out propagation, which is the paper's first insight.
3. **The frozen map** (bold). *Form:* a camera move through time. Call-graph snapshots stack like film frames, and the fault shows only as edges thicken from window to window. Freezing the map to one static frame drops Train-Ticket AC@1 from 0.481 to 0.395 (Table 2). Strong on the dynamic graph, but it turns on an ablation, which this audience can't anchor.

**Chosen: 1.** It is the only one in which the thesis becomes a visible property that changes: where the loudness is versus where the arrows start.

- **Turn:** at 0:25 (42%). The picture stops encoding loudness (node glow) and starts encoding flow (edge pulses).
- **Spatial convention:** upstream left, downstream right; higher rank is higher up.
- **Colour:** red means alarm or loudness; accent means the root cause and DynaCausal; grey means the baselines.
- **Central picture:** a small call graph of the five services from Figure 2b, with node glow = how abnormal a service looks and edge thickness = live request count + error rate. The topology is illustrative and labelled 示意; the services, the fault and the scores are the paper's.
- **Money frame (end of chapter 2):** paymentservice and adservice glowing red and largest, "ART" and "Eadro" tags pinned on paymentservice, checkoutservice small at the left with a thin accent ring.

## D. Chapters

| # | Chapter | Start | Duration |
|---|---------|-------|----------|
| 1 | Which service broke? | 0:00 | 10 s |
| 2 | The loudest are victims | 0:10 | 15 s |
| 3 | Follow the fault upstream | 0:25 | 16 s |
| 4 | Where to look first | 0:41 | 19 s (ends 1:00, title card held 4 s) |

## E. Storyboard

| # | Time | Rest frame | What moves (cause → effect) | Viewer now understands | Carries into the next |
|---|------|-----------|------------------------------|------------------------|-----------------------|
| 1 | 0:00–0:10 | The graph with five labelled services; paymentservice and adservice glowing red and large, checkoutservice dim; a held "?" over the graph | A delay marker drops near checkout (unlabelled); alarm glows spread and swell on payment and ads | Something broke, and two services look worst | The graph and its glows stay; the "?" becomes the ring that lands on checkout |
| 2 | 0:10–0:25 | Money frame: checkout ringed in accent ("root cause"), its latency strip from Figure 2a beside it (~0.2 s → ~4.8 s); payment and ads still red; Figure 2b score pairs pinned beside the nodes: payment 0.89 / 0.94, checkout 0.85 / 0.92; "ART · Eadro" tags on payment | The ring lands on checkout first (cause); then the tags pin onto payment (effect: the models' choice); the scores roll up beside each node | The loud services are reacting; the models rank by loudness, so they miss the source | The same graph: the red glows drain away and the edges begin to pulse |
| 3 | 0:25–0:41 | The graph with no glow; edges drawn by thickness across three stacked time windows; an accent pulse path from checkout to payment and email; a five-row rank ladder at the right with checkout at the top (labelled 示意: the training objective, not a reported case) | Edges re-weight window by window; a pulse runs from the victims back along the edges to checkout; the ladder rows swap and checkout rises to rank 1 | Reading flow instead of loudness leads back to the source; training is what makes the source rank first | The ladder's top bar slides out and becomes the accent bar of the chart |
| 4 | 0:41–1:00 | Horizontal bar chart, Train-Ticket AC@1 (Table 1): MicroRank 0.013, Nezha 0.092, ART 0.176, Baro 0.263, Eadro 0.301 (grey, tag "static graph"), DynaCausal 0.481 (accent, tag "dynamic graph"); then the counter "average AC@1 0.63" (abstract) large in the centre; title card | Grey bars grow first and Eadro's stops; the accent bar keeps growing past it; the chart folds into the corner and the 0.63 counter rises; the cast gathers into the title card | How often the first suspect is the real one, and why the moving map makes the difference | End card (arXiv 2510.22613), held 4 s |

## F. Script

Narration: 147 words (counted with `wc -w`). Numbers spoken: 48% and 30% (Train-Ticket AC@1 0.481 and 0.301, Table 1) and 0.63 (average AC@1, abstract). Each line is backed by `highlights.md`: Challenge for chapters 1–2, Solution and Insight for chapter 3, Results and Findings (static graph) for chapter 4.

**1 · Which service broke? (0:00)**
Inject a network delay into an online shop, and alarms fire across its services. Payment and ads swing hardest. So which one broke? *(1.5 s silence, the "?" held)*

**2 · The loudest are victims (0:10)**
Neither. The delay hit checkout, which only slowed down; the others were reacting to it. Leading models ART and Eadro make the same guess: they rank services by how abnormal they look. In a cascade, the loudest service is often a victim.

**3 · Follow the fault upstream (0:25)**
DynaCausal ranks by cause instead. It redraws the call graph every time window, weighting each call by live request count and error rate, so a graph network can trace the fault upstream. Training pushes the source above every service it affected.

**4 · Where to look first (0:41)**
On Train-Ticket, the true root cause comes first in 48 percent of cases, up from 30 for Eadro, whose graph never changes. Across both benchmarks, the average is 0.63: the first service you check is more often where the cascade started.

**On-screen text** (one line at a time, ≤ 8 words): 1 "Which one broke?" · 2 "root cause" (a label on the ring) · 3 "示意 · training objective" (a label on the ladder) · 4 "Train-Ticket AC@1 · Table 1", then "average AC@1 0.63".

## G. Checks

- **Durations:** 10 + 15 + 16 + 19 = 60 s. At about 2.6 words a second, 147 words take about 57 s, leaving the 1.5 s silence and the 4 s end hold.
- **Thumbnail strip, no sound:** graph with "?" → ring on the quiet node and tags on the loud one → arrows back to the ring and the ladder → bars and 0.63.
- **No invented facts:** DynaCausal's own ranking on the Figure 2 case is not reported, so chapter 3's ladder is labelled illustrative. The edges between the five services are labelled 示意.
