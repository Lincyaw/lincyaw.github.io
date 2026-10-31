# Gleaner: brief

Source read: arXiv 2604.16810v1 (18 Apr 2026), PDF in `source/arxiv-pdf/`, LaTeX in `source/arxiv-src/extracted/`. All numbers below are from that version. (The arXiv PDF still carries the ACM template placeholders for venue and DOI.)

## Citation

- Title: Gleaner: A Semantically-Rich and Efficient Online Sampler for Microservice Diagnostics
- Authors: Yifan Yang, **Aoyang Fang**, Songhan Zhang, Pinjia He (corresponding). Affiliation: The Chinese University of Hong Kong, Shenzhen.
- Venue: ISSTA 2026 (ACM SIGSOFT International Symposium on Software Testing and Analysis)
- Year: 2026
- Links: arXiv https://arxiv.org/abs/2604.16810 · DOI (arXiv) https://doi.org/10.48550/arXiv.2604.16810 · PDF https://arxiv.org/pdf/2604.16810 · Code https://github.com/OperationsPAI/Gleaner (paper ref. [42]) · Dataset https://doi.org/10.5281/zenodo.19637628 (paper ref. [41]). ACM DOI for the ISSTA version: not available in the source.
- Honors: directly accepted at ISSTA 2026, one of 90 direct accepts among 888 papers after desk rejects (per the author; not stated in the paper).

## One sentence

Gleaner samples microservice traces online by encoding traces and their logs as event-pair sets, keeping anomalous, diverse traces at 0.74 ms each. (22 words)

## Problem

- Trace volume reaches terabytes daily and follows a long tail: in Train-Ticket the top 24.3% of paths account for 82.3% of traces, so random sampling keeps redundant traces and drops rare ones (Section 2.1).
- Tail-based samplers use only span-level information (call structure, status, latency) and are blind to intra-span events; a trace with status OK and 47 ms latency can hide a critical ERROR log (Section 1, Fig. 1).
- Samplers that do use logs rely on heterogeneous GNNs that need offline training and are "too slow for online, real-time processing": a fidelity-performance trade-off (Section 1, Table 1).

## Insight

- "Explicit, computationally expensive graph structures are not necessary for high-fidelity, semantically-aware sampling" (Section 1).
- Represent each trace as an event-pair set (EPS; the abstract calls it a "bag-of-edges" augmented with log semantics): bi-grams over each span's events (start, log templates, error, degradation, end) plus parent-end→child-start pairs; set operations (Jaccard) replace graph algorithms, and the set deduplicates fan-out repeats (Section 3.2, Insight 1).
- A sampler should "mimic an SRE's focus during an incident" by following external alarms (Section 3.3, Insight 2).

## Method

- Trace Encoder: builds E(T) and an anomaly score A(T) from span errors, WARN/ERROR log counts and latency above 1.2 × group p90; log lines are mapped to Drain templates (Section 3.2, Algorithm 1, Eq. 1).
- Quota Allocator: groups traces by root span (entry API); on an alarm it raises the total budget if traffic (QPM) drops, and boosts alerted API groups up to 3x the average, capped (e.g. 50% of the period's budget) (Section 3.3).
- DPP Selector: a Determinantal Point Process kernel with anomaly scores on the diagonal and EPS Jaccard similarity off-diagonal; fast greedy DPP with early termination and a cross-batch LRU similarity cache (91.8% hit rate) (Section 3.4).
- Evaluation: Dataset A, new, from Train-Ticket: 161 fault-injection cases, 1,474,537 traces (Table 4), 16 failure types; Dataset B: five systems from TracePicker; baselines Random, Sieve, Sifter, TraStrainer, TracePicker (Section 4.1).

## Results

- 0.741 ms per trace at a 5% target rate, 26.5% faster than TracePicker and 94× faster than TraStrainer, highest benefit-cost ratio 0.81, and an exact 5.0% actual sampling rate (Section 4.6, Table 8).
- At a 10% sampling rate: 11.6%–128.7% higher Trace Pattern Coverage and 2.8%–32.9% higher Shannon Entropy than baselines (Section 4.3; abstract). At 0.1%, Proportion Rare is 0.992, 3.5× TracePicker (Section 4.3).
- At a 1% sampling rate, ShapleyIQ AC@1 is 0.56 with Gleaner vs 0.27 with the next-best sampler (+107%), and AC@3 0.64 vs 0.45 (+42%) (Table 6); the abstract summarizes this as "42%-107% over the next-best sampler".
- RCA on Gleaner's 1% sample beats the unsampled data: ShapleyIQ AC@1 0.56 vs 0.41 (+36.6%), Nezha AC@1 0.19 vs 0.11 (+72.7%); MicroRCA "maintains equivalent accuracy with 99% less data" (Section 4.5, Table 6).

Note for the animator: Section 4.5 text attributes "+107%" and "+42%" to Nezha (0.19 vs 0.11, 0.45 vs 0.26), but those ratios are about +73%; the +107% and +42% match the ShapleyIQ rows of Table 6. Use the Table 6 pairs above, not the Section 4.5 attribution.

## Limits as stated by the paper

- Advantages shrink in systems with a single entry point (e.g. SockShop) or without logs and alarms, where Gleaner behaves like a structure-driven diversity sampler (Section 4.3 Finding 1; Section 5.1).
- Evaluated on open-source benchmarks "simpler and cleaner than many production deployments"; "validation on industrial workloads remains necessary" (Section 5.2, External Validity).

## BibTeX

```bibtex
@inproceedings{yang2026gleaner,
  title     = {Gleaner: A Semantically-Rich and Efficient Online Sampler for Microservice Diagnostics},
  author    = {Yang, Yifan and Fang, Aoyang and Zhang, Songhan and He, Pinjia},
  booktitle = {Proceedings of the ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)},
  year      = {2026},
  eprint    = {2604.16810},
  archivePrefix = {arXiv},
  url       = {https://arxiv.org/abs/2604.16810}
}
```
