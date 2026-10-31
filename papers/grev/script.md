# GRev — one-minute film plan

Built with the presmium-animate story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `references/lengths.md`) and the launch event principle. Fact source: `highlights.md`.

## Brief

- **Kind:** explainer / paper video, 60 s, narrated English, no music (a quiet bed at most). 16:9.
- **Audience:** engineers and researchers who know what a database query is, not graph-database testing.
- **Before → after:** "databases are tested by comparing outputs with another system" → "you can catch a graph database's bugs by asking it the same question in different words, and GRev generates those words automatically."
- **Parts to name first:** the query, then "a small graph of what to match". The paper's term "Abstract Syntax Graph" is never spoken; the picture carries it.

## Thesis

**After watching, the viewer understands that asking a graph database one question in many equivalent ways exposes its bugs, because they saw one query's graph re-covered by different coloured paths and RedisGraph answer the same question with 7 and then 8.**

**ABT:** Graph databases answer pattern queries by walking a graph, and testers check them by comparing different databases or by splitting a query's filter; **but** databases speak different query languages and filter-splitting never changes how the graph is walked, so bugs in the walk slip past; **therefore** GRev asks one database the same question along many different paths, and any disagreement is a bug.

## Pattern

**Mechanism walk, opened puzzle-first** (story.md table: "Mechanism walk — a method paper"; the 60 s guidance: "60 s is ABT, puzzle first or predict first"). GRev is a method paper whose mechanism can be shown on one concrete query in a few moves, and the paper hands us a real puzzle to open on: two equivalent queries that RedisGraph answers differently (Listing 1). Result-first would open on "22 bugs", a number with no picture; the puzzle makes the viewer want the mechanism.

## Three storylines

1. **Two answers to one question (recommended).** Shape: puzzle → why testers miss it → the idea on one query → many routes → the puzzle explained, scaled to 22 bugs. Form: a chain; each chapter's last object is the next one's first (the 7/8 pair → the gap between testers → the query that becomes a graph → the coloured coverings that flow into the database → a disagreeing pair that is the opening pair again). First 2 s: two query cards side by side with a "≡" between them. Rules out: an opening number; a feature list.
2. **One query, many routes.** Shape: one element transforming. The Alice-and-Bob query (Fig. 2) is the only protagonist: it melts into its graph, random walks recolour it into new queries, they pour into one database, one answer comes out different. Form: one continuous take, the graph never leaves the frame. First 2 s: the query text typing on. Rules out: the real RedisGraph bug (it is a different query), so the stake arrives late.
3. **The city and its routes (bold).** Shape: a camera move through scale. The database is a city map, a query is a request for every place reached by a given route; zoom out from one route to dozens that all arrive at the same square, then one that arrives elsewhere. Form: an endless zoom. Rules out: the paper's real figures for most of the film; the metaphor would need its breaking point stated (paths in a query are patterns, not a single trip).

**Chosen: 1.** The real 7-versus-8 bug is the most persuasive evidence the paper has and it is a puzzle by itself; coming back to it at the end makes the closing claim out of objects already on screen. Turn at about 0:22 (37%): the query turns into a graph and the graph gets recoloured; the turn is a change in the picture.

- **Spatial convention:** left = the original wording, right = a rewritten wording; the database sits at the bottom centre and queries fall into it.
- **One meaning per colour:** the paper's path colours (red, blue, purple, yellow) mean "one path of one covering"; a single warning red means "answers disagree"; everything else ink on paper.
- **Misconception to confront:** "if the database passes another database's results, it is correct" → testers that compare databases only reach shared features.
- **Rate:** 142 words in 60 s is about 2.6 words a second including the final hold; measure the chosen voice and lengthen chapter 5's hold if it speaks slower.

## Chapters

| # | Chapter | Start |
|---|---|---|
| 1 | Two answers to one question | 0:00 |
| 2 | Why testers miss it | 0:10 |
| 3 | The question is a graph | 0:22 |
| 4 | Same question, many routes | 0:35 |
| 5 | Where routes disagree | 0:46 |

## Storyboard

### 1 · Two answers to one question — 0:00–0:10

- **Rest frame:** `figures/listing1-redisgraph-equivalent-queries-7-vs-8.png` split into two cards: query (1) left, query (2) right, "≡" between them, a small RedisGraph label under both; result badges **7** (left) and **8** (right), both in warning red.
- **What moves:** the two cards slide in from their sides and meet at the "≡"; the left badge counts to 7, then the right to 8; the red lands on both at once.
- **Viewer now understands:** the same question, phrased two ways, gets two answers; one is wrong.
- **Narration:** Ask RedisGraph one question two ways, on the same data. One phrasing counts seven, the other eight. One of them is wrong. *(7 and 8: Listing 1.)*
- **On-screen text:** Same question: 7 ≠ 8
- **Carries into 2:** the "≡" stays; the two cards shrink to the top-left corner, leaving the "≡" as the pivot of the next frame.

### 2 · Why testers miss it — 0:10–0:22

- **Rest frame:** two greyed testing set-ups under the corner cards. Left: two different database cylinders joined by a "compare" arrow, over three language tags Cypher, Gremlin, nGQL of which only a thin overlap is lit. Right: one query whose `WHERE` filter splits into three pieces (true / false / null) while its `MATCH` path stays one untouched grey line.
- **What moves:** the left set-up draws first; the overlap of the language tags lights and the rest dims. Then the right: the filter splits, the path does not move.
- **Viewer now understands:** comparing databases reaches only what they share; splitting the filter never changes how the graph is walked; bugs in the walk escape both.
- **Narration:** Testers compare different databases, which only works where they share a query language, or split a query's filter, which never changes how the graph is walked. Bugs in the walk slip past.
- **On-screen text:** none (the language tags are the only labels)
- **Carries into 3:** the untouched grey `MATCH` path on the right lifts out and becomes the query at the top of the next frame.

### 3 · The question is a graph — 0:22–0:35 (the turn)

- **Rest frame:** `figures/random-walk-covering-four-equivalent-queries.png`: the black graph v1–v4 in the centre, four corner panels each covered by its own red, blue and purple paths, each with its three-line query.
- **What moves:** first the top half of `figures/eqr-overview-query-asg-rewrite.png`: the Alice-and-Bob query's pieces fly down into the dashed graph (v1 person "Alice", v2 person, v3 person "Bob", v4 software). The camera cuts on that graph's shape to the centre graph of Fig. 3. A random walk draws a red path edge by edge, then blue, then purple, until every edge is used once; its query writes itself in matching colours. The camera pulls back as the other three coverings appear around the ring.
- **Viewer now understands:** a query is a small graph; any way of covering it with paths, each edge once, is another wording of the same question.
- **Narration:** GRev's idea: a query is a small graph of what to match. Cover that graph with random paths, each edge used once, and each covering asks the same question in new words.
- **On-screen text:** Same graph, new words
- **Carries into 4:** the four coloured queries slide off their panels and fall, one after another, into a database cylinder at the bottom centre.

### 4 · Same question, many routes — 0:35–0:46

- **Rest frame:** `figures/distinct-query-plans-per-base-query.png` with the yellow "Long Base Queries" bars at full height and the last bar labelled 1,253, source line "Fig. 6, RedisGraph"; the pink bars faded.
- **What moves:** each query that lands in the cylinder sends out a differently shaped plan tree; the trees stack up and morph into the yellow bars, which grow left to right from 30 to 300 rewrites per query; the counter on the last bar rolls to 1,253 and holds 2 s.
- **Viewer now understands:** the rewrites are not cosmetic; they push the database down genuinely different internal routes, so one question tests many code paths.
- **Narration:** Each new wording can send the database down a different internal route, so one question exercises many query plans, and every route must reach the same answer.
- **On-screen text:** 1,253 query plans (Fig. 6)
- **Carries into 5:** the last yellow bar splits into two thin bars that turn into the opening two cards, now coloured red: the 7 and 8 come back.

### 5 · Where routes disagree — 0:46–1:00

- **Rest frame (held 5 s):** a row of five name tiles, Neo4j, RedisGraph, MemGraph, TinkerGraph, NebulaGraph, each with its bug marks (3, 6, 4, 3, 6, Table 2); above them one large **22**; the 7 ≠ 8 pair small on the RedisGraph tile; source line "Table 2". End card under it: title, ICSE 2024, Qiuyang Mang and Aoyang Fang (co-first authors), Boxi Yu, Hanfei Chen, Pinjia He; github.com/CUHK-SE-Group/GRev.
- **What moves:** the 7 ≠ 8 pair shrinks into one bug mark on the RedisGraph tile; the other tiles fill with their marks one tile at a time; the marks gather upward into the counter, which rolls to 22. Then nothing moves.
- **Viewer now understands:** the opening puzzle was one instance of a method that found 22 previously unknown bugs; the thing to remember is "ask the same question another way".
- **Narration:** When two routes disagree, the database has a bug, like seven against eight. Asking the same question many ways, GRev found 22 previously unknown bugs in five graph databases. *(22: abstract, Table 2.)*
- **On-screen text:** 22 unknown bugs · 5 databases

## Narration

Read as one piece:

> Ask RedisGraph one question two ways, on the same data. One phrasing counts seven, the other eight. One of them is wrong. Testers compare different databases, which only works where they share a query language, or split a query's filter, which never changes how the graph is walked. Bugs in the walk slip past. GRev's idea: a query is a small graph of what to match. Cover that graph with random paths, each edge used once, and each covering asks the same question in new words. Each new wording can send the database down a different internal route, so one question exercises many query plans, and every route must reach the same answer. When two routes disagree, the database has a bug, like seven against eight. Asking the same question many ways, GRev found 22 previously unknown bugs in five graph databases.

**Word count: 142.** Spoken numbers: 7 and 8 (Listing 1), 22 (abstract, Table 2). Shown, not spoken: 1,253 query plans (Fig. 6), per-database bug counts (Table 2).

## Checks

- Durations add to 60 s; the final frame holds 5 s.
- Thumbnail strip (no sound): 7≠8 cards → two greyed testers → coloured coverings → bars rising → 22 over five databases. It reads as "one question, two answers → how to find more → found 22".
- Every claim maps to `highlights.md`: the 7/8 bug (Results via Listing 1, the RedisGraph logic bug), testers' limits (Challenge), the graph and covering (Solution, Insight), query-plan diversity (Results), 22 bugs in five GDBMS (Results).
