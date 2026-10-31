# GRev — brief

## Citation

- **Title:** Testing Graph Database Systems via Equivalent Query Rewriting
- **Authors:** Qiuyang Mang\*, **Aoyang Fang\*** (co-first author), Boxi Yu, Hanfei Chen, Pinjia He (corresponding author). \*Equal contribution.
- **Venue:** 2024 IEEE/ACM 46th International Conference on Software Engineering (ICSE 2024), Research Track, Lisbon, Portugal, April 14–20, 2024. 12 pages.
- **Year:** 2024
- **arXiv:** none found (searched arXiv API by title and author, and the web; the paper is only in the ACM Digital Library and on the ICSE program).
- **DOI:** [10.1145/3597503.3639200](https://doi.org/10.1145/3597503.3639200) (confirmed on the PDF and Crossref)
- **PDF:** `/assets/publications/icse24/grev.pdf`
- **Code:** https://github.com/CUHK-SE-Group/GRev
- **Program page:** https://conf.researchr.org/details/icse-2024/icse-2024-research-track/200/Testing-Graph-Database-Systems-via-Equivalent-Query-Rewriting
- **Honors:** none stated.

## One sentence

GRev rewrites a graph-database query into many equivalent queries via an Abstract Syntax Graph, finding 22 unknown bugs in five GDBMS. (21 words)

## Problem

- Graph database systems (GDBMS) have logic bugs (wrong results, e.g. a missing node), performance bugs and exception issues (abstract).
- GDBMS use different query languages (Cypher, Gremlin, nGQL), so differential testing tools such as GDsmith and Grand can only test functionality shared by systems with the same language (§1).
- Adapting RDBMS testing (GDBMeter reuses Ternary Logic Partitioning) only tests what RDBMS and GDBMS share, such as predicates; none of GDBMeter's reported bugs are graph-related (§1).
- Existing approaches do not target performance bugs: different GDBMS architectures naturally differ in speed, and TLP sub-queries have no clear performance relation to the original (§1).

## Insight

- Equivalent Query Rewriting (EQR): rewrite a query into equivalent ones that trigger distinct query plans; differing results or a large difference in query time signals a bug (abstract, §1).
- Query semantics can be embedded into the paths of a graph, the Abstract Syntax Graph (ASG); any set of non-overlapping paths that together cover all relationships (edges) and constraints (labels, properties) is an equivalent query (§1, §3).
- The ASG is language-independent: supporting a new query language needs only a translator to and from ASG, not hard-coded rewrite rules (§3.1, §1).

## Method

- **ASG parsing:** vertices are categories of nodes with their constraints; edges are the relationships between them. The Cypher ASG parser is about 260 lines of Python; for Gremlin, start, end and `as()` steps become vertices and inner traversal steps become edges (§3.1, §3.2).
- **Random Walk Covering (RWC):** repeatedly pick a random path, remove its edges and a random subset of its vertices' constraints, translate the path to a query fragment (`TransPath2Query`), until the ASG is fully covered (Algorithm 1, §3.3).
- **GRev pipeline:** Graph Generator (random labelled property graph) → Base Query Generator → Equivalent Query Rewriter producing Q1…Qk; queries are run and behaviours compared (Fig. 4, §4.1).
- **Oracles:** logic bug if results differ with no exception; exception bug if results differ with exceptions; performance bug if the slower query is at least 5× slower and at least 1000 ms slower (C1 = 0.8, C2 = 1000 ms) (§4.4, Eq. 1).

## Results

- 22 previously unknown bugs in 5 GDBMS (Neo4j, RedisGraph, MemGraph, TinkerGraph, NebulaGraph) using 3 query languages; 15 confirmed; 14 graph-related (abstract, Table 2).
- Of the 22: 12 logic bugs, 3 performance bugs, 4 missing exceptions, 3 unexpected exceptions (Table 2).
- From 10 base queries with 300 equivalent queries each, RWC produced 1253 distinct query plans for long base queries and 178 for random ones in RedisGraph; GDBMeter-style partitioning triggers only 4 per base query (Fig. 6, §5.3).
- 1,250,000 test cases on RedisGraph in 12 hours: 945 bug-triggering (936 logic, 9 performance), one per 1,322 executions, about one minute per bug-triggering case (§5.3).

## Limits as stated by the paper

- Bugs found automatically still need manual reduction and reproduction; only the three most popular query languages were tested (§6.1).
- There is no established standard for performance inconsistency, so the thresholds may cause false alarms (mitigated by a time-gap threshold and 5 re-runs) (§6.1).

## BibTeX

```bibtex
@inproceedings{mang2024grev,
  title     = {Testing Graph Database Systems via Equivalent Query Rewriting},
  author    = {Mang, Qiuyang and Fang, Aoyang and Yu, Boxi and Chen, Hanfei and He, Pinjia},
  booktitle = {Proceedings of the IEEE/ACM 46th International Conference on Software Engineering},
  series    = {ICSE '24},
  pages     = {1--12},
  year      = {2024},
  publisher = {ACM},
  address   = {Lisbon, Portugal},
  isbn      = {979-8-4007-0217-4},
  doi       = {10.1145/3597503.3639200}
}
```

Note: §5.2 of the PDF says "15 of them have been fixed or confirmed ... the status of the remaining 11 bugs is still pending", which does not add up to 22; the film uses only the abstract and Table 2 figures (22 / 15 / 14).
