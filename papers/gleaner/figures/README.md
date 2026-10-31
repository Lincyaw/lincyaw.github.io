# Figures: Gleaner (arXiv 2604.16810v1)

All rendered with `pdftoppm -cropbox` from the arXiv source tarball (`source/arxiv-src/extracted/`).

- `semantic-blind-spot-trace.png` (2520x555): Fig. 1. A trace that looks normal at span level (Status OK, 47ms) but carries hidden ERROR/WARN log events (price config parse failure, fallback pricing). Source: `figs/fig_log_blind.pdf`.
- `gleaner-pipeline.png` (2400x881): Fig. 2. Three-stage pipeline: Trace Encoder (trace with log events → event-pair set, scored) → Quota Allocator (root span grouping; Normal / Buffer / Alarm periods; API-1 quota raised on an API-1 error alarm) → DPP Selector → backend storage. Source: `figs/pipeline.pdf`. Note: the figure labels the selector "DDP Selector" and spells "Rebanlance"; the paper text says "DPP Selector".
- `rq1-sampling-quality-dataset-a.png` (2784x2003): Fig. 4. Sampling quality on Dataset A vs sampling rate 0.1%–10%: (4.1a) API Coverage, (4.1b) Path Coverage, (4.1c) Trace Pattern Coverage, (4.1d) Shannon Entropy, (4.2a) Proportion Rare, (4.2b) Proportion Anomaly; Gleaner vs Random, Sifter, Sieve, TraStrainer (with and w/o metrics), TracePicker. Source: `results/rq1_quality_combined.pdf`.

Not rendered: Table 6 (RCA accuracy) and Table 8 (efficiency) are LaTeX tables; their numbers are in brief.md.
