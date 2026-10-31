# One-minute film: fse26

Built with the presmium-animate story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `lengths.md`). Facts come from highlights.md. Numbers were checked against the latest arXiv version of 2510.04711 (23 Dec 2025, saved in `source/arxiv-pdf/`), whose abstract, Tables 2, 3 and 5 and figure numbers match the FSE text.

## A. Brief

- Kind: paper video, 60 s (55–60 s), narrated in English with no music. The video form matters most.
- Audience: software engineers and SRE-minded researchers who have heard of AIOps but have not read RCA papers.
- Before: "RCA models score well on public benchmarks, so they work."
- After: "Those scores came from benchmarks where the cause is the loudest service; when faults spread, the models mostly miss."
- Misconception to confront: a high benchmark score means the model follows a failure to its source.
- Parts to name first: a service, its alerts, the injected fault.

## B. Claim

- Thesis: After watching, the viewer understands that **RCA scores were inflated by benchmarks where the cause is the loudest service**, because they saw an alert-counting pointer land on the right service in the old benchmarks and on the wrong one once faults spread.
- ABT: RCA models read metrics, logs and traces to name the faulty service, and they score well on public benchmarks; **but** a rule that just blames the service with the most alerts scores as well, because there the fault stays where it was injected; therefore we built a benchmark where failures spread, and on it the models average 0.21 Top@1.
- Pattern: **Gap → instrument → finding** (benchmark paper): what existing data can't answer (does a model follow a spreading failure?) → the new benchmark and why to trust how it was made → what models do on it.
- The turn is at about 0:33, when the injected fault starts to spread across the graph instead of staying put.

## C. Picture

- Central picture: one service graph (12 nodes, left two-thirds of the frame). The injected fault is a red ring on one node. Each node's loudness is a stack of alert pips. A blue pointer, "blame the loudest", always moves to the node with the tallest stack.
- Money frame: the fault has spread. The tallest pip stack sits two hops downstream, the pointer rests on it, and the red ring is elsewhere. Beside it the readout says "average Top@1 0.21 · Table 5".
- Readouts: the 737-case grid fills to 86% (Table 3), the case counter reads 1,430 (abstract), the model bars come from Table 5 and the average line sits at 0.21 (abstract, Table 5).
- Spatial convention: the graph is always on the left, numbers on the right, and up is better.
- Colours: red is the injected cause, amber is alert loudness, blue is the pointer (the model's answer), grey is everything else.
- LOOK: light paper background, one sans family, the graph drawn with 2 px strokes, no glow, no particles. BANNED: dark void with glow, three cards in a row, KPI grid.

## Three storylines

1. **The pointer's journey (recommended).** One element, the "blame the loudest" pointer, crosses the whole film. In the old benchmarks it is right because the fault stays local (real Fig. 2 panels). In the new benchmark the fault spreads and the pointer lands on the wrong service, and the model bars fall beside it. Shape: Gap → instrument → finding in one continuous graph. First 2 s: the graph with one node raising alerts. This rules out a results-first number card. It is recommended because the turn (the cause stops being the loudest node) is a change in the picture, not a sentence.
2. **Result-first reveal.** Open on 0.21 rolling down from the high published scores, then go back to explain why the old scores were high and how the new benchmark was made. It hooks fast but spends the turn at the start, so the "why" arrives as an explanation instead of a picture.
3. **Split that becomes one (bold).** Left half shows an old benchmark and right half the new one. The same fault is injected in both at the same moment: on the left it stays put, on the right it spreads. The halves then merge into one scoreboard. This is strong visually, but it needs two graphs on screen for 40 s and leaves no room for how the benchmark was built.

## D. Storyboard (storyline 1)

Chapters: **Who gets blamed?** 0:00 · **The shortcut** 0:13 · **Faults that travel** 0:33 · **The scores fall** 0:46

| # | Time | Rest frame | What moves (cause → effect) | Viewer now understands | Narration | Carries into the next |
|---|---|---|---|---|---|---|
| 1 | 0:00–0:13 | The service graph, one node with a red ring and a tall amber pip stack; the blue pointer hovering with "?" | Alerts tick up on the faulty node; the pointer drifts toward it | A failure starts in one service; models must name it | "When a microservice system fails, root cause analysis models read its metrics, logs and traces to name the service that started it. Do they find the cause, or just the loudest service?" | The pointer |
| 2 | 0:13–0:21 | The pointer on the tallest stack (correct); right side, two bars for Nezha-TT, "Nezha 0.87" and "alert rule 0.93", tagged "Table 2" | The pointer snaps to the tallest stack, then the two bars grow together | A crude rule matches published models | "On public benchmarks, a crude rule does as well as they do: blame whichever service raises the most alerts." | The faulty node expands into the Fig. 2 panels |
| 3 | 0:21–0:33 | `figures/symptom-only-at-injected-service.png` (Fig. 2): spikes only in the injected services, flat elsewhere; right side, a 737-dot grid with 86% filled, "Table 3" | Panels reveal left to right; then the grid fills to 86% | Why the rule wins: the cause is the loudest (or nothing is) | "It works because in 86 percent of benchmark cases the fault is loud only where it was injected, or barely shows at all. Following a failure as it spreads is rarely tested." | The panels fold back into the graph's nodes |
| 4 | 0:33–0:46 | The same graph, now TrainTicket-sized, with red spreading along two edges downstream and amber stacks growing far from the cause; small inset `figures/benchmark-pipeline.png` (Fig. 3); counter "1,430 cases · abstract" | Inject: red travels edge by edge (the turn); the inset's Validator lights and the case counter settles at 1,430 | The new benchmark makes faults spread and keeps only user-felt failures | "So we built one where failures do spread. On a fifty-service ticketing system under shifting traffic, we injected thirty-one kinds of fault. We kept only the failures users could feel: 1,430." | The pointer returns |
| 5 | 0:46–0:56 | Money frame: the pointer on the loudest downstream node while the red ring sits elsewhere; right side, 11 model bars from Table 5 with a dashed average line at 0.21; the alert-rule bar marked | The pointer jumps to the loudest node (wrong); then the bars drop from their old height to their Table 5 values and the average line draws | Once the cause is not the loudest, models mostly miss | "Eleven state-of-the-art models, on average, name the right service first just 21 percent of the time, and the alert rule falls apart too." | The average line and the graph stay |
| 6 | 0:56–1:00 (hold 4 s) | The money frame dimmed; "0.21" large; title, FSE 2026, arXiv 2510.04711 | Title fades up under the held frame | The one thing to remember | "Progress in root cause analysis has to be measured where failures travel." | End card |

Shot lengths are 13, 8, 12, 13, 10 and 4 s. Beats 1, 4 and 5 move in the graph, beat 3 is a still figure, and beat 6 is a hold.

## E. Narration and checks

Narration as one story:

> When a microservice system fails, root cause analysis models read its metrics, logs and traces to name the service that started it. Do they find the cause, or just the loudest service? On public benchmarks, a crude rule does as well as they do: blame whichever service raises the most alerts. It works because in 86 percent of benchmark cases the fault is loud only where it was injected, or barely shows at all. Following a failure as it spreads is rarely tested. So we built one where failures do spread. On a fifty-service ticketing system under shifting traffic, we injected thirty-one kinds of fault. We kept only the failures users could feel: 1,430. Eleven state-of-the-art models, on average, name the right service first just 21 percent of the time, and the alert rule falls apart too. Progress in root cause analysis has to be measured where failures travel.

- **Word count:** 149 words (`wc -w`), about 2.5 words a second, so it fits 60 s with the final hold.
- **Spoken numbers:** 86% (Table 3), 1,430 (abstract), 21% = 0.21 (abstract; Table 5). "Fifty-service" and "thirty-one kinds" are descriptive counts (Solution in highlights.md). Everything else is shown, not said: Table 2 bars, Table 5 bars, SimpleRCA 0.28.
- **Where each claim comes from in highlights.md:** models and benchmarks (Task, Challenge bullet 1), 86% (Findings bullet 1, Insight), "rarely tested" (Insight), the benchmark (Solution), 0.21 and "alert rule falls apart" (Results bullet 1: SimpleRCA 0.28), the closing line (Insight, second sentence).
- **Still to do:** the thumbnail strip, read-aloud timing and cold-viewer review happen at the animatic stage.

## The music cut (current film)

For now the film has no voice. Each step is held for a fixed time, and one track plays across the whole film: “Investigations” by Kevin MacLeod (incompetech.com, CC BY 4.0), cut to 60.5 s in `audio/score.ogg`, with one media clip per step. The narration above stays in `lecture.json` for a later voiced cut. Without a voice, each scene state shows one line at the top left that carries the story:

| Starts | Section | State | Hold | Line on screen |
|---|---|---|---|---|
| 0.0 s | who-gets-blamed | step-0 | 8.0 s | A failure starts in one service |
| 8.0 s | who-gets-blamed | step-1 | 5.0 s | Which service will the model blame? |
| 13.0 s | the-shortcut | step-0 | 7.0 s | On public benchmarks, counting alerts is enough |
| 20.0 s | the-shortcut | step-1 | 11.0 s | (none: Fig. 2 and the 86% grid) |
| 31.0 s | faults-that-travel | step-0 | 9.5 s | Our benchmark: faults spread to other services |
| 40.5 s | faults-that-travel | step-1 | 5.0 s | Kept: only failures users could feel |
| 45.5 s | the-scores-fall | step-0 | 9.0 s | Now the loudest service is not the cause |
| 54.5 s | the-scores-fall | step-1 | 6.0 s | (none: end card, 0.21) |
