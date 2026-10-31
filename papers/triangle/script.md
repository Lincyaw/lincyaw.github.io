# Triangle: one-minute film plan

Built with the Presmium `presmium-animate` story process (`references/story.md`, the Papers storyboards, the 60 s guidance in `references/lengths.md`). Facts come from `highlights.md`; there is no arXiv version, so numbers come from the ASE 2025 PDF.

## A. Brief

- **Kind:** paper video (explainer), 60 s, video first; the rest frames also serve as the paper page's stills.
- **Audience:** software-engineering and cloud-operations people who have been on call or have filed tickets.
- **Before:** routing an incident means reading the ticket and picking a team, a classification problem.
- **After:** the ticket is too thin to name its owner; the evidence sits with the teams, and agents can go and get it.
- **Misconception to confront:** "the answer is in the ticket text".
- **Parts to name first:** a ticket, a team, a hop. Agents are named when they appear.
- **Assumptions:** 16:9, narration with no music, no paid assets.

## B. Thesis

**After watching, the viewer understands** that an incident ticket alone can't name its owner, so Triangle sends one agent per team to fetch the evidence, **because they saw** a thin ticket bounce from team to team and then, in Triangle, come back thick with each team's findings and a vote.

**And–But–Therefore:** A cloud incident must reach the team that can fix it, AND every misrouted hop adds waiting while the service stays degraded; BUT the ticket alone can't say who owns the problem, because the clues sit in each team's own logs and documents; THEREFORE Triangle gives each team an agent that queries its logs, writes its findings onto the ticket and votes, until a majority picks the team.

## C. Pattern, storylines, choice

**Pattern: mechanism walk** (story.md table: a method paper; one example through the pipeline, the baseline named in the same view). Result-first would open on "Time to Engage −91%", which means little before the viewer has seen a hop cost time. Triangle's value is a loop (enrich, vote, retry), and a loop is only visible by following one ticket round it. Figure 1's Mac sign-in incident is that ticket.

Three storylines:

1. **One ticket's journey** (recommended). *Form:* a chain, where each shot's last object (the ticket card) is the next shot's first. *First 2 s:* a one-line ticket drops onto Team A's lane. Beats: the ticket bounces A → B → C, leaving hop pips → the hop curve (Figure 3) → it can't say who owns it → rewind; agents go out to the logs, notes stack on the ticket, ballots → hop accuracy beside DeepCT, then Time to Engage. *Rules out:* a feature tour of the three agents.
2. **The hop tax.** *Form:* one picture over time. Figure 3's curve is the stage; incidents are dots sliding right with each hop, and Triangle pulls them left. Strong on the stake, but the mechanism shrinks to a label.
3. **The ticket that grows** (bold). *Form:* one element transforming through everything. The ticket never leaves the centre; key phrases highlight inside it, candidate team tabs sprout on its edge, log snippets clip on, ballots stamp it, and it ends as a thick dossier beside its thin original. Vivid, but it hides the hops, which are the cost the film is about.

**Chosen: 1**, with storyline 3's idea used inside chapter 3: the ticket thickens as agents write onto it, so the carried object itself shows the enrichment.

- **Turn:** at 0:24 (40%). The ticket stops moving between teams; agents move to the evidence instead.
- **Spatial convention:** team lanes left to right in hop order; the ticket's thickness = how much evidence it carries.
- **Colour:** red means waiting time; accent means Triangle; grey means DeepCT and manual triage.
- **Central picture:** the ticket card on a row of team lanes, a hop pip left under the card at each transfer.
- **Money frame (end of chapter 3):** the manual ticket, thin, with three red hop pips, beside the Triangle ticket, thick with three team notes and a ballot "2 of 3". Labelled 示意: Triangle's outcome on this incident is not reported.

## D. Chapters

| # | Chapter | Start | Duration |
|---|---------|-------|----------|
| 1 | A ticket nobody owns | 0:00 | 14 s |
| 2 | The answer isn't in the ticket | 0:14 | 10 s |
| 3 | Agents go and look | 0:24 | 19 s |
| 4 | Fewer hops, sooner | 0:43 | 17 s (ends 1:00, title card held 3 s) |

## E. Storyboard

| # | Time | Rest frame | What moves (cause → effect) | Viewer now understands | Carries into the next |
|---|------|-----------|------------------------------|------------------------|-----------------------|
| 1 | 0:00–0:14 | Three team lanes A, B, C; the one-line ticket "Can't sign in on Mac" (Figure 1) at C; three red hop pips beneath; inset, Figure 3's median-triage-time line drawn from hop 1 to 8+ with a source line "3,000+ teams · 12 months · Fig. 3" | The ticket slides A → B → C, each landing leaving a red pip and a red time sliver; then the Figure 3 line draws from left to right | Each hop costs time, and the cost climbs with every hop | The ticket card stays; the curve slides off |
| 2 | 0:14–0:24 | The ticket enlarged: one line of text, mostly empty card; around it, three closed boxes (team logs and documents A, B, C) | The card grows to fill the frame and its emptiness shows; the three boxes fade up around it, closed | The clues are not in the ticket but in the teams' own logs | The boxes stay in place; an agent icon appears beside each |
| 3 | 0:24–0:43 | Figure 4's layout redrawn around the same card: Analyzer (card shows highlighted key phrases) → Decider (three team tabs on the card's edge) → three Team Manager agents, each with a log snippet, three notes stacked on the card, ballots 2 of 3 stamped; a loop arrow back to the Decider with round counter "1 → 2" | The analyzer marks phrases inside the card; the decider pulls in tabs from "past incidents" and "team documents"; each agent opens its box, pulls a snippet and clips a note onto the card, which thickens; ballots fall; on a split vote the loop arrow runs and a new tab set appears | Agents gather the evidence engineers would, and vote; disagreement sends a richer ticket round again | The thick card slides left and becomes the accent column of the comparison |
| 4 | 0:43–1:00 | Two columns, hop accuracy at hops 1–5 (Table II) as stepped bars: DeepCT grey, chip "engineer-written discussions", 43.4 → 67.6; Triangle accent, chip "agent-written", 54.7 → 91.7; then a "Time to Engage" bar shrinking by 91% (Table I, abstract); title card | The grey steps grow first, then the accent ones overtake at each hop; the chart folds and the red waiting sliver from chapter 1 shrinks by 91%; the cast gathers into the title card | Triangle gets the team right more often without anyone writing the discussion, and incidents get engaged sooner | End card (ASE 2025, DOI 10.1109/ASE63991.2025.00062), held 3 s |

## F. Script

Narration: 153 words (counted with `wc -w`). Numbers spoken: 91.7% (hop-5 accuracy, Table II) and 91% (Time to Engage reduction, Table I and abstract). DeepCT's 67.6% and "3,000+ teams" are shown on screen, not spoken. Each line is backed by `highlights.md`: Challenge for chapters 1–2, Insight and Solution for chapter 3, Results for chapter 4. The Mac sign-in ticket is Figure 1's example.

**1 · A ticket nobody owns (0:00)**
A customer can't sign in on a Mac. The ticket goes to Team A, then B, then C, and every hop is more waiting while the service stays degraded. Across thousands of teams, triage time climbs with every hop.

**2 · The answer isn't in the ticket (0:14)**
Why so many hops? The ticket alone can't say who owns the problem; the clues sit in each team's own logs, and someone has to go and look.

**3 · Agents go and look (0:24)**
Triangle sends agents. An analyzer turns the ticket into key phrases; a decider shortlists teams from past incidents and team documents. Each shortlisted team's agent queries its own logs, writes what it found onto the ticket, and votes. No majority? The richer ticket gets a new shortlist.

**4 · Fewer hops, sooner (0:43)**
Within five hops, Triangle routes 91.7 percent correctly, well ahead of DeepCT, which needs engineers to write those discussions. In production, time to engage fell by up to 91 percent. What the ticket lacks, the teams' agents can fetch.

**On-screen text** (one line at a time, ≤ 8 words): 1 "3,000+ teams · 12 months · Fig. 3" · 2 none · 3 "示意" (a corner tag) · 4 "Hop accuracy · Table II", then "Time to Engage −91%".

## G. Checks

- **Durations:** 14 + 10 + 19 + 17 = 60 s. At about 2.7 words a second, 153 words take about 57 s, leaving the 3 s end hold.
- **Thumbnail strip, no sound:** thin ticket with red pips → empty card among closed boxes → thick card with notes and ballots → two step charts and a shrinking red bar.
- **No invented facts:** Triangle's routing of the Figure 1 incident is not reported, so chapter 3 is labelled illustrative. The numbers are the paper's (Table II, Table I, abstract).
