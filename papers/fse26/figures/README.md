# Figures (fse26)

Rendered from the vector PDFs in /home/ddq/AoyangSpace/FSE26/figures/ with pdftoppm. Figure numbers follow the float order of the LaTeX source (main.pdf was being rebuilt and could not be read to confirm them).

- `symptom-only-at-injected-service.png` (2988x529): Fig. 2, case study of Type I CPU-load faults in the Eadro dataset; CPU spikes appear only in the injected services (preserve, seat, verification-code), while ts-security-service and ts-station-service stay flat. Source: `TT.2022-04-18T222801D2022-04-19T001541.pdf`.
- `benchmark-pipeline.png` (2380x938): Fig. 3, the closed-loop construction pipeline: Load Generator, Train Ticket, Controller + ChaosMesh injection, OpenTelemetry collection of normal/abnormal logs, traces, metrics, annotation, Validator, feedback. Source: `dataset_construction_figure.pdf`.
- `impact-driven-filtering.png` (2308x720): Fig. 6, per fault type, how many injections the SLI validator labelled "No Anomaly" (red, filtered) vs "Anomaly" (green, kept); y-axis is broken above 100. Source: `rq4_generation_process.pdf`.
- `failure-modes.png` (2361x1157): Fig. 10, share of failure-mode labels over the 262 hardest cases: Modeling Bottlenecks 47.4%, Scalability Issues 39.8%, Signal-Loss Blind Spots 5.8%, Infrastructure-Level Blind Spots 4.2%, Semantic-Gap Blind Spots 2.9%. Source: `rq5_failure_distribution.pdf`.

Also reusable (not copied): outage news screenshots, `cover.png` and `qr-repo.png` in /home/ddq/AoyangSpace/lincyaw.github.io/fse26-rca/images/.
