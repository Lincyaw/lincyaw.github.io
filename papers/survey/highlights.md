# A Goal-Driven Survey on Root Cause Analysis — Highlights

Source: arXiv v1 (source/arxiv-src, source/arxiv-pdf). Section, table and figure numbers follow the arXiv v1 PDF; see brief.md for citation and noted inconsistencies.

**Task.** Survey research on root cause analysis (RCA) for incident management in large-scale cloud and microservice systems, organizing the papers by the goal each one pursues rather than by its input data, and relate every formulation to one ideal definition of RCA (abstract; Sec. 1).

**Challenge.**
- "RCA" covers tasks with distinct goals: an SRE minimizing MTTR seeks the trigger (e.g. a traffic spike), while a developer making a permanent fix seeks the root cause (e.g. a buggy code commit); roles also differ in data access, input, analysis depth and output granularity (abstract; Sec. 1).
- Studies tailor their formulation to one implicit goal, producing many task-specific solutions that are hard to compare or generalize (Sec. 1).
- Previous surveys categorize papers by input data type (metric-based vs trace-based); input and objective are not one-to-one, so this groups works with disparate goals and separates works with shared ones, obscuring progress and gaps (abstract; Sec. 1).

**Solution.** A goal-driven taxonomy anchored in one formal ideal: RCA is a function F: O → G that maps observation data O = {Logs, Metrics, Traces, Events, Supplementary data} to an incident propagation graph G, a DAG whose event nodes are root causes, optional triggers, intermediate events and symptoms (Sec. 3.3; Fig. 3, Fig. 4). The root cause answers "what"; the propagation paths in G answer "how" and "why" and serve as the evidence chain to verify the root cause, understand the blast radius and prevent recurrence (Sec. 3.3). From the incident management lifecycle and four perspectives (Input, Inference, Output, Efficiency) the authors derive seven fundamental goals: multi-dimensional data correlation, robustness, adaptive learning, real-time performance, interpretability, multi-granularity and actionability (Sec. 1; Sec. 3.2). A systematic literature review (DBLP keyword search over SE, systems, AI/data-mining/database and related venues, then backward and forward snowballing to saturation) collects 135 papers from 2014–2025 (abstract; Sec. 4.2; Table 1). Each paper is mapped to its input subset of O, the simplified form of G it outputs and its granularity, its main goal, and its evaluation and open-source status; each goal chapter tabulates paradigms and representative works (Sec. 4.3; Tables 2–8). The survey also compiles public benchmarks, datasets and tools (Sec. 12.3–12.5; Tables 9–11).

**Insight.** "The seemingly ad-hoc nature of RCA research is, in fact, a collection of rational, focused efforts to push the boundaries of" an Effectiveness-Data-Cost Triangle "along specific vectors": better RCA needs more and better data, which costs more to collect and compute, so each line of work trades along one edge, and those vectors are the seven goals (Sec. 3.1–3.2).

**Findings.**
- Research simplifies the ideal: most studies identify only the root cause node r, sometimes the symptom s, rather than causal edges and triggers, so the field operates in a "point-finding" rather than a "graph-building" paradigm (Sec. 3.3; Sec. 13.3).
- The emphasis on resource faults reflects an implicit simplification strategy: resource causes give clear metric signals, while code, configuration and user-request causes need harder correlation of logs and traces (Sec. 12.2).
- Goals interact: interpretability (causal graphs) supports actionability, while real-time performance tends to cost interpretability and adaptivity can conflict with robustness (Sec. 13.2).
- Early work focused on real-time performance and multi-granularity; with LLMs the frontier shifts toward interpretability and actionability (Sec. 13.2).
- Several foundational benchmarks are stale (TrainTicket not updated in over two years, Sock Shop archived), and their fault injection is mostly resource-level, limiting study of adaptive learning, interpretability and actionability (Sec. 12.3).

**Results.** As a survey, the paper reports corpus statistics rather than comparisons with baselines.
- Coverage: 135 papers, 2014–2025, from the venues in Table 1 (abstract; Sec. 4.2).
- Output gap: no existing work fully conforms to the ideal by outputting complete incident propagation paths (Sec. 3.3).
- Root-cause types studied (multi-counted across papers): Resource 56.9% (148), Infrastructure Dependency 12.3% (32), Service Dependency 11.9% (31), Code 8.5% (22), Configuration 6.2% (16), User request 4.2% (11) (Sec. 12.2; Fig. 8).
- Publications grow markedly from 2021 and peak in 2024, with a rising share of industry collaboration; the text gives 40 papers in 2024, Fig. 5 shows 39 (Sec. 12.1; Fig. 5).
- Seven public benchmark systems compiled with service counts, code size, protocols and last update (TrainTicket the largest at 45 services) (Sec. 12.3; Table 9).
