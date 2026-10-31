# GRev figures

All crops rendered at 600 dpi with `pdftoppm` from `assets/publications/icse24/grev.pdf` (the ICSE 2024 camera-ready; no arXiv version exists). Captions are cut off; the paper's caption text is summarised here.

- `listing1-redisgraph-equivalent-queries-7-vs-8.png` — Listing 1 (page 2): two equivalent Cypher queries on RedisGraph that return `COUNT(*)` 7 and 8; a graph-related logic bug found by GRev (RedisGraph issue #3093).
- `eqr-overview-query-asg-rewrite.png` — Figure 2 (page 3): EQR overview. Original query ("software developers known by Alice and Bob") → ASG parser → Abstract Syntax Graph (v1–v4, edges knows/knows/develops) → Random Walk Covering → equivalent query, with path colours matching the ASG.
- `random-walk-covering-four-equivalent-queries.png` — Figure 3 (page 4): one ASG in the centre; four RWC runs each cover it with three coloured, non-overlapping paths, giving four different equivalent Cypher queries.
- `distinct-query-plans-per-base-query.png` — Figure 6 (page 8): number of distinct query plans in RedisGraph 6.2.6-v7 versus equivalent queries generated per base query (30 to 300), for 10 random base queries (63 → 178) and 10 long base queries (227 → 1253); average of 50 runs.
