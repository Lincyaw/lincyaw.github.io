# Gleaner: A Semantically-Rich and Efficient Online Sampler for Microservice Diagnostics — Highlights

Source: arXiv 2604.16810v1 (ISSTA 2026). Section and table numbers refer to that version.

**Task.** Online tail-based sampling of distributed traces in microservice systems: from a high-volume stream of completed traces and their associated logs, keep a small subset, within a fixed budget and at per-trace online speed, that preserves the anomalous and rare traces that downstream root cause analysis (RCA) needs (abstract; Section 1).

**Challenge.**
- Trace volume reaches terabytes daily and is long-tailed: in Train-Ticket the top 24.3% of paths account for 82.3% of traces, so random sampling keeps redundant traces and drops rare ones (Section 2.1).
- Existing tail-based samplers rely on span-level information (call structure, span status, latency) and are blind to intra-span events; a trace with status OK and 47 ms latency can carry a critical ERROR log and be discarded (Section 1, Fig. 1).
- The few samplers that do use logs rely on heterogeneous graph neural networks that need offline training and are too slow for online, high-throughput use: a fidelity-performance trade-off (Section 1, Table 1).

**Solution.** Gleaner encodes each trace, with its logs, as an event-pair set (EPS) and replaces graph algorithms with set operations, then picks traces by alarm-driven quotas and diversity. The Trace Encoder builds, for each span, a canonical event sequence (span start, Drain log templates, error and performance-degradation markers, span end), takes its bi-grams, links parent end to child start, and computes an anomaly score from span errors, WARN/ERROR log counts and latency (Section 3.2, Algorithm 1, Eq. 1). The Quota Allocator groups traces by root span (entry API), raises the total budget when an alarm coincides with a traffic drop, and boosts alerted API groups up to 3x the average under a cap (Section 3.3). The DPP Selector runs a fast greedy Determinantal Point Process whose kernel holds anomaly scores on the diagonal and EPS Jaccard similarity off the diagonal, made online-capable by early termination and a cross-batch LRU similarity cache with a 91.8% hit rate (Section 3.4). The paper also contributes a dataset of 161 fault-injection cases, over 1.4 million traces and 517 distinct call paths from Train-Ticket (Section 1).

**Insight.** "Explicit, computationally expensive graph structures are not necessary for high-fidelity, semantically-aware sampling" (Section 1): a hashable set of local event pairs captures both inter-span structure and intra-span log semantics, removes fan-out duplication, and makes similarity a cheap Jaccard computation (Section 3.2, Insight 1). A second, design-level insight: an online sampler should mimic an SRE's focus during an incident by following external alarms (Section 3.3, Insight 2).

**Findings.**
- Gleaner's gains are largest in systems with multiple business entry points and richer in-span events; with a single entry point (SockShop) it degrades toward a structure-driven diversity sampler while staying competitive with TracePicker (Section 4.3, Finding 1; Section 5.1).
- Exact graph matching is too rigid for microservices: replacing EPS with a WL graph kernel lowers pattern coverage from 39.9% to 32.8% while runtime grows 8.4x, because concurrent fan-out makes identical logical requests structurally distinct (Section 4.4).
- Anomaly prioritization and diversity selection only help together: Pure Anomaly, Pure Diversity and w/o Diversity variants fail to beat the unsampled data on RCA, and on Nezha Pure Anomaly and Pure Diversity fall below Random (Section 4.5, Table 7).
- Different RCA tools need different data properties: ShapleyIQ depends on root-span grouping to keep a healthy baseline per endpoint (AC@3 at 1% drops from 0.64 to 0.21 without grouping), while Nezha depends on anomaly-guided diversity (Section 4.5, Table 7).
- Removing alarms trades fault relevance for diversity: Proportion Anomaly drops while entropy and coverage rise slightly (Section 4.4).

**Results.**
- Efficiency at a 5% target rate (Dataset A): 0.741 ms per trace vs 1.008 ms for TracePicker (26.5% faster) and 69.857 ms for TraStrainer (94x); highest benefit-cost ratio, 0.81 vs 0.76 for TracePicker; actual sampling rate exactly 5.0%, while non-deterministic baselines overrun up to 18.86x (Section 4.6, Table 8).
- Sampling quality at a 10% rate (Dataset A): 11.6%–128.7% higher Trace Pattern Coverage and 2.8%–32.9% higher Shannon Entropy than the baselines; at 0.1%, Proportion Rare is 0.992, 3.5x TracePicker (Section 4.3).
- Cross-system (Dataset B, five systems, trace-only variant): average Trace Pattern Coverage 0.689 at 10%, 0.088 above TracePicker and 2.8–4.0x the other methods (Section 4.3).
- Downstream RCA at a 1% sample (Table 6): ShapleyIQ AC@1 0.56 vs 0.27 for the next-best sampler (+107%) and AC@3 0.64 vs 0.45 (+42%); Nezha AC@1 0.19 vs 0.11. The Section 4.5 text attributes +107% and +42% to Nezha; the ratios match the ShapleyIQ rows instead.
- RCA on the 1% sample beats the unsampled data: ShapleyIQ AC@1 0.56 vs 0.41 (+36.6%), Nezha AC@1 0.19 vs 0.11 (+72.7%) and AC@3 0.45 vs 0.27 (+66.7%); MicroRCA matches the unsampled accuracy with 99% less data (Section 4.5, Table 6).
