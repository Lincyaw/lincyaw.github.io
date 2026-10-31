# RPCover: Recovering gRPC Dependency in Multilingual Projects — Highlights

**Task.** Statically recover gRPC call dependencies between microservices written in different programming languages: given the services' source code and their gRPC Protocol Buffer definitions, produce a function-level and service-level dependency graph without deploying the system.

**Challenge.**
- Dynamic analysis (logs, traces, monitoring) needs deployed services and established tracing infrastructure, and only captures calls within a time frame; one online service can show up to nine topologically different graph classes.
- Static analysis needs a separate frontend per language. gRPC calls are described in an IR and compiled into per-language interfaces, so single-language semantic analysis cannot follow a call into another microservice; language-agnostic ASTs (LAAST) are costly to extend because abstractions differ between languages.
- No multilingual gRPC microservice benchmark exists: DeathStarBench and TrainTicket use one or two languages, and only DeathStarBench uses gRPC.

**Solution.** RPCover connects services through the Protobuf definition they share: a client stub and a server stub generated from the same gRPC service definition, in any languages, are linked as one call edge. ① Intra-service analysis runs an existing SCIP indexer on each microservice to get function-level dependencies, including the reference relation from call sites to client stubs and the implementation relation from server code to server stubs. ② Inter-service analysis: the gRPC Matcher builds language-neutral `index type` objects from the SCIP indexes, matches them to Protobuf services and requests (Algorithm 1; the default fuzzy matcher compares lower-cased alphanumeric names, Algorithm 2; users can plug in their own matchers), adds the cross-service connections such as `Conn(clientStub_go, serverStub_c++, reference)`, and merges all indexes into one SCIP index. ③ Index conversion turns it into LSIF for editors and graph viewers (Memgraph). The paper also builds RPCoverBench: 15 services, three each in C++, Java, Python, Go and TypeScript, acting as client, server or both, with 142 gRPC calls. Tool and benchmark are open source.

**Findings.**
- The only false positive comes from a struct that shares the service name and method names of a Protobuf service definition, which the name-based matcher mistakes for an implementation; the paper judges this case rare.
- Run time is dominated by the underlying SCIP indexer; gRPC matching accounts for only 3–5% of the indexing work.
- RPCover adds time only in C++, because the C++ SCIP indexer analyses every translation unit while the C++ LSIF indexer omits some external headers; in Go, Python and TypeScript it is faster than the LSIF baseline.

**Results.**
- Coverage on DeathStarBench (7 gRPC calls) and RPCoverBench (142): 149 true positives, 1 false positive, 0 false negatives, overall precision 99.33% and recall 100% (DeathStarBench 100% / 100%; RPCoverBench 99.30% / 100%) (Table II). No other dependency-recovery tool is run as a baseline for coverage.
- Time versus single-language LSIF indexers (20 runs): from −47.97% (TypeScript C) to +104.72% (C++ B) on the benchmarks, −23.62% on DeathStarBench hotelReservation, +175.73% on grpc (934,936 lines) and +22.68% on grpc-go (85,890 lines); under 200% overall (Table III, abstract). Java has no baseline (no usable Java LSIF indexer).
- Peak memory versus the baseline: −70.93% on grpc, −2.76% on grpc-go, about −85% on the C++ benchmark services, +0.37% to +52.13% elsewhere (Table IV).
