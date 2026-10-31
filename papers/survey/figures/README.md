# Figures (survey)

Rendered with pdftoppm (crop box) from the arXiv v1 source in ../source/arxiv-src/x/images/. Figure numbers are those of the arXiv v1 PDF (../source/arxiv-pdf/2510.19593v1.pdf).

- `rca-overview-observation-to-graph.png` (2835x920): Fig. 3, overview of RCA as Observation (monitoring units: code, configuration, runtime resource, telemetry) → Inference (RCA methods, eval metrics) → Result (incident propagation graph with root cause, trigger and symptom nodes). Source: `images/workflow.pdf`.
- `oom-propagation-chain.png` (2525x1579): Fig. 4, an OOM incident: root cause = code change with a memory leak (commit ae87ce7), trigger = request surge, symptom = Service#2 out of memory, with request-volume and memory-usage plots. Source: `images/incident_example.pdf`.
- `papers-per-year.png` (2370x1471): Fig. 5, collected papers per year 2013–2025, split by company collaboration; bars sum to 135, peak 39 in 2024. Source: `images/papers_per_year_with_collaboration.pdf`.
- `root-cause-type-distribution.png` (2460x930): Fig. 8, root-cause (fault injection) types studied across the 135 papers, multi-counted: Resource 148 (56.9%), Infrastructure Dependency 32 (12.3%), Service Dependency 31 (11.9%), Code 22 (8.5%), Configuration 16 (6.2%), User request 11 (4.2%). Source: `images/fault_injection_types.pdf`.
