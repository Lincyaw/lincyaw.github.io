# Beyond Fault Localization: brief

Source read: arXiv 2608.21310v2 (submitted 21 Aug 2026, v2 9 Oct 2026; cs.SE; 23 pages, 7 figures, 4 tables). PDF in `source/arxiv-pdf/`, LaTeX in `source/arxiv-src/extracted/`. All numbers below are from that version.

## Citation

- Title: Beyond Fault Localization: A Trajectory-Level Study of LLM Agents for Microservice Root Cause Analysis
- Authors: Qisheng Lu, **Aoyang Fang**, Junjielong Xu, Jin'ao Shang, Songhan Zhang, Yifan Yang, Xiaochuan Yan, Pinjia He. Aoyang Fang and Pinjia He are co-corresponding authors. Affiliations: The Chinese University of Hong Kong, Shenzhen (all but Jin'ao Shang, Xi'an Jiaotong University).
- Venue: arXiv preprint (cs.SE), 2026
- Links: arXiv https://arxiv.org/abs/2608.21310 · DOI https://doi.org/10.48550/arXiv.2608.21310 · PDF https://arxiv.org/pdf/2608.21310
- Code/data: the paper says it "will release all artifacts" (propagation-path dataset, trajectory-analysis pipeline, failure-mode codebook, DiagGuard prompts); no public URL in the paper.
- Honors: none stated.

## One sentence

Across 5,000 RCA agent trajectories, correct answers hide broken causal chains; failures recur in three evidence-handling families, and guarding against them raises accuracy everywhere. (24 words)

## Problem

- RCA agents are graded by whether the final answer names the faulty service (Acc@k, MRR, MAP); an on-call SRE needs the evidence and reasoning behind it (abstract; Section 1).
- Agent trajectories mix free-form reasoning, heterogeneous tool calls and telemetry results, and RCABench has no process-level ground truth to compare them against (Section 1).

## Insight

- Each incident's fault-propagation path is a causal reference: it says where an agent should be looking and which returned evidence was decisive, so every round can be placed on or off the fault-impact surface (abstract; Section 4.3).

## Method

- 500 RCABench (TrainTicket) cases get manually validated propagation graphs G*; ten framework–backbone configurations produce 5,000 trajectories (Sections 3, 4.1).
- Three layers of analysis: outcome (Acc@1, Node F1, Edge F1, cost, depth), behavior (10 navigation transitions, 4 evidence-utilization labels, 11 SRE intents over 92,501 SQL actions), failure (12 modes in OMIT, MIS, GEN families from 154 failed runs) (Section 4).
- DiagGuard: a Verifier (self-audit before, soundness check before committing) and a Grounder (search-space profile before the first query), added to unmodified frameworks through prompts and tools (Section 6.1).

## Results

- ThinkDepth.ai + Sonnet 90.0% Acc@1; open-ended general-purpose agents lead under Qwen (79.6/79.2/77.6%), all RCA-specific frameworks trail (42.6–53.4%) (Table 2).
- Edge F1 < Node F1 in every configuration; on correct cases Edge F1 ≤ 0.67 (Section 5.1).
- Sonnet acts on the previous result in 54.3% of rounds vs Qwen 24.9%; failed runs use up to 11.4 more rounds (Sections 5.1–5.2).
- DiagGuard: +3.5 to +35.1 pp Acc@1 in all 14 configurations (median 10.5 pp on RCA100); modes per run 1.94 → 1.39 (Section 6.2).

## BibTeX

```bibtex
@misc{lu2026beyond,
  title         = {Beyond Fault Localization: A Trajectory-Level Study of {LLM} Agents for Microservice Root Cause Analysis},
  author        = {Lu, Qisheng and Fang, Aoyang and Xu, Junjielong and Shang, Jin'ao and Zhang, Songhan and Yang, Yifan and Yan, Xiaochuan and He, Pinjia},
  year          = {2026},
  eprint        = {2608.21310},
  archivePrefix = {arXiv},
  primaryClass  = {cs.SE},
  doi           = {10.48550/arXiv.2608.21310},
  url           = {https://arxiv.org/abs/2608.21310}
}
```
