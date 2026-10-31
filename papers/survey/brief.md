# Brief: survey

Basis: arXiv v1 (22 Oct 2025), the only public version. Downloaded to `source/arxiv-src/2510.19593.tar.gz` (extracted in `source/arxiv-src/x/`), `source/arxiv-pdf/2510.19593v1.pdf`, abstract page `source/arxiv-abs/abs.html`. Section, table and figure numbers refer to the arXiv v1 PDF.

The local tree /home/ddq/AoyangSpace/survey is the same paper in a later, unpublished revision (CONTEXT.md: TOSEM submission, 146 papers, 2013–2026, rewritten abstract). Its numbers differ from arXiv v1 and are not used here; if the film should reflect the revision, re-derive the numbers from that tree.

## Citation

- Title: A Goal-Driven Survey on Root Cause Analysis
- Authors: **Aoyang Fang** (first author), Haowen Yang, Haoze Dong, Qisheng Lu, Junjielong Xu, Pinjia He. The Chinese University of Hong Kong, Shenzhen.
- Venue: arXiv preprint arXiv:2510.19593, 2025 (cs.SE). No published venue yet.
- Links:
  - arXiv: https://arxiv.org/abs/2510.19593
  - PDF: https://arxiv.org/pdf/2510.19593
  - DOI (arXiv): https://doi.org/10.48550/arXiv.2510.19593
  - Code: none released with the paper
- Honors: none stated.

## One sentence

A survey of 135 RCA papers organized by seven goals, formalizing ideal RCA as mapping observations to an incident propagation graph, which no existing work outputs.

## Problem

- "RCA" covers tasks with distinct goals: an SRE minimizing MTTR seeks the trigger (e.g. a traffic spike), a developer making a permanent fix seeks the root cause (e.g. a buggy commit) (abstract; Sec. 1).
- Previous surveys categorize papers by input data type (metric-based vs trace-based), which groups works with disparate objectives and obscures progress and gaps (abstract; Sec. 1).
- The result is fragmented research and task-specific formulations that are hard to compare (Sec. 1).

## Insight

- Organize RCA research by the goals an RCA system must meet across the incident management lifecycle, not by its input data (Sec. 1).
- Ideal RCA is a function F: O → G that maps observation data O = {Logs, Metrics, Traces, Events, Supplementary data} to an incident propagation graph G, a DAG of root cause, trigger, intermediate and symptom event nodes (Sec. 3.3; Fig. 3, Fig. 4).
- An Effectiveness-Data-Cost Triangle explains why research simplifies this ideal into sub-problems (Sec. 3.1).

## Method

- Seven fundamental goals, derived from four perspectives (Input, Inference, Output, Efficiency): multi-dimensional data correlation, robustness, adaptive learning, real-time performance, interpretability, multi-granularity, actionability (Sec. 1; Sec. 3.2).
- Systematic literature review: DBLP keyword search over SE, systems, AI/data-mining/database and other venues (Table 1), then backward and forward snowballing until saturation; 135 papers, 2014–2025 (abstract; Sec. 4.2).
- Each paper is mapped onto O and the simplified form of G it outputs (root cause, trigger, symptom nodes or partial paths; granularity), plus its main goal, evaluation and open-source status; per-goal tables of paradigms (Sec. 4.3; Tables 2–8).

## Results

- No existing work fully conforms to the ideal by outputting complete incident propagation paths; most identify only the root cause node r (Sec. 3.3; Sec. 13.3, "point-finding" vs "graph-building").
- Root-cause types studied are dominated by resource faults: 56.9% (148), vs code 8.5% (22), configuration 6.2% (16), user request 4.2% (11); counts are multi-labelled across the 135 papers (Sec. 12.2; Fig. 8).
- Publications grow sharply after 2021, peaking in 2024 with growing industry collaboration (Sec. 12.1; Fig. 5). The text says 40 papers in 2024; the figure shows 39, so avoid this number on screen.
- Three gaps block graph-building RCA (evaluation, data, methodology); agenda: benchmarks with ground-truth propagation graphs, unified models for causal graph generation, integration with the software engineering lifecycle (Sec. 13.3–13.4).

## Limits as stated by the paper

- Covers a subset of the literature (top venues, past decade); time and resources prevented collecting all relevant works (Sec. 13.1).
- Risk of subjective interpretation when reading and categorizing papers, mitigated by cross-review among authors (Sec. 13.1).

## BibTeX

```bibtex
@misc{fang2025goaldriven,
  title         = {A Goal-Driven Survey on Root Cause Analysis},
  author        = {Fang, Aoyang and Yang, Haowen and Dong, Haoze and Lu, Qisheng and Xu, Junjielong and He, Pinjia},
  year          = {2025},
  eprint        = {2510.19593},
  archivePrefix = {arXiv},
  primaryClass  = {cs.SE},
  doi           = {10.48550/arXiv.2510.19593},
  url           = {https://arxiv.org/abs/2510.19593}
}
```
