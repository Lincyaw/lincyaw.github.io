import"./client-DWNIgpC7.js";import{n as e,r as t,t as n}from"./deck-init-BmQnUuly.js";import{_ as r,a as i,c as a,d as o,f as s,g as c,h as l,i as u,l as d,m as f,n as p,o as m,p as h,r as g,s as _,t as v,u as y,v as b}from"./section-evaluation-CyE15gr8.js";var x={AwsCascade:b,RcaPipeline:r,SimpleRca:c,SrcaResults:l,BenchDeficiency:f,BenchLoop:h,HierarchyTree:s,BenchCompare:o,SotaCollapse:y,FaultHeatmap:d,FailureModes:a,ClosingTakeaway:_,IncidentHard:m,BenchNeeds:i,CloudIncidents:u,SectionPreliminary:g,SectionBenchmark:p,SectionEvaluation:v};function S(){return e({html:`
      <img class="cover-photo" src="images/cover.png" alt="CUHK-Shenzhen">
      <div class="cover-title">Rethinking the Evaluation of Microservice RCA<br>with a Fault Propagation-Aware Benchmark</div>
      <div class="authors"><strong>Aoyang Fang</strong>, Songhan Zhang, Yifan Yang, Haotong Wu, Junjielong Xu<br>Xuyang Wang, Rui Wang, Manyi Wang, Qisheng Lu, Pinjia He</div>
      <div class="affiliation">The Chinese University of Hong Kong, Shenzhen</div>
      <div class="affiliation-sub">School of Data Science | School of Artificial Intelligence</div>
    `,notes:`Microservice architectures bring agility but also operational complexity — failures cascade through service dependencies. Enterprise downtime costs exceed $23,000 per minute. Automating root cause analysis from metrics, logs, and traces is critical to reducing MTTR.

This talk: we show that widely-used RCA benchmarks are too simple, build a better one, and reveal three fundamental bottlenecks in SOTA algorithms.`})}function C(){return t({title:`Cloud incidents cost billions`,component:`CloudIncidents`,steps:1,notes:`Three real-world cloud incidents that show why RCA matters:
  • CrowdStrike (2024.07): a faulty update pushed to millions of Windows machines → ~$5.4B in Fortune 500 losses.
  • AWS US-EAST-1 (2025.10): a DNS misconfiguration cascaded through 6 layers → 15+ hour outage affecting 1000+ companies, >$1.1B estimated losses.
  • Meta (2021.10): a BGP configuration change disconnected all Facebook data centers → 6 hours, 3.5 billion users affected, ~$100M in lost ad revenue.

Key message: these are not rare events. Cloud failures are inevitable in distributed systems, and the ability to quickly pinpoint root causes is a business-critical capability.`})}function w(){return t({title:`AWS 2025: A DNS race cascaded through 6 layers`,component:`AwsCascade`,steps:7,x:20,y:62,w:1240,h:650,notes:`This is the AWS us-east-1 outage that took down Snapchat, Zoom, Slack for 15+ hours.

Step 0 — DNS Race (root cause): AWS has internal workers that apply DNS config changes. Two workers tried to update the same DynamoDB endpoint simultaneously. Worker A added new IPs, Worker B removed old IPs — but B's delete also wiped A's additions. Result: the DNS entry for DynamoDB had zero IPs.

Step 1 — DynamoDB API failure: With no IPs in DNS, no client could resolve the DynamoDB endpoint. All API calls failed region-wide.

Step 2 — DWFM lease collapse: DWFM (the internal placement service) stores host leases in DynamoDB. When DynamoDB went down, leases couldn't be renewed and expired in bulk. On recovery, all hosts tried to re-register at once — congestive collapse.

Step 3 — EC2 launch failure: DWFM tracks which physical hosts are available. With DWFM down, EC2 had no host inventory — no new instances could launch.

Step 4 — Network Manager state backlog: EC2 failures triggered a flood of network state changes (ENI detach/attach). The queue grew faster than it could be processed.

Step 5 — NLB health flip-flop: Network Manager backlog meant NLB health checks got stale/delayed results. Targets flipped between healthy and unhealthy repeatedly, causing connection resets.

Step 6 — Users: End users saw 503s, timeouts, and service unavailability across Snapchat, Zoom, Slack, and other services for 15+ hours.

Key point for the talk: The root cause (a DNS race condition) is 6 layers away from what users saw. An RCA algorithm that only looks at the loudest signal would blame NLB or the user-facing service — not the DNS worker race.`})}function T(){return t({title:`How RCA works in papers`,component:`RcaPipeline`,steps:6,x:20,y:62,w:1240,h:650,notes:`This slide explains the standard RCA pipeline used in research papers.

Step 0 — Failure: a user-visible failure occurs (e.g., HTTP 500, timeout). This triggers the RCA process.

Step 1 — Metrics: time-series data collected from each service — CPU usage, memory, request latency, error rate, etc. Threshold-based or statistical anomaly detection flags abnormal services.

Step 2 — Logs: event text from application and system logs. Error keywords (ERROR, EXCEPTION, FAIL) and log volume spikes help identify problematic services.

Step 3 — Traces: distributed request spans showing the call chain across services. Latency breakdown reveals which service in the chain is slow or failing.

Step 4 — RCA Model: takes the multi-modal telemetry as input and applies graph-based, ML-based, or causal inference methods to identify the root cause. Early work used single modalities; the recent trend is multi-modal integration.

Step 5 — Top-K ranking: the model outputs a ranked list of candidate root causes. Evaluated by Top@1 (is the true root cause ranked first?), Top@K, MRR, and Avg@K.

Key question: are these models actually learning complex causal reasoning, or are the benchmarks so simple that trivial heuristics suffice?`})}function E(){return t({title:`Preliminary Study`,component:`SectionPreliminary`,steps:2,notes:`Section: Preliminary Study. We assess how "simple" existing benchmarks really are using three research questions:
  • RQ1: What are the structural and runtime characteristics of existing RCA benchmark datasets?
  • RQ2: How does a deliberately simple baseline (SimpleRCA) perform compared to SOTA models?
  • RQ3: What explains SimpleRCA's surprisingly strong performance?

We selected 11 public multimodal RCA datasets from 5 benchmark suites: Eadro (TT, SN), Nezha (TT, OB), RCAEval (RE2/RE3 × TT/OB/SS), AIOps-2021, and GAIA. These cover 5 different microservice systems.`})}function D(){return t({title:`What makes real incidents hard?`,component:`IncidentHard`,steps:5,notes:`Step 0 — Fault propagation: real incidents cascade across layers (like the AWS example — DNS → DynamoDB → EC2 → Users). The root cause is several hops away from what breaks.

Step 1 — Misleading symptoms: the loudest signal (most anomalous service) is usually a downstream victim, not the root cause. An RCA method that just picks the noisiest service will get it wrong.

Step 2 — Benchmark stats: yet existing benchmarks are small and shallow. Four stats:
  • 30–159 cases per dataset (excluding GAIA's 1,097) — too few scenarios for robust evaluation.
  • 2–3 max call depth in 7 of 12 datasets — call chains are short, so there's no real propagation to reason about. (A few reach 4–5 hops, but most don't.)
  • 1–2 fault types in most datasets — e.g. Eadro only has network + resource faults. Some like AIOps-2021 have more, but distributions are heavily skewed.
  • 99% lack full observability — 733 of 737 cases across all benchmarks lack fault-relevant observability data. The paper defines two criteria: (1) each fault type must be paired with its corresponding data type (e.g. network faults need traces, CPU faults need metrics), and (2) faults must propagate to user-facing status codes. Only 4 cases in RE2-OB meet both criteria.

Step 3 — Question: do these benchmarks actually test causal reasoning?

Step 4 — Transition: to find out, we designed a deliberately simple probe (SimpleRCA).`})}function O(){return t({title:`SimpleRCA: a deliberately simple probe`,component:`SimpleRca`,steps:5,x:20,y:62,w:1240,h:650,notes:`SimpleRCA is a deliberately naive baseline that simulates a domain expert's intuitive troubleshooting. It uses three simple rules — one per data modality — to see if SOTA results can be matched without any real causal reasoning.

Step 0 — Metrics: for each service metric, compute a threshold using the 3-sigma rule or P95 of historical data. If current value exceeds the threshold → alert.

Step 1 — Traces: compute the P95 latency for each service from its spans. If latency exceeds 3× the normal-period baseline → alert.

Step 2 — Logs: count log entries containing error keywords (ERROR, FAIL, EXCEPTION) per service. If count exceeds a preset threshold → alert.

Step 3 — Count alerts: sum all alerts (from metrics + traces + logs) per service into a single count.

Step 4 — Rank: sort services by alert count, descending. The service with the most alerts is predicted as root cause.

This is intentionally trivial — no graph construction, no causal inference, no ML. If this matches SOTA performance, the benchmark is shortcut-friendly and doesn't actually test causal reasoning.`})}function k(){return t({title:`The shortcut performs too well`,component:`SrcaResults`,steps:3,x:50,y:80,w:1180,h:620,notes:`This table compares SimpleRCA against the best SOTA method on each dataset. SOTA results are taken directly from the original papers.

Step 0 — Green highlights: 7 datasets where SimpleRCA wins on Top@1. Examples:
  • Nezha-TT: SimpleRCA 0.93 vs Nezha 0.87
  • RE3-TT: SimpleRCA 0.83 vs BARO 0.50
  • RE3-SS: SimpleRCA 0.83 vs BARO 0.00
  SimpleRCA is also orders of magnitude faster — it runs in seconds while SOTA models can take minutes.

Step 1 — Red highlights: 4 datasets where SOTA wins, but the gap is small (≤ 0.18):
  • Nezha-OB: Nezha 0.93 vs SimpleRCA 0.91 (gap = 0.02)
  • Eadro-TT: Eadro 0.99 vs SimpleRCA 0.81 — but Eadro has substantial overlaps between training and test sets
  • Eadro-SN: Eadro 0.97 vs SimpleRCA 0.83
  • AIOps-2021: ART 0.72 vs SimpleRCA 0.63
  Even where SOTA leads, the advantage doesn't widen with relaxed Top@K metrics.

Step 2 — Summary: 7/11 datasets beaten by a trivial probe. A probe that should not match sophisticated published models. This means the benchmarks are too easy — they don't actually test the causal reasoning these models claim to perform.

Note: GAIA was excluded because of ground-truth annotation inconsistencies.`})}function A(){return t({title:`Why does the shortcut work?`,component:`BenchDeficiency`,steps:4,x:30,y:70,w:1220,h:640,notes:`We studied 737 cases across 11 benchmarks and classified every case into three types based on where the anomaly signal appears.

Step 0 — Type I "Localized" (68%): only the injected (root-cause) service shows an anomaly. The faulty service is the loudest — trivially easy. Any method that just picks the noisiest service gets it right. No causal reasoning needed.

Step 1 — Type II "Under-expressed" (18%): no service shows any anomaly signal at all. The fault was injected but it didn't manifest in the telemetry. Impossible for any method — there's nothing to detect.

Step 2 — Type III "Propagated" (14%): downstream services are louder than the root cause. This is the only type that actually tests causal reasoning — the method must trace back from the symptom to the origin.

Step 3 — Summary: 68% trivially easy + 18% impossible = 86% of cases fail to test causal reasoning. Only 14% are meaningful. Additionally, 99% of cases (733/737) lack fault-relevant observability data — the fault type isn't paired with its corresponding telemetry (e.g. network faults without traces) or the fault doesn't propagate to user-facing status codes. Only 4 cases in RE2-OB meet the paper's "comprehensive observability" criterion.`})}function j(){return t({title:`Benchmark Construction`,component:`SectionBenchmark`,steps:2,notes:`Section: Benchmark Construction. Motivated by the gap identified in the preliminary study, we build a new benchmark framework with three innovations:
  1. Systematic fault generation — explores a structured fault space of 31 fault types across 7 categories via stratified random sampling, instead of a handful of manual injections.
  2. Impact-driven validation — filters out silent faults by checking whether they cause detectable degradation in user-facing SLIs (success rate, latency).
  3. Highly dynamic system environment — uses TrainTicket (50 services) with a state-machine-driven workload generator that creates combinatorial execution paths, not static requests.`})}function M(){return t({title:`What does a realistic benchmark need?`,component:`BenchNeeds`,steps:3,notes:`What the preliminary study told us is missing. A realistic benchmark must preserve three properties:

Step 0 — Known fault source: we must know exactly where the fault was injected so the ground truth is unambiguous. Our injection parameters directly yield hierarchical labels (service → pod → container → metric/span/function).

Step 1 — Propagation path: faults must cascade through service dependencies, creating deep call chains (max depth 7 in our benchmark vs. 2–3 in most existing ones). This ensures the root cause is not trivially co-located with the loudest symptom.

Step 2 — Validated user impact: not all injected faults actually break things — many are absorbed by system resilience. We filter with a validation oracle that checks user-facing SLIs. Only faults causing detectable degradation (success-rate drops or latency spikes) are kept. This is why 84.4% of our 9,152 initial injections were filtered out, leaving 1,430 validated cases.`})}function N(){return t({title:`The benchmark generator is a closed loop`,component:`BenchLoop`,steps:10,notes:`The framework is a closed-loop pipeline. Each click reveals the next component:

Steps 0–1 — System Foundation: TrainTicket, the largest open-source microservice system (50 services), simulates a real-world online ticketing platform. We enhanced it with comprehensive Kubernetes monitoring and stabilized JVM heap sizes to establish a clean baseline.

Steps 2–5 — Dynamic Load Generator: a state-machine-based workload. Workflows are modeled as a directed graph of states (required parameters) and transitions (methods). Transitions can recursively trigger sub-workflows. Example: the booking workflow expands to 6 × 3 × 2 = 36 combinations. This exposes defects that static workloads would miss.

Step 6 — Fault Controller: uses ChaosMesh to inject faults from a structured space of 31 fault types across 7 categories (resource, network, HTTP, JVM code, DNS, time, disk). Stratified random sampling ensures all categories are covered.

Step 7 — Telemetry: an OpenTelemetry-based stack collects Kubernetes metrics, trace-correlated logs, distributed traces, and L4/L7 network telemetry, all stored in ClickHouse.

Steps 8–9 — SLI Validator + Filtering: a validation oracle checks whether the injected fault caused user-facing degradation (success-rate drops via Z-test, latency spikes via hard + adaptive thresholds). 84.4% of 9,152 injections were silent — only 1,430 cases with validated impact are kept. 6 of 31 fault types were dropped entirely, leaving 25 validated types.

The feedback loop steers subsequent injections toward underrepresented failure types.`})}function P(){return t({title:`Ground truth is hierarchical`,component:`HierarchyTree`,steps:5,x:20,y:80,w:1240,h:620,notes:`Our ground truth labels are hierarchical, not flat. Prior studies used inconsistent granularities — some label at service level, others at function level — making cross-method comparison unfair.

Step 0 — Service level: ts-order-service is the root-cause service. This is the coarsest level and the one most baselines can produce.

Step 1 — Pod level: ts-order-pod-1 is the specific pod where the fault was injected. Useful for methods that can distinguish between replicas.

Step 2 — Container level: order-container within the pod.

Step 3 — Leaf levels (Metric / Span / Function): the most fine-grained labels. A specific metric (cpu_usage: 98%), a specific trace span (POST /api/order), or a specific function (createOrder()). Only some methods (e.g., Nezha for functions, MicroDig for spans) produce output at this level.

Step 4 — Summary: A fine-grained label implies the coarse-grained one but not vice versa. Labeling a function as faulty means its service is also faulty. This lets researchers evaluate at whatever precision their model supports.

In this paper, we report service-level results because that's the only granularity common to all 12 baselines. Even at this level, Top@1 collapses to 0.21 average.`})}function F(){return t({title:`Evaluation`,component:`SectionEvaluation`,steps:1,notes:`Section: Evaluation. Two research questions:
  • RQ4: How does our benchmark compare to existing datasets in scale and complexity?
  • RQ5: How do SOTA RCA models perform on this new benchmark, and what are their primary failure modes?

We re-engineered 11 SOTA RCA methods into a unified, containerized evaluation framework with standardized input interfaces. Methods span single-modal (metrics: Baro, MicroRCA, CausalRCA, MicroHECL; traces: MicroRank, MicroDig) and multi-modal approaches (Nezha, Eadro, DiagFusion, Art, Shapleyiq). Plus SimpleRCA as baseline.`})}function I(){return t({title:`Our benchmark vs. existing datasets`,component:`BenchCompare`,steps:5,notes:`Side-by-side comparison of our benchmark vs. the best existing dataset on each of 8 dimensions. Click reveals each row progressively.

  • Validated cases: 1,430 vs. 159 (AIOps-21). Nearly 10× more failure scenarios.
  • Services: 50 vs. 69 (RE2-TT). RE2-TT has more services but lower coverage.
  • Service coverage: 84% (42/50) vs. 61% (28/46, Nezha-TT). Our dynamic workload exercises far more of the service graph. RE2-TT only covers 39% (27/69).
  • Max call depth: 7 vs. 5 (RE2-TT). Deeper chains create real symptom drift — root cause is far from the loudest signal. Most datasets max at 2–3.
  • QPS (avg): 16.47 vs. 4.35 (RE2-TT). Higher QPS means more data volume and noise, testing scalability and noise-resistance. Nezha-TT runs at only 0.13 QPS.
  • Log lines: 154.7M vs. 21.3M (RE2-TT). 7× more log data.
  • Traces: 11.2M vs. 3.1M (GAIA). 3.6× more traces.
  • Fault types: 25 vs. ~6 (most datasets). 6 categories: resource, network, HTTP, JVM code, DNS, time. Most datasets have 1–2 types.

The only dimension where we don't lead is service count (50 vs. 69), but we compensate with much higher coverage. The "best existing" column shows different datasets for different dimensions — no single existing dataset leads across the board.`})}function L(){return t({title:`SOTA accuracy collapses on the new benchmark`,component:`SotaCollapse`,steps:4,notes:`All 12 algorithms evaluated on our benchmark. The bar chart ranks by Top@1; additional columns show Top@3, Top@5, and execution time.

Step 0 — Green bars (top performers): MicroRCA leads at 0.37, Baro at 0.36, MicroDig at 0.35, MicroHECL at 0.34. Mean Top@1 across all models is only 0.21 — a dramatic drop from the 0.7–0.9 range on existing benchmarks.

Step 1 — Red bar (SimpleRCA): 0.28 Top@1. It no longer dominates — on existing benchmarks it beat 7/11 SOTA results, but here it's in the middle of the pack. This confirms our benchmark creates scenarios that trivial heuristics cannot solve.

Step 2 — Red time highlight: CausalRCA takes 927 seconds per case (15+ minutes for an 8-minute data window). Nezha takes 94.6s. These are impractical for production use. By contrast, SimpleRCA runs in 0.9s and Baro in 1.0s.

Step 3 — Summary line: "Best Top@1 = 0.37 · SimpleRCA = 0.28 · The shortcut no longer dominates." Three key takeaways: (1) absolute performance is very low, (2) the shortcut no longer wins, (3) no single algorithm dominates across all fault types. The three training-based methods (DiagFusion, Eadro, Art) that require a train/test split performed worst at 0.04–0.16.`})}function R(){return t({title:`Model behavior changes across realistic fault types`,component:`FaultHeatmap`,steps:7,notes:`Heatmap showing Top@1 performance for all 25 fault types × 12 algorithms. Each dot: green = high, yellow = medium, red = low/zero. Each click highlights one fault category.

Step 0 — Lifecycle (ContainerKill, PodKill, PodFailure): most models do well here. These faults produce clear signals — component crashes cause obvious metric spikes and log errors. Baro MRR 0.87 for ContainerKill, 0.95 for PodKill.

Step 1 — Resource (JVMCPUStress, JVMMemoryStress): also relatively easy. Resource stress produces unambiguous metric signals. But note: ~100% of initial CPUStress/MemoryStress injections were filtered as silent — only carefully calibrated intensities produce observable impact.

Step 2 — HTTP (9 fault types including ReqAbort, RespDelay, RespReplaceCode, etc.): mixed performance. HTTPRequestAbort and HTTPResponseReplaceCode have near-100% impact rates. But performance varies — SimpleRCA's Top@1 on HTTPRequestAbort is only 0.13 (though Top@5 jumps to 0.93, showing ranking capability).

Step 3 — JVM (JVMException, JVMLatency, JVMMySQLLatency, JVMReturn): code-level faults. JVMReturn is especially hard because targeted methods may never be invoked by the workload.

Step 4 — Network (Bandwidth, Corrupt, Delay, Loss, Partition): sharp performance drop for almost all models. Even the best model (Shapleyiq) only gets MRR 0.40 for NetworkCorrupt. These subtle, intermittent faults require deep understanding of system interactions.

Step 5 — Blind spots (DNSRandom, TimeSkew): near-total failure across ALL models. Performance at or near zero. These represent fundamental blind spots in current observability — the telemetry doesn't capture enough information for diagnosis.

Step 6 — Summary: "No universal winner — performance depends on fault type." No single algorithm excels across all categories. Strengths are coupled to each model's underlying assumptions.`})}function z(){return t({title:`The failures cluster into three bottlenecks`,component:`FailureModes`,steps:4,notes:`We manually analyzed the 262 hardest cases where ≥10 of 12 models failed (including SimpleRCA). Inductive coding revealed three primary failure modes. A single case can be labeled with multiple modes; percentages are from total label count.

Step 0 — Scalability Issues (39.8%): CausalRCA takes 927s and Nezha 94.6s per case on our 8-minute data windows — impractical for production. Under a realistic 4-CPU-core constraint, most models' execution time grows at least linearly with data volume. Eadro and Art are especially expensive even on small data because of deep-learning data preparation overhead.

Step 1 — Observability Blind Spots (5.8% + 4.2% + 2.9% = 12.9%): three distinct subtypes:
  • Signal-Loss (5.8%): models fail to interpret the cessation of telemetry as a signal. E.g., PodKill causes metrics to stop — frequency-based models like Nezha interpret silence as "normal."
  • Infrastructure-Level (4.2%): faults in unmonitored components (e.g., databases) that we deliberately included to test robustness.
  • Semantic-Gap (2.9%): contradictions between telemetry sources — e.g., an error log alongside a "success" trace status creates a paradox.
  These blind spots often compound, creating contradictory signals.

Step 2 — Modeling Bottlenecks (47.4%): the largest category. Core model assumptions are invalidated by complex failure patterns. Example: Nezha assumes faults increase event frequency, but PodKill causes signals to cease — the model misinterprets absence as normal. Many models' rigid assumptions cannot accommodate the diverse and "subtractive" nature of real-world failures.

Step 3 — Summary: three orthogonal bottlenecks — scalability, observability, modeling. No single algorithm dominates. One-size-fits-all designs are fundamentally inadequate. The average Top@1 of 0.21 leaves enormous room for improvement.`})}function B(){return t({title:`Takeaways`,component:`ClosingTakeaway`,steps:4,notes:`Three takeaways from the paper:

Step 0 — Benchmark quality determines research direction: the same algorithms rank completely differently on easy vs. hard benchmarks. SimpleRCA beat 7/11 SOTA on existing benchmarks but is middle-of-the-pack on ours. The reported "progress" of SOTA methods was partly an artifact of benchmark simplicity.

Step 1 — Three orthogonal bottlenecks revealed: modeling assumptions (47.4%), scalability under resource constraints (39.8%), and observability blind spots (12.9%). These are independent failure modes — fixing one doesn't help the others. Future RCA research should address all three.

Step 2 — Open benchmark and tools: we release the full artifact — 1,430 validated failure cases, 25 fault types, 12 re-engineered algorithms in a containerized unified framework, the benchmark generation pipeline, and hierarchical ground-truth labels. Available at the QR code URL.

Step 3 — QR code: scan to access the benchmark, code, and data at the project website.

Closing message: do not optimize for an easy benchmark. Academic benchmarks must proactively simulate imperfect production conditions — incomplete observability, deep cascading faults, high data volumes — to foster models that actually work in the real world.`})}async function V(){let e=[S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B].map(e=>e());return e.forEach((e,t)=>{let n=`<div class="page-no">${String(t+1).padStart(2,`0`)}</div>`;e.html.includes(`class="page-no"`)||(e.html+=`
`+n),e.html+=`
<div class="inst-mark">CUHK-Shenzhen</div>`}),e}n({buildSlides:V,components:x});