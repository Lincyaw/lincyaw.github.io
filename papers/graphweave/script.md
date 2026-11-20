# GraphWeave — one-minute film plan

Built with the presmium-animate story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `references/lengths.md`) and the launch event principle. Fact source: `highlights.md`.

## Brief

- **Kind:** paper video, 62.5 s, 16:9, **music only, no voice**: the pictures and one short on-screen line per step carry the story. Music: "Bit Shift" by Kevin MacLeod (incompetech.com, CC BY 4.0), from 1.34 s of the track, so its bar lines (130 BPM, a bar every 1.846 s) fall on the step boundaries.
- **Audience:** engineers and researchers who know what a database query and a test oracle are; they have not used graph-database testers.
- **Before → after:** "more testing methods find more bugs" → "run together, testers mostly report noise and many of their tests cannot fail; filter the reports by learned rules and skip query pairs the optimizer makes identical, and the combination finds bugs no single tester finds."
- **Parts to name first:** the report, the false positive (both systems are right), the plan. "Process-level data", "metamorphic relation" and "oracle" are never on screen; the pictures show a query pair and its plans.

## Thesis

**After watching, the viewer understands that integrated graph-database testing has two blind spots (reports that are mostly false or duplicate, and query pairs the optimizer compiles to one plan) and that GraphWeave removes both, because they saw 4,114 reports turn red, two rewritten queries collapse into one plan, and eight testers' bugs merge into 19 confirmed ones.**

**ABT:** Graph databases have many automated testers, and running them together should find more bugs; **but** together they produce thousands of reports that are mostly false positives or duplicates, and many of their query pairs compile to the same plan and can never disagree; **therefore** GraphWeave turns analysed reports into gate and adapter rules and skips same-plan pairs, and on NeuG it finds 19 previously unknown bugs, all confirmed.

## Pattern

**Claim on trial, then the fix** (story.md: "an empirical, analysis or negative-result paper", followed by the mechanism of the system that answers it). The paper is first a study (two blind spots) and then a platform. The film opens on the study's most striking object, the flood of 4,114 reports, as a puzzle ("this many bugs in mature databases?"), shows the two causes on the paper's own minimal examples, then shows GraphWeave acting on the same objects, and ends on the NeuG result.

## Three storylines

1. **The flood and its two leaks (recommended).** Shape: a chain. The report pile (a waffle of squares) → one red square opened up as the self-loop query that two databases answer differently and correctly → the pile's other leak, a query pair whose two plans slide into one → GraphWeave's pipeline eating the pile and its triage stopping the pair → eight bars merging into 19. Form: a chain of five shots joined by bare cuts (one section each), held together by one colour code and recurring objects (the report, the query card, the plan, the pair). First 2 s: eight tester tiles wiring into three databases, squares starting to pile up. Rules out: the unified execute(S, Q, t) model and the semantic-constraint table, which go to the page.
2. **One report's life.** Shape: follow the protagonist. A single report travels from a tester through the gate, a cluster, the agents and back as a rule, while the counters around it show the scale. Form: one continuous take on the report. First 2 s: one square leaving a tester. Rules out: the plan-collapse blind spot, which a report's journey never meets (same-plan pairs produce no report at all).
3. **The silent test (bold).** Shape: puzzle → reframe. Open on two queries that agree and a test that passes; reveal that they share one plan, so the pass meant nothing; zoom out to 5–34% of all pairs; only then the noisy side. Form: one frame that rebuilds itself. First 2 s: two queries returning 500 and 500 with a green tick. Rules out: the report flood as the hook, the paper's first and largest finding.

**Chosen: 1.** The paper's abstract leads with the flood, and both of its minimal examples (Fig. 2's self-loop, Fig. 6's direction reversal) are small enough to read in a glance. The turn falls at 0:26 (41%): two different query texts slide into one plan; the turn is two pictures becoming one.

- **Spatial convention:** left = what goes in (testers, queries, raw reports), right = what comes out (reports, plans, verdicts).
- **One meaning per colour:** purple `#5b4b99` (the Testing & analysis thread) = GraphWeave and the real bugs it keeps; red `#b93a0b` = false positives and tests that cannot fail; ink on paper for everything else, muted grey for duplicates and skipped pairs.
- **Misconception to confront:** "if two databases disagree, one of them has a bug" → both can be right.
- **Captions:** one line per step, concrete, in the domain's words; numbers come from the pictures (the waffle's squares are reports, the bars' lengths are the bug counts).

## Chapters

| # | Chapter | Start | Section id |
|---|---|---|---|
| 1 | Four thousand reports | 0:00 | `four-thousand-reports` |
| 2 | Both answers are right | 0:13 | `both-answers-are-right` |
| 3 | Two queries, one plan | 0:26 | `two-queries-one-plan` |
| 4 | Learned rules, skipped pairs | 0:39 | `learned-rules-skipped-pairs` |
| 5 | Nineteen bugs in NeuG | 0:52 | `nineteen-bugs-in-neug` |

## Storyboard

Step boundaries sit on the track's bar lines (film time = track time − 1.34 s; bar k at 0.05 + 1.8464 k s): 7.436, 12.975, 20.36, 25.9, 33.285, 38.824, 46.21, 51.749, 57.288 s; the end card holds to 62.5 s. The track changes section at 27.75 s (the plans merge one bar later) and at 57.29 s (the end card).

### 1 · Four thousand reports — 0:00–0:13

- **Step `flood` (0–7.44 s). Rest frame:** left, a column of eight tester tiles (GDsmith, GDBMeter, Gamera, GraphGenie, GraspDB, GRev, GSlicer, Dinkel); middle, three database boxes (Neo4j, Memgraph, FalkorDB) each "12 h per tester"; right, a waffle of 412 squares (1 square = 10 reports) and a counter at 4,114. Source "Paper, Table 2".
- **What moves:** wires draw from the testers to the databases and from the databases into the pile; squares pour into the waffle row by row as the counter rolls to 4,114.
- **Caption:** "Eight testers, 12 h on three mature databases: 4,114 reports"
- **Step `split` (7.44–12.98 s). Rest frame:** 314 of the squares turn red, "3,136 false positives (76%)"; under the waffle a single bar for GraphGenie on FalkorDB: 527 reports, 249 red and 278 grey under a bracket "all one bug".
- **Caption:** "76% are false positives; most of the rest are duplicates"
- **Into 2:** a bare cut (each chapter is one section, and a section change is a cut); the red of the false positives is the red of the next chapter's verdict.

### 2 · Both answers are right — 0:13–0:26

- **Step `reuse` (12.98–20.36 s). Rest frame:** top, the query `MATCH (n0:L1)-[:T4]-()-[:T4]-() RETURN 1 AS a7`; left, the graph: one node `n0:L1` with one self-loop `T4`; right, two panels. FalkorDB, "edge reuse allowed": slots ① and ② both bind the self-loop → 1 row. Neo4j, "edge reuse not allowed": slot ② stays empty → 0 rows. A red line "1 ≠ 0 → a differential tester reports a bug", then a red box "both rules are legal: a false positive". Source "Paper, Fig. 2".
- **What moves:** the query types on; the self-loop draws; the slots bind to the edge one after the other (Neo4j's second slot gets a red ✗); the row counts land; the "reports a bug" line appears, then the false-positive box.
- **Caption:** "One self-loop, two legal rules: 1 row and 0 rows, both right"
- **Step `dialect` (20.36–25.9 s). Rest frame:** the same two panels and query card, now holding a second case; the graph gives way to a note "same intent, two spellings"; the query becomes `MATCH (a)-[r]->(b) WITH * RETURN a, b`: Neo4j accepts, FalkorDB rejects; the adapted query `WITH a, r, b` is accepted by both, so the rejection is a dialect false positive. Source "Paper, Fig. 1a".
- **Caption:** "Or the database spells the same query differently"
- **Into 3:** a bare cut; the query card at the top becomes two query cards.

### 3 · Two queries, one plan — 0:26–0:39 (the turn)

- **Step `collapse` (25.9–33.29 s). Rest frame:** two query cards side by side, source `MATCH (a:A)-[:R]->(b:B) RETURN count(*)` and its rewrite `MATCH (b:B)<-[:R]-(a:A) WHERE true RETURN count(*)`; under each its Neo4j plan of five operators (NodeByLabelScan a:A → Expand(All) → Filter b:B → EagerAggregation → ProduceResults); the two plans slide together into one, "same plan"; the merged plan turns red, under it both results, 500 = 500, with "equal by construction: the pair cannot disagree"; a red marker "a bug here?" on Expand(All) and "even when the shared plan is wrong". Source "Paper, Fig. 6".
- **What moves:** the rewrite's differences flash; each plan stacks from its scan upward; on the bar after the music changes the plans merge; the results land; the red mark lands.
- **Caption:** "A rewrite compiled to the same plan can never disagree"
- **Step `ratios` (33.29–38.82 s). Rest frame:** a dot chart of same-plan ratios, four testers by three databases (Table 5), all inside a red band from 5% to 34%. Source "Paper, Table 5 · 5,000 pairs per run, 3 runs".
- **Caption:** "5–34% of each tester's equivalent pairs share one plan"
- **Into 4:** a bare cut; the same-plan pair returns in the triage step, where it is skipped.

### 4 · Learned rules, skipped pairs — 0:39–0:52

- **Step `rules` (38.82–46.21 s). Rest frame:** GraphWeave's pipeline in purple: 26 report squares (Batch #1) at the left → issue gate (13 filtered as known issues) → 3 clusters → agents (coordinator, splitting, deep analysis, rules synthesis) → 4 outcomes: 2 adapter rules, 1 gate rule, 1 bug. Feedback arrows carry the adapter rules back to the target adapter and the gate rule back to the gate. Readout "26 reports → 4 to inspect (84.6% less)". Source "Paper, Fig. 9, Table 6 · Batch #1 on NeuG".
- **Caption:** "GraphWeave's agents turn each cluster of reports into a rule"
- **Step `triage` (46.21–51.75 s). Rest frame:** three query pairs each go through `EXPLAIN` first: same plan → skipped, never executed (the pair greyed and struck through); different plans, same result → kept as a possible performance issue; different plans, different results → candidate bug (purple). The plan sketches are labelled illustrative.
- **Caption:** "Before running a pair, compare plans; same plan: skip it"
- **Into 5:** a bare cut; the purple "candidate bug" becomes the purple GraphWeave bar.

### 5 · Nineteen bugs in NeuG — 0:52–1:02

- **Step `bugs` (51.75–57.29 s). Rest frame:** eight bars of unique bugs found on NeuG by each tester (GDsmith 2, GraphGenie 3, GRev 2, GraspDB 4, Dinkel 9, Gamera 2, GSlicer 3, GDBMeter 3), and a purple total bar of 19 with "all 19 confirmed · 13 fixed". Source "Paper, Fig. 10 · NeuG 0.1.1".
- **Caption:** "On NeuG no tester finds more than 9; together, 19 new bugs"
- **Step `end` (57.29–62.5 s, held). Rest frame:** the chart dims under the end card: "Filter reports with learned rules. Skip the pairs that share a plan." Then the title, "Li, **Fang**, Lai, Xie, Zhao, Shao, Zhang, He · arXiv 2026", "arxiv.org/abs/2611.07754".
- **Caption:** none; the end card is the line to remember.

## Narration

Kept for a later voiced cut (the film plays with music only). 146 words.

> Run eight graph database testers for twelve hours on three mature databases, and they file four thousand one hundred reports. Three in four are false positives, and most of the rest repeat the same bug. Here is one: a graph with a single self-loop. FalkorDB lets one edge fill two slots and returns a row; Neo4j forbids it and returns none. Both are right. Others are only dialect differences. The second blind spot is quieter. A rewritten query should take a different path, but the optimizer compiles both to the same plan, so the pair can never disagree. Five to thirty-four percent of pairs are like this. GraphWeave lets agents turn each cluster of reports into a rule, for the adapter or for the gate, and skips any pair whose plans match. On NeuG, a new industrial graph database, it found nineteen unknown bugs, all confirmed.

## Checks

- Durations: 7.436 + 5.539 + 7.385 + 5.54 + 7.385 + 5.539 + 7.386 + 5.539 + 5.539 + 5.212 = 62.5 s; the end card holds 5.2 s.
- Thumbnail strip (no sound): a waffle of reports mostly red → one self-loop with two different row counts → two plans merged into one → a purple pipeline with rules flying back → bars merging into 19. Reads as "flood of reports → they are false → tests that cannot fail → GraphWeave filters and skips → 19 bugs".
- Every claim maps to `highlights.md`: 4,114 / 3,136 / GraphGenie 527-249-278 (Findings 1–2), the self-loop and `WITH *` cases (Findings 3–4), the direction-reversal collapse and Table 5 (Finding 6), the pipeline, feedback channels and Batch #1 (Solution, Results), the triage (Solution), NeuG per-method counts, 19 confirmed and 13 fixed (Results).
