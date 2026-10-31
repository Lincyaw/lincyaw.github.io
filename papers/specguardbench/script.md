# SpecGuardBench — one-minute film plan

Built with the presmium-animate story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `references/lengths.md`) and the launch event principle. Fact source: `highlights.md`.

## Brief

- **Kind:** paper video, 62 s, 16:9, **music only, no voice**: the pictures and one short on-screen line per step carry the story. Music: "Spy Glass" by Kevin MacLeod (incompetech.com, CC BY 4.0), from 0.35 s of the track, so its stabs fall on the step boundaries.
- **Audience:** engineers and researchers who use coding agents and trust passing tests; they have not read about specification faithfulness.
- **Before → after:** "if an agent's tests catch the bug, the tests are good" → "a check is only trustworthy if it also accepts correct code that differs from the reference; today's agents write checks that copy the reference."
- **Parts to name first:** the rule (one sentence of a docstring), the gold version and a violating version of the code, the check. "Validation harness" is never on screen; the picture shows scenarios and a check.

## Thesis

**After watching, the viewer understands that coding agents write checks that follow the reference code rather than the specification, because they saw a check reject a correct variant, and every agent's score fall when the reference it was shown was the violating version.**

**ABT:** Coding agents are judged by tests, and agents now write those tests from a natural language specification; **but** a check can assert what the reference code happens to do instead of what the specification requires, rejecting correct code and following buggy code; **therefore** SpecGuardBench judges each agent's checks on three implementations (gold, a violation the original tests miss, a valid alternative), and no agent is faithful on more than 63% of tasks.

## Pattern

**Gap → instrument → finding** (story.md: "a benchmark or dataset paper"), opened on a concrete case and a question (the 60 s guidance: "ABT, puzzle first"). SpecGuardBench is a benchmark: the viewer must first see what existing tests miss (the gap: the original suite passes a violating version), then trust the instrument (three implementations, one verdict), then the finding. A result-first opening would put "63%" on screen before the viewer knows what "faithful" means; the astropy case gives a real, small puzzle the viewer can check by eye.

## Three storylines

1. **One rule, followed through (recommended).** Shape: a chain on the paper's own example task (Appendix B, astropy `default_cosmology.validate`). The rule card and two versions of the code → the agent's scenarios and check → the check as a gate the three implementations pass through → four agents' bars → the reference swapped for the violating version. Form: a chain; each chapter's last object is the next one's first (the rule card becomes the agent's input; the check becomes the gate; the verdict stamps become the first bar; the violation card from 0:00 comes back as the reference). First 2 s: the rule sentence with its two code versions side by side. Rules out: the pipeline that builds the tasks (decomposition, witnesses, LLM judges), which goes to the page.
2. **The stencil.** Shape: one element transforming. A check is a stencil cut to fit; an agent traces its stencil around the reference instead of cutting it from the rule, so a correct but differently shaped implementation does not fit. Form: one continuous take on the stencil. First 2 s: a stencil traced around a code block. Rules out: the real code; the metaphor breaks where checks are executable (a check runs code, it does not compare shapes), which would need its own beat.
3. **Scoreboard first (bold).** Shape: result-first reveal. Open on four detection bars at 66–82% that look healthy, then the false alarms slice each bar down below 63%, then rewind to show one false alarm happening. Form: one chart that rebuilds itself. First 2 s: four bars rising. Rules out: the concrete case at the start; the viewer reads numbers before knowing what a false alarm is.

**Chosen: 1.** The paper's real task is small enough to read in a glance (one sentence, one changed line), it shows the gap with the original tests, and the violating version it introduces is the same object the last chapter hands to the agents as reference. The turn falls at 0:30 (48%): a correct variant arrives at the gate and an over-asserting check rejects it; the turn is a red stamp on correct code.

- **Spatial convention:** left = what the agent is given (rule, code), right = what its checks decide; in charts, right = more tasks.
- **One meaning per colour:** red `#b93a0b` = the violating version and wrong verdicts; teal `#0f766e` (the LLM agents thread) = what the agent wrote (scenarios, check) and its correct verdicts; ink on paper for everything else.
- **Misconception to confront:** "a check that catches the bug is a good check" → detection without false alarms is what counts.
- **Captions:** one line per step, concrete, in the domain's words; no number without the picture that produced it (1, 0, 2.5 are the scenario chips; bar lengths carry the percentages; the 63% is a line through the bars; 19–31 are the dumbbells' lengths).

## Chapters

| # | Chapter | Start | Section id |
|---|---|---|---|
| 1 | Tests pass, the rule breaks | 0:00 | `tests-pass-the-rule-breaks` |
| 2 | An agent writes the checks | 0:13 | `an-agent-writes-the-checks` |
| 3 | Three implementations, one verdict | 0:26 | `three-implementations-one-verdict` |
| 4 | Detection is not faithfulness | 0:39 | `detection-is-not-faithfulness` |
| 5 | Shown the wrong code | 0:51 | `shown-the-wrong-code` |

## Storyboard

Step boundaries sit on the track's stabs (film time = track time − 0.35 s): 8.75, 13.15, 21.85, 26.15, 30.55, 39.3, 47.05, 51.45 s.

### 1 · Tests pass, the rule breaks — 0:00–0:13

- **Step `rule` (0–8.75 s). Rest frame:** top, the rule card: "astropy · default_cosmology.validate — Raises TypeError: if value is not None, a string, or a Cosmology instance." Below, two code cards side by side, *gold* (`elif not isinstance(value, Cosmology): raise TypeError`) and *violating* (the same line with `(Cosmology, int, float)`, the added types in red). Under both, the original test suite's two probes (a class object, a Cosmology instance) with green passes. Then three scenario chips `1`, `0`, `2.5` drop into each card: gold returns `TypeError` stamps, the violating version returns `1`, `0`, `2.5` in red.
- **What moves:** the rule types on; the two cards rise; the diff tokens flash red; the original tests tick both; the chips drop and the answers appear, gold first.
- **Caption:** "The original tests pass both versions; only gold raises TypeError on 1, 0, 2.5"
- **Step `ask` (8.75–13.15 s). Rest frame:** the same, the violating card ringed, a teal empty check slot at the right with "?".
- **Caption:** "Can a coding agent write the check that catches this?"
- **Carries into 2:** the rule card and the gold card slide left to become the agent's inputs.

### 2 · An agent writes the checks — 0:13–0:26

- **Step `inputs` (13.15–21.85 s). Rest frame:** left column of inputs: rule card, a repository tree (`astropy/cosmology/…`), the reference code card marked "reference". An agent box in the middle. Right, its output in teal: a column of scenario chips (`0`, `1.0`, `False`, `b"Planck18"`, `[]`, `None`, `"Planck18"`, `Planck18`) and a check drawn as a two-way switch: "value is not None, str or Cosmology → must raise TypeError", "otherwise → assert nothing".
- **What moves:** inputs slide into the agent; chips stream out one by one; the check's two branches draw.
- **Caption:** "Given the rule, the repository and a reference, the agent writes scenarios and a check"
- **Step `route` (21.85–26.15 s). Rest frame:** each chip routed along its branch: the five that must raise land in the "must raise" lane, `None`, `"Planck18"`, `Planck18` in "assert nothing". Source line "Paper, App. B · harness by Codex / GPT-5.6-sol".
- **Caption:** "The check asserts only what the rule requires"
- **Carries into 3:** the check shrinks into a gate.

### 3 · Three implementations, one verdict — 0:26–0:39 (the turn)

- **Step `judge` (26.15–30.55 s). Rest frame:** a teal gate in the centre; from the left, *gold* passes through → stamp ACCEPT (teal), *violating* stops at the gate → stamp REJECT (teal: right verdict).
- **Caption:** "The check must accept gold and reject the violation"
- **Step `alternative` (30.55–39.3 s). Rest frame:** a third card, *valid alternative* (same rule satisfied, a grey changed line elsewhere), arrives: the gate accepts it (teal ACCEPT). Then a second gate below, the same check plus one extra assertion bar "+ what the reference does" (labelled illustrative), runs the same three: gold ACCEPT, violation REJECT, alternative **REJECT in red**: "false alarm". Under the two gates: "faithful" (teal) and "unfaithful" (red).
- **What moves:** the alternative card slides in; first gate passes it; the extra bar snaps onto the second gate; the red stamp lands.
- **Caption:** "A check that asserts more than the rule rejects a correct variant: a false alarm"
- **Carries into 4:** the red false-alarm stamp shrinks to the hatch pattern of the next chart.

### 4 · Detection is not faithfulness — 0:39–0:51

- **Step `detect` (39.3–47.05 s). Rest frame:** four rows, Codex / GPT-5.6-sol, Claude Code / Claude Opus 5, OpenCode / DeepSeek-V4-Pro, OpenCode / GLM-5.3, each a bar of detection: 81.8, 65.3, 66.7, 74.2% of tasks. Axis 0–100%. Source "Paper, Table 1 · 291 tasks".
- **Caption:** "Share of tasks where each agent's check rejects the violation"
- **Step `faithful` (47.05–51.45 s). Rest frame:** each bar cut back to faithfulness (61.9, 50.2, 45.0, 62.9%); the cut piece hatched red, labelled "lost to false alarms" (19.9, 15.1, 21.7, 11.3 points); a dashed line at 63% with "none reach it".
- **Caption:** "Count the false alarms and no agent is faithful on more than 63%"
- **Carries into 5:** the bars keep their rows; the reference card from 2 drops into the left margin.

### 5 · Shown the wrong code — 0:51–1:02

- **Step `swap` (51.45–56.8 s). Rest frame:** left, the reference card flips from *gold* to the *violating* version (the red `(Cosmology, int, float)` from 0:00). Right, four dumbbells of faithfulness on the 100-task Lite Set: GPT-5.6-sol 65 → 46, Claude Opus 5 52 → 21, DeepSeek-V4-Pro 52 → 28, GLM-5.3 68 → 39, each with its drop (−19, −31, −24, −29) beside it. Source "Paper, Table 2 · Lite Set".
- **What moves:** the card flips; each dot slides left, leaving a red trail.
- **Caption:** "Shown the violating version as reference, every agent's checks follow it"
- **Step `remember` (56.8–62 s, held). Rest frame:** the picture dims under the end card: "Checks follow the code they are shown, not the specification." Then the title, "Zhong, Chen, **Fang**, Zhang, Tian, Briand, Yu, He · arXiv 2026", "arXiv 2610.16870 · github.com/coxhin/SpecGuardBench".
- **Caption:** none; the end card is the line to remember.

## Narration

Kept for a later voiced cut (the film plays with music only). 150 words.

> Here is one rule from astropy: anything that is not None, a string or a cosmology must raise a TypeError. The original tests pass both of these versions, yet one of them returns numbers instead of raising. Can a coding agent write the check that catches it? Given the rule, the repository and a reference version, the agent writes test scenarios and a check that asserts only what the rule requires. The check must accept the gold version, reject the violation, and accept a correct variant. Assert more than the rule, and the correct variant is rejected: a false alarm. Four coding agents catch most violations, but count the false alarms and none is faithful on more than sixty-three percent of tasks. Show them the violating version as reference, and every agent loses nineteen to thirty-one points. Their checks follow the code they are shown, not the specification.

## Checks

- Durations: 8.75 + 4.4 + 8.7 + 4.3 + 4.4 + 8.75 + 7.75 + 4.4 + 5.35 + 5.2 = 62.0 s; the end card holds 5.2 s.
- Thumbnail strip (no sound): two code versions with red answers → the agent's chips and switch → a gate with one red stamp → four bars cut back at a dashed line → dots sliding left under a red reference card. Reads as "tests miss it → agent writes a check → checks reject correct code → no one above 63% → they copy the reference".
- Every claim maps to `highlights.md`: the astropy task and the Codex harness (Solution, App. B), three implementations and the metrics (Solution), Table 1 (Results), false alarms as the gap (Findings), the violating-reference ablation (Findings, Results). The extra assertion on the second gate is illustrative and labelled so; the paper reports false alarms in aggregate, not this check.
