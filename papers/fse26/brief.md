# Brief: fse26

Local LaTeX source: /home/ddq/AoyangSpace/FSE26 (main.tex, chapters/, figures/, tables/). Section, table and figure numbers below follow that source; figure numbers are inferred from float order.

## Citation

- Title: Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark
- Authors: **Aoyang Fang** (first author), Songhan Zhang, Yifan Yang, Haotong Wu, Junjielong Xu, Xuyang Wang, Rui Wang, Manyi Wang, Qisheng Lu, Pinjia He (corresponding). All at The Chinese University of Hong Kong, Shenzhen.
- Venue: Proceedings of the ACM on Software Engineering, Vol. 3, No. FSE (FSE 2026), Article FSE072, pp. 1605–1627, 2026. Open access, CC BY.
- Links:
  - DOI: https://doi.org/10.1145/3797100 (https://dl.acm.org/doi/10.1145/3797100)
  - arXiv: https://arxiv.org/abs/2510.04711 (the arXiv version is titled "An Empirical Study of SOTA RCA Models: From Oversimplified Benchmarks to Realistic Failures")
  - PDF: https://dl.acm.org/doi/pdf/10.1145/3797100
  - Project page: https://operationspai.github.io/revisiting-rca-evaluation/
  - Artifact (evaluation suite): https://doi.org/10.5281/zenodo.19494725 ; dataset: https://doi.org/10.5281/zenodo.17105973
  - Earlier talk deck: /fse26-rca/ on the personal site
- Honors: Direct Accept at FSE 2026, 87 of 920 submissions (9.5%) (site news, _pages/about.md).

## One sentence

A propagation-aware benchmark of 1,430 validated TrainTicket failures shows that 11 SOTA RCA models average only 0.21 Top@1, exposing oversimplified existing benchmarks.

## Problem

- In microservices, a single fault can trigger a cascade of failures that propagates through service dependencies; enterprise downtime is estimated at over $23,000 per minute (Sec. 1).
- Existing public RCA benchmarks may overstate progress: SimpleRCA, a naive rule (rank services by number of threshold alerts), matches or beats SOTA models on four widely used public benchmarks (abstract; Sec. 3). Examples: Top@1 0.93 vs Nezha 0.87 on Nezha-TT; 0.83 vs BARO 0.50 on RE3-TT and 0.83 vs 0.00 on RE3-SS (Table 2).
- Existing datasets are small and shallow: all except GAIA have fewer than 200 fault cases, and seven datasets have traces of at most 2–3 hops (Sec. 3, RQ1).

## Insight

- In existing benchmarks the root-cause service usually shows the most prominent symptom, so simple correlation finds it without causal inference (Sec. 1).
- Over 737 cases in 11 public datasets, 0.86 are Type I (pronounced symptoms only in the injected service) or Type II (no pronounced symptoms anywhere); 0.99 lack at least one type of fault-relevant observability data (Table 3).
- A useful benchmark must decouple the true cause from the loudest symptom through fault propagation, and keep only failures that users actually feel (Sec. 1, Sec. 6.2.3).

## Method

- Closed-loop framework on TrainTicket (50 services): a state-machine dynamic load generator, a controller injecting faults through ChaosMesh from a structured fault space of 31 fault types in 6 categories (Resource, Network, HTTP, Code/JVM, DNS, Time) with over 10^16 configurations, sampled by stratified random sampling (Sec. 4; Table 4; Fig. 3). Note: Sec. 4.4 and 4.8 text say "seven categories"; abstract, intro and Table 4 give six.
- OpenTelemetry collection of metrics, trace-correlated logs, traces and L4/L7 network telemetry; hierarchical ground-truth labels Service → Pod → Container → Metric/Span/Function derived from injection parameters (Sec. 4.5–4.6; Fig. 5).
- Impact-driven validation: keep a case only if user-facing SLIs degrade (Z-test on success rate; hard plus adaptive latency thresholds). 9,152 injections → 1,430 validated cases across 25 fault types; 84.4% of injections were "No Anomaly"; 6 fault types dropped (abstract; Sec. 6.1.1; Fig. 6).
- 11 SOTA models (graph-based: MicroRank, MicroRCA, MicroHECL, MicroDig; ML/DL: DiagFusion, Eadro, Art; causal/statistical: Shapleyiq, Nezha, CausalRCA, Baro) re-engineered into one containerized framework with standardized inputs, tuned on the new benchmark (Sec. 5.3).

## Results

- Average Top@1 across the 11 models is 0.21; the best, MicroRCA, reaches 0.37; SimpleRCA drops to 0.28 (abstract; Sec. 6.2.1; Table 5).
- Execution time escalates from seconds to hours (abstract); without resource limits CausalRCA averages 927.11 s and Nezha 94.62 s per 8-minute window (Table 5).
- In the 262 hardest cases (at least 10 of 12 models fail), failure-mode labels split into Modeling Bottlenecks 47.4%, Scalability Issues 39.8%, and observability blind spots: Signal-Loss 5.8%, Infrastructure-Level 4.2%, Semantic-Gap 2.9% (Sec. 6.2.4; Fig. 10).
- The benchmark is heavier and deeper: 16.47 average QPS vs 0.14 (Nezha-TT) and 0.25 (Eadro-TT); 84% service coverage (42/50) vs 39% (RE2-TT); max call depth 7 vs 2–4 in most others; 11.2 million traces and 154.7 million log lines over 188.1 hours (Sec. 6.1.2).

## Limits as stated by the paper

- One system only (TrainTicket) and 11 models; the architecture may not represent all production environments (Sec. 7.1, External Validity).
- The SLI-based oracle excludes gray, partial and metastable failures; Top@K/MRR ignore operator needs such as interpretability; only service-level accuracy is reported (Sec. 4.7; Sec. 7.1; Sec. 6.2.4 "Label Granularity").

## BibTeX

```bibtex
@article{fang2026rethinking,
  title     = {Rethinking the Evaluation of Microservice {RCA} with a Fault Propagation-Aware Benchmark},
  author    = {Fang, Aoyang and Zhang, Songhan and Yang, Yifan and Wu, Haotong and Xu, Junjielong and Wang, Xuyang and Wang, Rui and Wang, Manyi and Lu, Qisheng and He, Pinjia},
  journal   = {Proceedings of the ACM on Software Engineering},
  volume    = {3},
  number    = {FSE},
  articleno = {FSE072},
  pages     = {1605--1627},
  year      = {2026},
  publisher = {Association for Computing Machinery},
  doi       = {10.1145/3797100},
  eprint    = {2510.04711},
  archivePrefix = {arXiv}
}
```
