# Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark — Highlights

Source: /home/ddq/AoyangSpace/FSE26 (LaTeX). Section, table and figure numbers follow that source; see brief.md for citation and noted inconsistencies.

**Task.** Test whether the public benchmarks used to evaluate data-driven root cause analysis (RCA) models for microservices, which take metrics, logs and traces and rank the faulty service, reflect real-world failure complexity, and re-evaluate state-of-the-art (SOTA) models on a benchmark that does (abstract; Sec. 1).

**Challenge.**
- Reported progress may be an artifact of the benchmarks: SimpleRCA, a deliberately naive rule-based baseline that ranks services by the number of threshold alerts, matches or surpasses SOTA models on four widely used public benchmarks (abstract; Sec. 3.2, Table 2).
- Existing datasets are small (all but GAIA have fewer than 200 fault cases), shallow (seven datasets max out at 2–3 hops) and narrow in fault types (Sec. 3.2, RQ1; Table 1).
- 0.99 of cases lack at least one type of fault-relevant observability data, so models are also deprived of diagnostic signals (Table 3).
- Building a harder benchmark is itself hard: many injected faults are silent or absorbed by system resilience, so injection alone does not yield usable failure cases (Sec. 4.7).

**Solution.** An automated, closed-loop benchmark-generation framework that injects faults into a large microservice system and keeps only failures with discernible impact on user-facing SLIs, so that faults propagate and the root cause is no longer the obvious symptom (abstract; Sec. 4.1, Fig. 3). It runs on TrainTicket (50 services) under a state-machine-driven dynamic workload; a controller samples, by stratified random sampling, a fault space of 31 fault types in 6 categories (over 10^16 configurations) through ChaosMesh; an OpenTelemetry stack collects metrics, logs, traces and network telemetry; ground truth is a hierarchical label tree from service down to pod, container and metric, span or function; a validator applies Z-tests and latency thresholds to user-facing SLIs (Sec. 4.2–4.8). The resulting dataset has 1,430 validated failure cases from 9,152 injections over 25 fault types (abstract). The authors re-engineer 11 SOTA models (graph-based, ML/DL, causal/statistical) into one containerized evaluation framework with standardized inputs and tune each on the new benchmark (Sec. 5.3). The framework, dataset and re-engineered models are publicly released (abstract; Sec. 8, Data Availability).

**Insight.** Existing benchmarks are easy because, in most cases, the root-cause service shows the most prominent fault symptom, so simple correlation finds it and the causal inference that advanced models are built for is never exercised (Sec. 1). A benchmark that separates models must therefore decouple the true cause from the loudest symptom through fault propagation (Sec. 6.2.3).

**Findings.**
- The measurement behind the Insight: across 737 cases in 11 public datasets, 0.86 are Type I (pronounced symptoms only in the injected service) or Type II (no pronounced symptoms anywhere) (Table 3).
- Effective injection needs calibrated intensity and location: 84.4% of initial injections produced no user-visible anomaly, near 100% for CPUStress and MemoryStress, and JVM faults on methods the workload never calls stay inert; HTTP-semantics faults reliably cause anomalies (Sec. 6.1.1; Fig. 6).
- No single algorithm dominates; performance depends on fault type: lifecycle and resource faults (ContainerKill, PodKill, JVMMemoryStress) are diagnosed well, network faults poorly, DNSRandom and TimeSkew near zero, while Shapleyiq is near perfect on delay faults (MRR > 0.97) (Sec. 6.2.2; Fig. 8).
- Some models (Eadro, MicroHECL) behave all-or-nothing, with equal Top@1 and Top@5, while SimpleRCA, Shapleyiq and Baro rank the cause into a short list (e.g. SimpleRCA on HTTPRequestAbort: Top@1 0.13, Top@5 0.93) (Sec. 6.2.3; Fig. 9).
- In the 262 hardest cases, failures stem from modeling bottlenecks (47.4% of labels; e.g. Nezha assumes faults raise event frequency, which PodKill violates), scalability issues (39.8%) and observability blind spots (signal-loss 5.8%, infrastructure-level 4.2%, semantic-gap 2.9%) (Sec. 6.2.4; Fig. 10).

**Results.**
- On the new benchmark, mean Top@1 across the 11 SOTA models is 0.21; the best, MicroRCA, reaches 0.37; SimpleRCA drops to 0.28 (abstract; Sec. 6.2.1; Table 5).
- MicroDig has the best Top@3 (0.61) and MRR (0.48); SimpleRCA the best Top@5 (0.80) and lowest time (0.90 s) (Table 5).
- Execution times escalate from seconds to hours; without resource limits CausalRCA needs 927.11 s and Nezha 94.62 s on average per 8-minute window (abstract; Sec. 6.2.4; Table 5).
- On the old benchmarks, by contrast, SimpleRCA reaches Top@1 0.93 vs Nezha 0.87 on Nezha-TT, and 0.83 vs BARO 0.50 and 0.00 on RE3-TT and RE3-SS (Table 2).
- The benchmark is heavier and deeper than prior ones: 16.47 average QPS vs 0.14 (Nezha-TT), 0.25 (Eadro-TT), 4.35 (RE2-TT) and 1.34 (RE3-TT); service coverage 84% (42/50) vs 39% (RE2-TT), 61% (Nezha-TT) and 48% (Eadro-TT); maximum call depth 7 vs typically 2–4 (Sec. 6.1.2).
