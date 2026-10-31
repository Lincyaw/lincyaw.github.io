# RPCover figures

From `assets/publications/ase23/ASE_grpc.pdf` (the ASE 2023 paper; no arXiv version exists). Figures 3 and 7 are the embedded raster images extracted with `pdfimages -png`; Figures 2 and 4 are page crops rendered with `pdftoppm` (600 and 500 dpi). Captions are cut off.

- `rpcover-workflow.png` — Fig. 2 (page 3): workflow of RPCover. Target source code → SCIP indexers (① intra-service analysis) → gRPC Matcher with gRPC proto definitions (② inter-service analysis) → LSIF converter → LSIF index (③ index conversion).
- `grpc-stub-reference-implementation.png` — Fig. 3 (page 4): a Protobuf `service Greeter` definition, the generated Python code (server stub `GreeterServicer`, client stub `GreeterStub`), the implementation code (implementation relation) and the client code (reference relation).
- `protobuf-bindings-and-stubs.png` — Fig. 4 (page 4): one ProtoBuf definition compiled into C++, Java, PHP and Go bindings; a Go client stub calls a C++ server stub.
- `deathstarbench-hotel-reservation-graph.png` — Fig. 7 (page 7): recovered service dependency graph of DeathStarBench's hotel reservation cluster: nodes frontend, search, rate, geo, recommendation, user, profile, reservation joined by `depend` edges; search links to rate and geo, the others link to frontend (shown in a graph viewer).
