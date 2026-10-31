# OpenRCA 2.0: one-minute film plan

Built with the presmium-animate story process (`references/story.md`, `storyboards.md` "Papers", `lengths.md` 60 s). Fact source: `highlights.md` (arXiv 2606.27154v2); the opening case is Figure 1. Figures in `figures/`.

## Brief

- Kind: explainer or paper video, 60 s, narrated, video first (the rest frames double as the paper page's stills).
- Audience: ML and SRE researchers and practitioners who have heard of LLM agents for root cause analysis (RCA) and read leaderboards.
- Before: "If the agent names the right root cause, it diagnosed the failure."
- After: "A right root cause often comes without a valid causal chain; grade the chain."
- Misconception to confront: a correct answer implies correct reasoning. Parts to name first: a service, a causal chain (path), the injected fault.
- Assumptions: 16:9, narration only, no music; the title card holds over the last sentence.

## Thesis

After watching, the viewer understands **that a right root cause is not a right diagnosis**, because they saw an agent's chain skip Travel while the benchmark still said "correct", and then the same broken chains fill a grid across 11 models.

**And–But–Therefore.** LLM agents are judged on whether they name the root cause, and benchmarks label only that cause; **but** an agent can name the right service through a chain that never happened; therefore PAVE uses the known injected fault to verify the true chain step by step, and grading against it shows that many correct answers are ungrounded.

## Pattern

Gap → instrument → finding, the benchmark/dataset row of story.md's table: OpenRCA 2.0's contribution is an instrument, so the viewer must see why existing labels can't answer the question and why the new labels can be trusted before the finding lands. Under a minute, the finding's case opens the film (result first), and the gap is shown on that same case.

## Three storylines

- **A. One chain, rebuilt (recommended).** One object all the way: the four-service chain Seat → Travel → Order → Gateway. It opens as the agent's answer with Travel missing; the injected fault lights it forward hop by hop through three checks; it shrinks into one row of the benchmark; then rows re-flow into a grid of 200 small chains where the broken ones are counted. Form: one frame that rebuilds itself. Rules out: separate "method" and "results" slides.
- **B. Two seats.** Split screen: left the agent, holding only telemetry, reasoning backward to a "?"; right the annotator, holding the injection, reasoning forward. The halves slide together and their two chains overlay; the mismatch is the evaluation. Form: a split that becomes one. Rules out: the pipeline detail (the three checks get one shot).
- **C. The audit (bold).** Open on a wall of 200 green "correct" stamps (the outcome scores); the camera dives into one stamp and finds the chain behind it skipping Travel; it pulls back out and re-grades the wall stamp by stamp, a quarter turning red. Form: an endless zoom in and out. Rules out: explaining how labels are made beyond one beat.

Recommendation: **A**. It keeps the claim a visible property (a missing link) on the same object from first to last frame, the final number is counted from the picture, and the opening case returns as one cell of the grid. The turn (the injection marker landing on Seat and the arrows flipping forward) falls at about 0:22, 37% in.

## Picture

- Central picture: the chain Seat → Travel → Order → Gateway as four rounded nodes left to right (cause on the left, symptom on the right).
- Money frame: the 200-cell grid in step 6, 152 cells with a green root, 123 of them with an unbroken chain, 29 with a green root and a red gap.
- Colours: green = correct root service; red = a missing or failed link; amber = a service on the true path; grey = telemetry and context.
- Spatial convention: time and causation run left to right; the agent's chain sits below the true chain.
- LOOK: light paper ground, flat nodes in the colours of Figure 1, one accent (red) only on gaps; BANNED: dark void with glow, KPI tiles, text paragraphs.

## Storyboard

Chapters (the story's beats): **Right answer, skipped step** 0:00 · **The cause is known** 0:14 · **Following the fault forward** 0:27 · **Grading the chain** 0:45 · end 1:00.

| # | Chapter · time | Rest frame (the still) | What moves | Carries into the next | Narration | On-screen text |
|---|---|---|---|---|---|---|
| 1 | Right answer, skipped step · 0:00–0:07 | The agent's chain Seat → Order → Gateway; Seat ringed green; a green "correct" stamp on an outcome card at right (Figure 1, bottom row and "Outcome-only" box) | The agent's arrows draw from Seat; the stamp lands | The agent's chain stays; the true chain will grow out of the same Seat node | "An AI agent diagnoses a failing train-ticket system and names the right culprit, the Seat service. The benchmark marks it correct." | "Outcome: correct" |
| 2 | 0:07–0:14 | Above it, the true chain Seat → Travel → Order → Gateway; Travel amber; a red gap bracket under the agent's arrow where it jumps Travel (Figure 1, middle row) | The true chain grows rightward from Seat; Travel lights; the gap bracket opens | The whole picture dims to grey; the "?" of step 3 appears over the gap | "Yet the failure reached users through Travel, and the agent's explanation skips Travel entirely." | "Travel skipped" |
| 3 | The cause is known · 0:14–0:27 | The chain greyed; around its nodes the three telemetry glyphs of `rca-setting-telemetry.png` (trace bar, latency spike, log line); a dashed arrow pointing backward to a "?" — then a fault marker labelled "do(Seat = NetworkDelay)" seated on Seat, the arrows now solid and pointing forward | The backward arrows hesitate between Seat and a second glowing service (many faults look alike); 1 s of silence; the fault marker drops onto Seat and the arrows flip to point forward (the turn) | The fault marker on Seat emits the pulse that walks the chain in step 4 | "Benchmarks never checked the path, because from telemetry alone many faults look alike. But every benchmark failure is injected on purpose. Whoever labels it knows the cause, and can follow it forward." | "Known cause → follow it forward" |
| 4 | Following the fault forward · 0:27–0:39 | The verified chain Seat → Travel → Order with three small gates above each hop (topology, baseline band, clock), all ticked; one candidate edge crossed out in red; one noisy service faded (after `pave-two-phase-verification.png`, Figure 3) | A pulse leaves Seat; at each hop the three gates tick in turn as the narration names them; an edge the topology forbids gets ×; a service whose spike stays inside its baseline band fades | The verified chain shrinks to a thin row and slides into a stack | "That is what PAVE does. From the injected fault, it keeps a hop only if the system's topology allows it, the next service departs from its normal baseline, and the effect comes after its cause." | "Three checks per hop" |
| 5 | 0:39–0:45 | A stack of thin chain rows in three bands (TrainTicket, Hotel Reservation, OTel Demo), the block labelled "OpenRCA 2.0 · 500 failures · Table 1" | Rows fall into the stack band by band; the count rolls to 500 | The rows lift off the stack and re-flow into the grid of step 6 | "Fault after fault, the verified chains become the OpenRCA 2.0 benchmark." | "OpenRCA 2.0" |
| 6 | Grading the chain · 0:45–1:00 | A grid of 200 small chains: 152 with a green root, of which 123 unbroken and 29 with a red gap; readouts "76.0% right service · 61.5% connected chain · mean of 11 models · abstract"; under the last 5 s, the title card: title, authors, arXiv 2606.27154 | Cells take their colours in two passes: roots turn green (count rises to 76.0%), then chains connect (count stops at 61.5%); the 29 gapped cells pulse once; the step-2 chain flies into one gapped cell | End card (hold ≥ 5 s) | "Now grade eleven frontier models on the chain, not just the name. They find a correct service 76 percent of the time, yet connect it to the symptom only 61.5 percent. Before you trust an agent's diagnosis, check its chain." | "Check the chain, not the name" |

Numbers spoken: eleven models, 76 percent, 61.5 percent (all abstract; means over 11 models, Table 2). The 500 instances (Table 1) and the per-system split (TrainTicket 320, Hotel Reservation 142, OTel Demo 38; Table 1) are shown, not spoken. The grid counts are 76.0% and 61.5% of 200 cells.

## Narration

153 words (counted with `wc -w` over the six narration cells), about 2.55 words a second; the title card holds under the last sentence.

> An AI agent diagnoses a failing train-ticket system and names the right culprit, the Seat service. The benchmark marks it correct. Yet the failure reached users through Travel, and the agent's explanation skips Travel entirely. Benchmarks never checked the path, because from telemetry alone many faults look alike. But every benchmark failure is injected on purpose. Whoever labels it knows the cause, and can follow it forward. That is what PAVE does. From the injected fault, it keeps a hop only if the system's topology allows it, the next service departs from its normal baseline, and the effect comes after its cause. Fault after fault, the verified chains become the OpenRCA 2.0 benchmark. Now grade eleven frontier models on the chain, not just the name. They find a correct service 76 percent of the time, yet connect it to the symptom only 61.5 percent. Before you trust an agent's diagnosis, check its chain.

## Checks

- Durations: 7 + 7 + 13 + 12 + 6 + 15 = 60 s.
- Silent strip: chain with a stamp → chain with a gap → fault marker on the chain → chain with ticked gates → stack of chains → grid of chains with gaps. The story reads without sound.
- Sources: steps 1–2 Figure 1; step 3 Figure 2b and Eq. 1 (highlights: Challenge, Insight); step 4 Sections 2.2–2.3, Figure 3 (highlights: Solution); step 5 Table 1 (highlights: Solution); step 6 abstract, Table 2 (highlights: Results 2, Findings 1).
