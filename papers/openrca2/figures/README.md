# Figures: OpenRCA 2.0 (arXiv 2606.27154v2)

All rendered with `pdftoppm -cropbox` from the arXiv source tarball (`source/arxiv-src/extracted/figures/`).

- `ungrounded-diagnosis-overview.png` (2532x647): Figure 1. The known intervention do(Seat = NetworkDelay), the PAVE-verified path Seat→Travel→Order→Gateway, and the agent's path that skips Travel; outcome-only scoring gives Pass@1=1.0, process-level eval gives Path Reachability=False ("Correct Answer, Wrong reason"). Source: `figures/fig1.pdf`. Note: the figure itself spells "skiped".
- `rca-setting-dependency-graph.png` (2309x2300): Figure 2a. Two-layer dependency graph (Gateway, Order, Travel, Seat, MySQL on Pod-A/Pod-B/Node-1); NetworkDelay injected at Seat; horizontal RPC and vertical resource-contention channels. Source: `figures/overview_a.pdf`.
- `rca-setting-telemetry.png` (2299x2099): Figure 2b. What the agent sees: traces (Order 3050ms, Travel 3020ms, Seat timeout), the Seat.p99_latency metric spiking in the injection window, and ERROR/WARN logs. Source: `figures/overview_b.pdf`.
- `pave-two-phase-verification.png` (2780x836): Figure 3. PAVE coarse-to-fine: raw possible propagation graph → Phase 1 Structural Pruning (topology constraints, edges marked x) → Phase 2 Causal Verification (baseline comparison) → verified chain. Source: `figures/pipeline_fig.pdf`.

Not rendered: Table 2 (per-model results) is a LaTeX table (`tables/llm_evaluation.tex`); its numbers are in brief.md.
