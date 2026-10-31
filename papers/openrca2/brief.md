# OpenRCA 2.0: brief

Source read: arXiv 2606.27154v2 (30 Jun 2026), PDF in `source/arxiv-pdf/`, LaTeX in `source/arxiv-src/extracted/`. All numbers below are from that version.
A later local draft exists at `/home/ddq/AoyangSpace/rcabench_paper/main.tex` (ICLR 2027 template, retitled "Process-Level Evaluation of LLM Agents for Microservice Root Cause Analysis", numbers regenerated on 455 instances). It is **not** the arXiv version; nothing here is taken from it.
Code (internal, not public): `/home/ddq/AoyangSpace/OpenRCA-2-Internal` (a LangGraph ReAct RCA agent, matching the paper's agent design).

## Citation

- Title: OpenRCA 2.0: From Outcome Labels to Causal Process Supervision
- Authors: **Aoyang Fang**, Yifan Yang, Jin'ao Shang, Qisheng Lu, Junjielong Xu, Rui Wang, Songhan Zhang, Yuzhong Zhang, Boxi Yu, Pinjia He (corresponding: Jin'ao Shang, Pinjia He). Affiliation: The Chinese University of Hong Kong, Shenzhen. (The arXiv PDF misspells "Junjielung Xu"; the email list gives junjielongxu.)
- Venue: arXiv preprint (cs.AI), 2026
- Links: arXiv https://arxiv.org/abs/2606.27154 · DOI https://doi.org/10.48550/arXiv.2606.27154 · PDF https://arxiv.org/pdf/2606.27154
- Code/data: the paper says the benchmark and PAVE pipeline "will be released publicly" (Appendix A.6, A.8); no public URL in the paper.
- Honors: none stated.

## One sentence

PAVE uses known fault injections to verify causal propagation paths, yielding OpenRCA 2.0: 500 RCA instances with step-wise causal ground truth. (22 words)

## Problem

- Widely used RCA benchmarks are built by fault injection and label only the injected component; evaluation scores only the outcome, so "the derivation that produced this answer is not examined" (Section 1, Figure 1).
- Labeling only the root cause, not the propagation path, "largely simplifies the task to naive pattern matching" (abstract).
- Building step-wise ground truth from telemetry alone would put the annotator in the agent's position: reasoning backward, while "many faults can produce similar telemetry" (Section 1).

## Insight

- Information asymmetry: fault-injection records give the annotator the intervention do(v_root) that the agent never sees, so {O_obs} ⊂ {O_obs, do(v_root)} (Section 1, Eq. 1).
- With the cause given, annotation becomes forward verification, "reasoning from cause to effect rather than inferring backward from symptoms" (abstract): an ill-posed inverse problem becomes a well-posed verification task (Section 2.1).
- No single signal suffices, so a path must pass structural, statistical and temporal conditions jointly (Section 1).

## Method

- PAVE (Path Annotation via Verified Effects) takes the dependency graph G, raw telemetry O(t) over the injection window, and the intervention do(v_root); it outputs a verified path set Π* (Section 2, Figure 3).
- Phase 1, Structural Pruning: telemetry is mapped to discrete states (e.g. HighLatency, CPU_Throttled); a propagation rule set R admits only mechanism-backed transitions; a constrained DFS over a time-expanded graph yields candidate paths Π_cand (Section 2.2).
- Phase 2, Causal Verification: each node is tested against a pre-injection Reference Baseline (Z-score or percentile tests); a path is kept only if every node deviates, every edge conforms to R, and every downstream anomaly starts no earlier than its upstream cause (Section 2.3).
- Applied to 3 systems (TrainTicket, OpenTelemetry Demo, DeathStarBench Hotel Reservation) and 27 fault types, a raw pool of 8137 injected runs is curated into OpenRCA 2.0: 500 instances with 7.5 verified causal edges on average (Section 1, Section 3.1, Table 1). Agents are graded on outcome (EM, F1, AnySvc) and process (Path Reachability, Node F1, Edge F1) (Section 3.2).

## Results

- Across 11 frontier LLMs, agents recover the exact root-cause set in only 20.7% of cases on average; mean F1 is 34.1% (abstract; Section 3.2).
- Ungrounded diagnosis: agents name at least one correct root-cause service in 76.0% of cases (AnySvc) but ground it in a verified causal path to the symptom in only 61.5% (Path Reachability), a 14.5 pp gap, "roughly one in five correct identifications ungrounded" (abstract; Section 1; Section 3.2 Finding 1).
- Mean Edge F1 (43.4%) trails mean Node F1 (62.2%) by 18.8 pp, for every model; Gemini 3.1 Pro has the widest split, 67.9% vs 36.8% (Section 3.2 Finding 2, Table 2).
- Outcome-only grading hides differences: PR/AnySvc is 71.8/79.2 ≈ 91% for Qwen3.6-Max but 52.6/79.4 ≈ 66% for Claude Sonnet 4.6 "despite comparable F1" (Section 3.2). A two-annotator audit on 100 random instances agrees on G* in 94/100 cases, with no spurious included edge flagged (Section 3.4).

## Limits as stated by the paper

- PAVE assumes a real controlled intervention, a sufficiently complete service dependency graph, an observable propagation signature, and a clean pre-injection baseline; where these fail, numbers "should be read as an upper bound"; the rule set R may silently prune mechanisms outside its vocabulary (Section 5).
- Results "apply within the testbed envelope"; transfer to production "must be calibrated rather than assumed" (Section 5, External transfer).

## BibTeX

```bibtex
@misc{fang2026openrca2,
  title         = {{OpenRCA} 2.0: From Outcome Labels to Causal Process Supervision},
  author        = {Fang, Aoyang and Yang, Yifan and Shang, Jin'ao and Lu, Qisheng and Xu, Junjielong and Wang, Rui and Zhang, Songhan and Zhang, Yuzhong and Yu, Boxi and He, Pinjia},
  year          = {2026},
  eprint        = {2606.27154},
  archivePrefix = {arXiv},
  primaryClass  = {cs.AI},
  doi           = {10.48550/arXiv.2606.27154},
  url           = {https://arxiv.org/abs/2606.27154}
}
```
