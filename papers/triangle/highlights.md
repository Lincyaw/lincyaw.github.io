# Triangle: Empowering Incident Triage with Multi-Agent — Highlights

**Task.** End-to-end incident triage in large-scale cloud systems: assign each incoming incident, including any reassignments, to the engineering team responsible for mitigating it, accurately and with short Time to Engage (TTE), without manual data curation (abstract, Section II-B).

**Challenge.**
- Incident semantic heterogeneity: incidents are sparse auto-generated alerts or vague complaints; similar issues are described differently and key phrases are scattered, which defeats keyword and classification methods (Section I, Section II-A).
- Decentralized and dynamic domain knowledge: triage needs knowledge from many independently evolving teams, so a misassignment bounces the incident between teams, and each bounce extends the time the system stays degraded. In a study of over 3,000 teams over 12 months, median triage time and human discussion turns grow exponentially with the number of transfer hops (Section I, Fig. 3).
- High human labor: existing triage relies on engineers adding discussion by hand; the state-of-the-art DeepCT depends on these human discussions and cannot be fully automated (Section I, Section VI).

**Solution.** Triangle emulates multi-team human triage with LLM agents: one Team Manager agent per team, which collects its own evidence and votes on ownership (Section III, Fig. 4).
- Analyzer Agent, semantic distillation: aligns the incident's terms with the team functional documents (TF-IDF, glossary matching, LLM rephrasing) and extracts key phrases for failure location, symptoms and needed capabilities.
- Decider Agent, candidate generation: top-K teams from TF-IDF similarity to historical incidents plus top-N teams from LLM matching against compressed team documents, re-ranked into the top M teams for a discussion group (Algorithm 1).
- Team Manager Agents, Team Information Enrichment: each agent generates and runs queries on its team's monitoring databases and summarizes the logs into an "enriched discussion" (Fig. 5).
- Voting-based negotiation: a majority vote assigns the incident; otherwise the enriched incident returns to the Decider, which drops the failed teams and selects new candidates, for at most 5 reassignment loops.

**Insight.** Incident triage is a collaboration among teams that each hold their own changing knowledge, so it can be modeled as agents representing teams that analyze, discuss and reach consensus; a team's agent stays current by updating only its functional document (Section I, Section III-A, Section III-D). The paper attributes inaccurate triage mainly to the lack of information in raw incidents, which agents can fill by fetching external information themselves (Section IV-E).

**Findings.**
- Team Information Enrichment has the largest impact: removing it lowers hop-5 accuracy from 91.7% to 65.8%, and accuracy barely improves with more hops (Table III).
- Without the negotiation mechanism (the Decider assigns directly from its ranking), hop-1 accuracy falls from 54.7% to 42.8% (Table III).
- Triangle's gain over DeepCT widens as the hop count grows; the paper attributes DeepCT's smaller gains to GRU forgetting on longer sequences (Section IV-D).
- Accuracy is weakest where incident descriptions are templated by monitoring tools and lack context: 64% for service D (Section IV-C, Table I).
- Triage works better when historical records are complete and include explicit reasoning, and when team documents are clear (Section V-A).

**Results.**
- Offline, 3 months of production incidents after 12 months of history: hop accuracy 54.7% at hop 1 vs 43.4% for DeepCT (+11.3 pp) and 91.7% at hop 5 vs 67.6% (+24.1 pp); Triangle uses no manually added discussions, DeepCT does (Table II).
- Production, six services, three months after vs before deployment: triage accuracy 64%–97% (up to 97%) and TTE reduction 18%–91% (up to 91%) (Table I, abstract).
- MSR 2013 Bug Dataset, 200 bug cases: 63.2% accuracy vs 54.8% for the strongest baseline LGBM (+8.4 pp) and 52.1% for DeepCT (Table IV).
- Deployed at a leading global technology company; it uses about 600 million logs per day, over 2,000 fault types and more than 20 TB of data daily (Section IV-C).
