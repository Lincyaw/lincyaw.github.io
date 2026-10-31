# Figures: Beyond Fault Localization (arXiv 2608.21310v2)

All rendered with `pdftoppm -cropbox -r 300` from the arXiv source tarball (`source/arxiv-src/extracted/figures/`).

- `correct-label-vs-trajectory.png` (3809x1300): Figure 1 (Section 1). The propagation path Root Cause Service → Affected Service → Observed Symptom; an agent trajectory (Steps 4–7 rank services by error count, 9–13 hypothesize, 16–30 query, 37–40 reach the root-cause service but leave its metrics uninspected, 45–47 recheck the symptom and report the affected service); outcome-level metrics (Acc@k, MRR, MAP) see only the wrong final answer. Source: `introduction-crop.pdf`.
- `study-overview.png` (3838x1355): Figure 2 (Section 3). Phase 1 collects 5,000 trajectories on RCABench and annotates propagation paths; Phase 2 analyzes RQ1 outcome metrics, RQ2 behavior and intent, RQ3 failure families (protocol omissions, semantic misreads, general reasoning). Source: `framework-crop.pdf`.
- `navigation-labels-trajectory-example.png` (3984x2121): Figure 3 (Section 4.3). The 10 navigation transitions (Advance, Lateral, Return, Regress, Off-Path), the 4 evidence-utilization types (utilized, partial, ignored, no_data), and a worked 12-round trajectory plotted as primary-service depth over rounds against a ground-truth path, straying into the off-path band twice before reaching the root cause. Source: `Navigation-crop.pdf`.
- `diagguard-case-tikv.png` (2809x1371): Figure 6b (Section 6). A disk-I/O fault on TiKV node tidb-tikv-0 (disk writes 15 → 105 Mbps, slow queries 0 → 15, product lookup ~10 ms → 14 s, product page p99 0.25 s → 10 s); the baseline blames the chronically noisy Ad service (error rate 0.25% → 0.69%), DiagGuard descends to tidb-tikv-0. Source: `case-crop.pdf`.

Not rendered: Table 2, Table 3 and Table 4 are LaTeX tables; their numbers are in highlights.md.
