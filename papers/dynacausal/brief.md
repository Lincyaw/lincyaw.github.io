# DynaCausal: brief

## Citation

- Title: DynaCausal: Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices
- Authors: Songhan Zhang, **Aoyang Fang**, Yifan Yang, Ruiyi Cheng, Xiaoying Tang, Pinjia He
- Venue: arXiv preprint (ACM format), 2025
- Links: arXiv https://arxiv.org/abs/2510.22613 · PDF https://arxiv.org/pdf/2510.22613 · DOI: none · Code: none given in the paper
- Honors: none
- Source used: arXiv source tarball, `source/arxiv-src/src.tar.gz` (extracted in `source/arxiv-src/x/`). Note: the Experiment section text calls the method "DyRCA" in several places; it is the same model (tables use the `\model` macro = DynaCausal). The paper does not say how the "0.25–0.46" gain range is computed; from Table 1, the gaps between DynaCausal's two-dataset mean AC@1 (0.625) and each baseline's mean are 0.245 (Eadro) to 0.540 (Nezha).

## One sentence

DynaCausal ranks root-cause microservices with a dynamic call graph, a Hybrid-Aware GAT and two causal losses, reaching average AC@1 0.63.

## Problem

- Microservices form dynamic dependency networks; a fault in one service cascades and masks the true root cause behind secondary anomalies, and existing methods treat invocation links as fixed binary relations (Section 1, Challenge 1).
- Normal fluctuations (peak-hour traffic, monitoring noise) and concept drift produce deviations that resemble fault signals, and existing multi-modal RCA methods conflate them with faults (Section 1, Challenge 2).
- Most models equate RCA with ranking by service deviation intensity, but downstream services often deviate more than the root cause (Section 1, Challenge 3).
- Example: a network-delay fault injected into `checkoutservice` (RCAEval-RE2-OB) raises its latency from ~0.2 s to ~4.8 s, while `paymentservice` and `adservice` show memory shifts about an order of magnitude larger; ART and Eadro both rank these above `checkoutservice` (Section 3, Figure 2). Scores: paymentservice 0.89 (ART) / 0.94 (Eadro) vs checkoutservice 0.85 / 0.92 (Figure 2b).

## Insight

- "The essence of RCA lies in understanding fault propagation patterns, not merely identifying isolated anomalies" (Section 1).
- "The definition of normality in microservice systems evolves with context": contrast a service's current state against its own historical normal baseline (Section 1).
- "The service exhibiting the largest deviation is not necessarily the true root cause": train the model to rank the root cause above the services it affects (Section 1).

## Method

- Multi-modal dynamic alignment: metrics, logs (event and severity counts) and traces (latency) become one multivariate time series per service, min-max normalized and cut into windows; a dynamic call graph is built per window with edge weight = sigmoid of α·request count + (1−α)·error rate (Section 4.2, Eq. 1).
- System-interaction-aware representation learning: a Transformer Encoder per service over time, then a Hybrid-Aware GAT (H-GAT) whose messages combine GAT attention with the dynamic edge weights; an MLP outputs a root cause score per service (Section 4.3).
- Causal Representation Discrimination (CRD): Temporal Causal Disentanglement (TCD), a contrastive loss making the root cause's anomalous embedding differ most from its normal embedding; Spatial Causal Ordering (SCO), a pairwise ranking loss forcing the root cause's score above its affected upstream and downstream services (Section 4.4).
- Training loss L = L_CE + λ1·L_TCD + λ2·L_rank; at inference services are ranked by score (Section 4.5, Figure 3).

## Results

- Average AC@1 of 0.63 across the two benchmarks, absolute gains of 0.25–0.46 over baselines (abstract).
- D1 (Online Boutique, RCAEval-RE2-OB, 12 services, 90 faults): AC@1 0.769, Avg@5 0.937, MRR 0.873; strongest baseline Eadro AC@1 0.459 (Table 1, Table 0).
- D2 (Train-Ticket, 50 services, 1,430 fault cases, 25 fault types): AC@1 0.481, AC@3 0.696, AC@5 0.819, MRR 0.626; Eadro AC@1 0.301 (Table 1, Table 0).
- Ablation: replacing the dynamic graph with a static one causes the largest drop, AC@1 0.769→0.669 on D1 and 0.481→0.395 on D2; ablated variants lose 3.4%–17.9% AC@1 (Table 2, Section 5.3).

## Limits as stated by the paper

- The paper has no limitations or threats-to-validity section. The closest stated weaknesses: accuracy on D2 is generally lower than on D1 because of more diverse fault types and more services (Section 5.2).
- Performance degrades with more than 2 Transformer layers (overfitting) and with λ2 above 0.2 (Section 5.4, Figure 4).

## BibTeX

```bibtex
@article{zhang2025dynacausal,
  title   = {DynaCausal: Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices},
  author  = {Zhang, Songhan and Fang, Aoyang and Yang, Yifan and Cheng, Ruiyi and Tang, Xiaoying and He, Pinjia},
  journal = {arXiv preprint arXiv:2510.22613},
  year    = {2025},
  url     = {https://arxiv.org/abs/2510.22613}
}
```
