# DynaCausal: Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices — Highlights

**Task.** Service-level root cause analysis (RCA) in dynamic microservice systems: given an incident in a time window and the metrics, logs and traces of all services, compute a root cause score per service and rank the services so the top one is the root cause; the ranking guides remediation (Section 1, Section 4.1).

**Challenge.**
- Cascading fault propagation: a fault spreads through inter-service interactions and hides the root cause behind secondary anomalies, while existing methods model invocation links as static binary relations and aggregate symptoms rather than propagation (Section 1, Challenge 1).
- Noise and concept drift: normal fluctuations such as peak-hour traffic resemble fault signals, and the distribution of normal behavior shifts over time; existing multi-modal methods do not contrast a fault period with a service's normal baseline (Section 1, Challenge 2; Section 3).
- Deviation–cause misalignment: most methods rank services by deviation intensity, but downstream services often deviate more than the root cause. In a network-delay case on RCAEval-RE2-OB, the root cause's latency rises from ~0.2 s to ~4.8 s while `paymentservice` and `adservice` show memory shifts about an order of magnitude larger, and ART and Eadro score `paymentservice` (0.89 / 0.94) above the true root cause `checkoutservice` (0.85 / 0.92) (Section 3, Figure 2).
- Data: most public datasets lack the system-interaction and service-internal data needed to model cascades (Section 1).

**Solution.** DynaCausal learns service representations along a dynamic call graph whose edges carry live interaction signals, and trains them with causal objectives that favor the propagation source over its most visibly abnormal victims. It has three stages (Section 4, Figure 3):
- Multi-modal dynamic alignment: metrics, logs (event and severity counts) and traces (latency) become one normalized multivariate time series per service; each time window gets a call graph with edge weight σ(α·request count + (1−α)·error rate).
- System-interaction-aware representation learning: a Transformer Encoder per service over time, then a Hybrid-Aware GAT (H-GAT) that multiplies GAT attention by the dynamic edge weights; an MLP outputs a score per service.
- Causal Representation Discrimination (CRD): Temporal Causal Disentanglement (TCD), a contrastive loss that maximizes the gap between the root cause's anomalous and normal embeddings and minimizes it for other services; Spatial Causal Ordering (SCO), a pairwise ranking loss that puts the root cause's score above its affected upstream and downstream services. Total loss L_CE + λ1·L_TCD + λ2·L_rank.

**Insight.** The paper states three layered insights (Section 1): RCA is about understanding fault propagation patterns, not isolated anomalies; normality evolves with context, so a service should be compared with its own historical baseline; and the service with the largest deviation is not necessarily the root cause, so ranking must encode causal order rather than anomaly magnitude.

**Findings.**
- Dynamic graph construction matters most: replacing it with static graphs gives the largest drop of all ablations, and without it TCD and SCO lose much of their effect (Section 5.3, Table 2).
- Every component helps, and the losses from removing them are larger on the 50-service Train-Ticket dataset than on the 12-service Online Boutique dataset, so temporal and dynamic modeling matter more as fault patterns and service counts grow (Section 5.3).
- More than 2 Transformer layers and λ2 above 0.2 degrade performance (overfitting for layers), while representation dimension and λ1 have little effect (Section 5.4, Figure 4).
- Baselines fail for distinct reasons: single-modality methods have blind spots, the unsupervised ART assumes the strongest symptom is the root cause, and Eadro relies on a static graph (Section 5.2).

**Results.**
- Average AC@1 of 0.63 over the two datasets, with absolute gains of 0.25–0.46 over the baselines (abstract). The paper does not state how the range is computed.
- D1 (Online Boutique, RCAEval-RE2-OB, 90 faults): AC@1 0.769 vs 0.459 for the strongest baseline Eadro (+0.310); MRR 0.873 vs 0.570 for MicroRank (+0.303); Avg@5 0.937 vs 0.776 for Baro (+0.161) (Table 1).
- D2 (Train-Ticket, 50 services, 1,430 fault cases, 25 fault types): AC@1 0.481 vs 0.301 for Eadro (+0.180); AC@5 0.819 vs 0.671 (+0.148); MRR 0.626 vs 0.467 (+0.159) (Table 1, Table 0).
- Single test split per dataset; no seeds or error bars are reported.
