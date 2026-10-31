# DynaCausal figures

All rendered from the arXiv 2510.22613 source (`../source/arxiv-src/x/Figures/`), PDF to PNG with pdftoppm.

- `framework-overview.png` (3337x1217): the DynaCausal framework: logs, metrics, traces aligned into multivariate time series, dynamic call graph per window (request count + error rate), Transformer Encoder, Hybrid-Aware GAT, then TCD and SCO losses and the root cause ranking. Figure 3, `Figures/method.pdf`.
- `multimodal-data-and-call-graph.png` (2347x1378): the three monitoring modalities (metrics, logs, traces) and an example service invocation graph. Figure 1, `Figures/intro.pdf`.
- `motivation-metrics-before-after-fault.png` (2686x1209): service-level metrics before and after a network-delay fault injected into checkoutservice (RCAEval-RE2-OB); paymentservice and adservice memory deviate more than the root cause. Figure 2a, `Figures/checkoutservice_delay_2.pdf`.
- `motivation-baseline-scores-misrank.png` (2451x1766): root cause scores of ART and Eadro for five services in the same case; paymentservice (0.89 / 0.94) outranks the true root cause checkoutservice (0.85 / 0.92). Figure 2b, `Figures/service_root_cause_scores_1.pdf`.
