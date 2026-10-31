# OpenRCA 2.0: From Outcome Labels to Causal Process Supervision — Highlights

Source: arXiv 2606.27154v2. Section and table numbers refer to that version.

**Task.** Evaluate how LLM agents perform root cause analysis (RCA) in microservice systems: given only telemetry (traces, metrics, logs) from a failure, the agent must name the originating fault and explain how it propagated to the observed symptom. The paper builds the ground truth needed to grade that explanation step by step, not only the final answer (abstract; Section 1).

**Challenge.**
- Widely used RCA benchmarks are built by fault injection and label only the injected component, so evaluation scores only the outcome; "the derivation that produced this answer is not examined" (Section 1). Labeling only the root cause "largely simplifies the task to naive pattern matching" (abstract).
- Building step-wise causal ground truth from telemetry alone puts the annotator in the agent's position: reasoning backward from cascading effects, while "many faults can produce similar telemetry" (Section 1).
- No single signal is enough to confirm a propagation step: a structurally plausible chain may not have carried the failure, a statistical co-occurrence may be coincidental, and aligned timing alone does not imply a causal link (Section 1).

**Solution.** PAVE (Path Annotation via Verified Effects) reconstructs verified causal propagation paths by checking, from the known intervention forward, which downstream effects actually followed. Given the dependency graph, the telemetry over the injection window and the recorded intervention do(v_root), Phase 1 (Structural Pruning) enumerates candidate paths through a time-expanded graph, admitting only transitions backed by a propagation rule set; Phase 2 (Causal Verification) keeps a path only if every node deviates from a pre-injection baseline, every edge conforms to the rules, and every downstream anomaly starts no earlier than its upstream cause (Sections 2.2–2.3). Applied to 3 systems (TrainTicket, OpenTelemetry Demo, DeathStarBench Hotel Reservation) and 27 fault types, PAVE yields OpenRCA 2.0: 500 instances with 7.5 verified causal edges on average, curated from 8137 injected runs (Section 3.1, Table 1). Agents are graded on an outcome layer (Exact Match, F1, AnySvc) and a process layer (Path Reachability, Node F1, Edge F1) (Section 3.2).

**Insight.** Fault-injection records hand the annotator the one thing the agent never sees, the intervention, and this information asymmetry turns annotation "from inference into forward verification: with the cause given, check which downstream effects actually followed" (Section 1). Knowing do(v_root) turns an ill-posed inverse problem into a well-posed verification task (Section 2.1, Eq. 1).

**Findings.**
- Outcome scores hide a distinct failure mode, the *ungrounded diagnosis*: agents often name a correct root-cause service without any verified causal path linking it to the observed symptom (Section 3.2, Finding 1).
- Agents identify the services involved in a failure more reliably than the directed dependencies between them; the Edge F1 < Node F1 ordering holds for every model (Section 3.2, Finding 2).
- No single backbone dominates: per-column maxima are spread across four models, and models that outcome grading rates as comparable differ sharply in how often their correct answers are grounded (Section 3.2, Finding 3).
- Trajectory reading shows three recurring failure patterns: premature commitment after one plausible cause, presence bias that reads a silent (killed) service as healthy, and salience capture by the loudest downstream signal (Section 3.3).

**Results.**
- Across 11 frontier LLMs on OpenRCA 2.0 (n=500), the mean Exact Match on the root-cause set is 20.7% and mean F1 is 34.1%; the best EM is 29.4% (Gemini 3.1 Pro) and the lowest 6.8% (MiniMax M2.7) (abstract; Table 2).
- Agents name at least one correct root-cause service in 76.0% of cases (AnySvc) but satisfy Path Reachability in only 61.5%, a 14.5 pp gap, roughly one in five correct identifications ungrounded (abstract; Section 1; Section 3.2).
- Mean Edge F1 is 43.4% vs mean Node F1 62.2%, an 18.8 pp gap; Gemini 3.1 Pro shows the widest split, 67.9% vs 36.8% (Section 3.2, Table 2).
- PR/AnySvc is 71.8/79.2 ≈ 91% for Qwen3.6-Max but 52.6/79.4 ≈ 66% for Claude Sonnet 4.6, despite comparable F1 (Section 3.2).
- Annotation reliability: a two-annotator audit of 100 random instances agrees on the verified graph in 94/100 cases; all six disagreements were missing weakly supported paths, none a spurious included edge (Section 3.4).
- No method baseline applies: this is a benchmark paper, and the comparison is across LLM backbones under one shared agent design (Section 3.1).
