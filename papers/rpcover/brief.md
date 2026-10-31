# RPCover — brief

## Citation

- **Title:** RPCover: Recovering gRPC Dependency in Multilingual Projects
- **Authors:** **Aoyang Fang** (first author), Ruiyu Zhou, Xiaoying Tang, Pinjia He (corresponding author)
- **Venue:** 2023 38th IEEE/ACM International Conference on Automated Software Engineering (ASE 2023), Industry Challenge (Competition) track, Kirchberg, Luxembourg, September 2023. Pages 1930–1939.
- **Year:** 2023
- **arXiv:** none found (searched arXiv API by title and the web).
- **DOI:** [10.1109/ASE56229.2023.00108](https://doi.org/10.1109/ASE56229.2023.00108) (from Crossref)
- **PDF:** `/assets/publications/ase23/ASE_grpc.pdf`
- **Code:** https://github.com/CUHK-SE-Group/protoc-gen-scip (tool); benchmark: https://github.com/CUHK-SE-Group/RPCoverBenchmark
- **Program page:** https://conf.researchr.org/details/ase-2023/ase-2023-industry-challenge/13/RPCover-Recovering-gRPC-Dependency-in-Multilingual-Projects
- **Honors:** Distinguished Paper Award, ASE 2023 Industry Challenge Track (confirmed by the author; also listed on the homepage, `_pages/about.md`, "2023.09").

## One sentence

RPCover links gRPC client and server stubs across languages through shared Protobuf definitions, statically recovering cross-service call graphs from per-language SCIP indexes. (22 words)

## Problem

- Dynamic dependency analysis (logs, traces) needs deployed services and well-established infrastructure, and only captures calls within a time frame; one online service can show up to nine topologically different graph classes (abstract, §I).
- Static analysis needs a frontend per language and is incomplete for multilingual services; single-language semantic analysis cannot trace a gRPC call into another microservice (§I).
- No multilingual microservice benchmark with gRPC existed: DeathStarBench and TrainTicket use one or two languages, and only DeathStarBench uses gRPC (abstract, §IV).

## Insight

- gRPC services are described once in an intermediate representation (Protocol Buffers) and compiled into interfaces in many languages, so client stubs and server stubs in different languages share one definition (§I, §II-E, Fig. 4).
- Off-the-shelf SCIP indexers already give, per service, the reference relation (call site → client stub) and implementation relation (server code → server stub); matching both stubs to the same Protobuf service connects the two call graphs (§III-A, §III-B).

## Method

- **① Intra-service analysis:** run the SCIP indexer for each microservice to get function-level dependencies, e.g. `Conn(userCallSite_go, clientStub_go, reference)` and `Conn(userImplSite_c++, serverStub_c++, …)` (§III-A, Fig. 2).
- **② Inter-service analysis:** the gRPC Matcher reads `index type` objects from the SCIP indexes and matches each to a Protobuf service and its requests (Algorithm 1); the default fuzzy matcher compares lower-cased alphanumeric names (Algorithm 2); matched stubs give `Conn(clientStub_go, serverStub_c++, reference)`, and all indexes are merged into one SCIP index (§III-B).
- **③ Index conversion and visualisation:** the unified SCIP index is converted to LSIF, then loaded into a graph database (Memgraph) to view dependencies (§III-C).
- **RPCoverBench:** 15 services, 3 in each of C++, Java, Python, Go and TypeScript, each acting as client, server or both, with 142 gRPC calls (§IV, §V-A).

## Results

- Overall on DeathStarBench (7 gRPC calls) and RPCoverBench (142): 149 true positives, 1 false positive, 0 false negatives — precision 99.33%, recall 100% (Table II; reported as "recovers 99.33%" in the abstract).
- Per benchmark: DeathStarBench precision 100%, recall 100%; RPCoverBench precision 99.30%, recall 100% (Table II).
- Time overhead versus single-language LSIF indexers stays under 200%: from −47.97% (TypeScript C) to +104.72% (C++ B) on the benchmarks, 175.73% on grpc (934,936 lines) and 22.68% on grpc-go (Table III; abstract). gRPC matching is 3–5% of the indexing cost (§V-B).
- Peak memory: −70.93% on grpc and −2.76% on grpc-go relative to the baseline (Table IV).

## Limits as stated by the paper

- The name-based matcher can yield a false positive when a user-defined type has the same name and method names as a gRPC service (the single false positive in RPCoverBench); users can plug in their own matcher (§III-B, §V-A, §VI-A).
- RPCoverBench may not reflect large production systems with thousands of services, and results depend on the external SCIP indexers and their bugs (§VI).

## BibTeX

```bibtex
@inproceedings{fang2023rpcover,
  title     = {RPCover: Recovering gRPC Dependency in Multilingual Projects},
  author    = {Fang, Aoyang and Zhou, Ruiyu and Tang, Xiaoying and He, Pinjia},
  booktitle = {2023 38th IEEE/ACM International Conference on Automated Software Engineering (ASE)},
  pages     = {1930--1939},
  year      = {2023},
  organization = {IEEE},
  doi       = {10.1109/ASE56229.2023.00108}
}
```
