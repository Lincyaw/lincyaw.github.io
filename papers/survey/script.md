# One-minute film: survey

Built with the presmium-animate story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `lengths.md`). Facts come from highlights.md, which is based on arXiv v1 of 2510.19593 (`source/`).

## A. Brief

- Kind: paper video, 60 s (55–60 s), narrated in English with no music. The video form matters most.
- Audience: engineers and researchers who know cloud incidents happen but have not followed RCA research.
- Before: "Root cause analysis is one task, and the papers differ mainly in the data they use."
- After: "RCA serves different goals, and across all of them the papers find points of an incident, never the path between them."
- Misconception to confront: grouping papers by data type (metrics, logs, traces) shows what they solve.
- Parts to name first: root cause, trigger, symptom (one incident).

## B. Claim

- Thesis: After watching, the viewer understands that **RCA papers find points of an incident, never its whole path**, because they saw 135 papers settle on the nodes of one incident graph while its edges stayed dark.
- ABT: An incident runs from a root cause through a trigger to the symptom engineers see, and 135 RCA papers try to explain it; **but** sorted by the data they use they look like one task, hiding that each serves a different goal; therefore the survey sorts them by goal on one incident graph, and the graph shows what none of them returns: the path.
- Pattern: **Menu** (survey) is the closest row in story.md's table: one lens, stops on the same map, then back to the map. It is adapted so that the lens is a single incident propagation graph, the stops are the goal groups placed around it, and the return to the map is the finding. A survey's contribution is a map of a field. Keeping one map lets the gap (the dark edges) be a property of the picture rather than a sentence. Seven separate stops would not fit in 60 s, so the goals appear as one ring around the map, not seven visits.
- The turn is at about 0:22, the "But": two papers from the same data bin fly to different nodes.

## C. Picture

- Central picture: the incident from Fig. 4 redrawn as a graph. Left to right: code change (root cause) → traffic surge (trigger) → out of memory (symptom) → error rate. Nodes are solid, edges are dashed and dark.
- Money frame: the 135 paper dots are piled on the nodes, most on the root cause, and every edge is still dark. The readout says "complete paths returned: 0 · Sec. 3.3".
- Readouts: the dot counter reads 135 (abstract). The donut uses Fig. 8 (Resource 56.9%), shown and not spoken. The dot distribution across nodes is illustrative and labelled "illustrative", because the paper gives no per-node counts.
- Spatial convention: the incident flows left to right from cause to symptom, and the papers always come in from above.
- Colours: red is the root cause, amber the trigger, grey-blue the symptom, ink for paper dots, and dark dashes for edges no paper returns.
- LOOK: light background, the graph's four nodes take 60% of the width, thin ink strokes, no glow. BANNED: three cards in a row, a list of the seven goals as text slides.

## Three storylines

1. **One incident as the map (recommended).** The OOM incident is the only stage. The papers arrive as dots, are first sorted wrongly into data bins, are re-sorted by goal around the graph, and settle on its nodes, leaving the edges dark. Shape: Menu on one map. First 2 s: a service running out of memory. It rules out separate scenes per goal. It is recommended because the claim (points, not the path) is visible in the final frame.
2. **Follow the incident (protagonist).** Follow one incident from the alarm back to the commit: first through an SRE's eyes (find the trigger, restore service), then a developer's (find the root cause, fix it). At the end, show that no paper walks the whole route. This is a vivid human frame, but it shows two goals out of seven and leaves the 135-paper map off screen.
3. **Split that becomes one (bold).** Left half: the 135 dots in three data bins, metrics, logs and traces. Right half: the same dots re-sorted by goal. The right half then folds into the incident graph. It dramatises the survey's method well, but its money frame is a sorting diagram rather than the gap.

## D. Storyboard (storyline 1)

Chapters: **One incident, 135 papers** 0:00 · **Same data, different goals** 0:16 · **Sorted by goal** 0:32 · **Points, not the path** 0:44

| # | Time | Rest frame | What moves (cause → effect) | Viewer now understands | Narration | Carries into the next |
|---|---|---|---|---|---|---|
| 1 | 0:00–0:16 | The four-node incident graph built from `figures/oom-propagation-chain.png` (Fig. 4): the leaking code line, the request surge and the memory curve shrink into the root-cause, trigger and symptom nodes; above it, 135 ink dots and "135 papers" | The memory curve rises to 100% → the symptom node lights; then the dots drop in from above | An incident is a chain; 135 papers try to recover it | "Here is an incident. A code change leaks memory, a surge of traffic sets it off, and a service runs out of memory. Root cause analysis should recover that whole chain. We read 135 papers that try, and none returns it whole." | The 135 dots |
| 2 | 0:16–0:22 | Three bins under the dimmed graph, "metrics", "logs", "traces", with the dots inside | Dots fall into the bins by data type | The usual way to sort RCA papers | "Sorted by the data they consume, metrics, logs or traces, they look like one task." | Two dots lifted from the same bin |
| 3 | 0:22–0:32 | The graph lit again; one dot on the trigger with an engineer icon and "restore", one on the root cause with a developer icon and "fix"; the request-surge and code crops from Fig. 4 beside them | The two dots from one bin fly apart to different nodes (the turn) | Same data, different goals | "But an engineer restoring service needs the trigger, the surge, while a developer fixing it for good needs the root cause, the leaking commit." | The bins dissolve; their dots rise |
| 4 | 0:32–0:44 | A ring of seven goal chips around the graph (data correlation, robustness, adaptive learning, real-time, interpretability, multi-granularity, actionability); in a corner a small triangle Effectiveness–Data–Cost | Dots stream from the dissolved bins into the chips, one chip at a time; then a dot slides along one edge of the triangle | The survey's lens: seven goals, each a trade-off along one edge | "So we sorted the papers by goal: seven of them, from correlating data to acting on a diagnosis. Each pushes one edge of a trade-off between effectiveness, data and cost." | Dots leave the chips toward the graph |
| 5 | 0:44–0:53 | Money frame: dots piled on the nodes, tallest on the root cause, edges still dashed and dark; "complete paths: 0"; small donut from `figures/root-cause-type-distribution.png` (Fig. 8) with Resource 56.9% | Dots land on nodes (most on the root cause), then the edges flash once and stay dark | Papers find points, mostly the root cause, mostly resource faults | "On the incident, the papers gather on single points, mostly the root cause, and over half of the causes they study are resource faults." | The dark edges |
| 6 | 0:53–1:00 (hold 4 s) | The graph with dark edges, one edge drawn as a "?" path; title, arXiv 2510.19593 | The "?" path traces from root cause to symptom, then holds | The one thing to remember | "The path between the points is still missing. Building it is the next step." | End card |

Shot lengths are 16, 6, 10, 12, 9 and 7 s. Beat 2 is a quick sort, beat 3 the turn, beat 5 the payoff, and the final frame holds for 4 s.

## E. Narration and checks

Narration as one story:

> Here is an incident. A code change leaks memory, a surge of traffic sets it off, and a service runs out of memory. Root cause analysis should recover that whole chain. We read 135 papers that try, and none returns it whole. Sorted by the data they consume, metrics, logs or traces, they look like one task. But an engineer restoring service needs the trigger, the surge, while a developer fixing it for good needs the root cause, the leaking commit. So we sorted the papers by goal: seven of them, from correlating data to acting on a diagnosis. Each pushes one edge of a trade-off between effectiveness, data and cost. On the incident, the papers gather on single points, mostly the root cause, and over half of the causes they study are resource faults. The path between the points is still missing. Building it is the next step.

- **Word count:** 149 words (`wc -w`), about 2.5 words a second, so it fits 60 s with the final hold.
- **Spoken numbers:** 135 (abstract; Sec. 4.2). "Seven" is the taxonomy's size (Solution). "Over half" stands for 56.9% (Fig. 8), which is shown on screen and not spoken.
- **Where each claim comes from in highlights.md:** the OOM chain and the roles (Solution, Fig. 4), "none returns it whole" (Results bullet 2), sorting by data type (Challenge bullet 3), trigger vs root cause (Challenge bullet 1), the seven goals and the triangle (Solution, Insight), "mostly the root cause" (Findings bullet 1), resource faults (Results bullet 3), "the next step" (Findings bullet 1, "graph-building").
- **Still to do:** the thumbnail strip, read-aloud timing and cold-viewer review happen at the animatic stage.
