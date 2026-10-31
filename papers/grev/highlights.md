# Testing Graph Database Systems via Equivalent Query Rewriting — Highlights

**Task.** Automatically test graph database management systems (GDBMS) for logic bugs (incorrect results), performance bugs (e.g. redundant graph scanning) and exception issues (unexpected or missing exceptions), across GDBMS that use different query languages (Cypher, Gremlin, nGQL).

**Challenge.**
- GDBMS have no common query language, so differential testing tools (GDsmith, Grand) only test functionality shared by systems with the same language, and porting them to a new language takes extensive engineering; existing research covers at most Cypher and Gremlin.
- Adapting RDBMS testing approaches only tests what RDBMS and GDBMS share (expressions, predicates). GDBMeter, the only metamorphic tester for GDBMS, reuses Ternary Logic Partitioning; none of its reported bugs are graph-related, and TLP cannot change the query plan of a traversal (`MATCH`).
- Performance bugs are not targeted: different GDBMS architectures naturally differ in speed, and TLP's sub-queries have no clear performance relation to the original query.
- Classic query rewriting relies on hand-written rules by domain experts, and rules adopted by optimisers compile to the same query plan.

**Solution.** GRev adapts Equivalent Query Rewriting (EQR) to GDBMS testing: it rewrites a base query into many equivalent queries that trigger distinct query plans, and reports a bug when they disagree. An ASG parser turns the query into an Abstract Syntax Graph whose vertices are categories of nodes with their constraints (labels, properties) and whose edges are the relationships between them (Cypher parser: about 260 lines of Python). Random Walk Covering (RWC, Algorithm 1) repeatedly picks a random path, removes its edges and a random subset of its vertices' constraints, and translates the path back into a query fragment, until every edge and constraint is covered exactly once; each covering is one equivalent query. GRev wraps this in a Graph Generator (random labelled property graph), a Base Query Generator and the Equivalent Query Rewriter. Oracles: differing results without exceptions → logic bug; differing results with exceptions → exception bug; at least 5× slower and at least 1000 ms slower → performance bug.

**Insight.** The semantics of a graph query can be embedded in the paths of a graph: any set of non-overlapping paths that together cover all of the ASG's edges and constraints is an equivalent query. Because the ASG is language-independent, a new query language needs only a translator, not new rewrite rules, and because a GDBMS cannot predict the graph structure before execution, different path sequences are hard to optimise into one plan.

**Findings.**
- Most of the bugs GRev found (14 of 22) are graph-related, arising in graph data retrieval such as `MATCH`, a class that TLP-based GDBMeter did not reach; its logic bugs all came from queries with only a simple `MATCH (n)` or a returned expression.
- Query-plan diversity keeps growing with the number of rewrites and is far larger for long base queries (125.3 distinct plans per long base query versus 17.8 per random one at 300 rewrites).
- 9 of 13 bugs from MemGraph, RedisGraph and TinkerGraph (69%) also reproduce in the older versions tested by prior tools, so those tools had missed them; Neo4j bugs did not, because they involve new features such as label expressions.
- Coverage depends on the system: with the same base-query generator GRev reached higher instruction and branch coverage than GDsmith on Neo4j, but on RedisGraph it matched GDsmith and GDBMeter's more diverse base queries reached higher coverage.

**Results.**
- Example (Listing 1, RedisGraph issue #3093): two equivalent Cypher queries return `COUNT(*)` 7 and 8 on the same graph, a graph-related logic bug found by GRev.
- 22 previously unknown bugs in 5 GDBMS (Neo4j, RedisGraph, MemGraph, TinkerGraph, NebulaGraph) using 3 query languages; 15 confirmed by developers; 14 graph-related. By type: 12 logic, 3 performance, 4 missing exceptions, 3 unexpected exceptions (Table 2).
- Distinct query plans in RedisGraph 6.2.6-v7 from 10 base queries × 300 equivalent queries: 1,253 (long base queries) and 178 (random base queries), versus at most 4 per base query for GDBMeter's partitioning (1 original + 3 sub-queries) and 1 per GDBMS for differential testing (Fig. 6, §5.3).
- 2,394/3,000 (random) and 3,000/3,000 (long) generated equivalent queries were unique (Fig. 5).
- 1,250,000 test cases on RedisGraph in 12 hours: 945 bug-triggering (936 logic, 9 performance), one per 1,322 executions, about one minute per bug-triggering case (§5.3).
- No performance-bug report was rejected as a false alarm (§6.1).
