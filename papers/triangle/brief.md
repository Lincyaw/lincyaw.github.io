# Triangle: brief

## Citation

- Title: Triangle: Empowering Incident Triage with Multi-Agent
- Authors: Zhaoyang Yu*, **Aoyang Fang*** (co-first author), Minghua Ma†, Jaskaran Singh Walia, Chaoyun Zhang, Shu Chi, Ze Li, Murali Chintalapati, Xuchao Zhang, Rujia Wang, Chetan Bansal, Saravan Rajmohan, Qingwei Lin, Shenglin Zhang, Dan Pei, Pinjia He† (* equal contribution, † corresponding). Affiliations: Tsinghua University, Microsoft, Nankai University, CUHK-Shenzhen. Note: Shu Chi appears in the PDF and in Crossref but is missing from the site's publication list and from `assets/pdf/cv/publications.bib`.
- Venue: 40th IEEE/ACM International Conference on Automated Software Engineering (ASE 2025), pp. 674–686
- Links: DOI https://doi.org/10.1109/ASE63991.2025.00062 · PDF /assets/publications/ase25/ASE_triangle.pdf · Code https://aka.ms/triangle-open-source (footnote 1) · arXiv: none found
- Honors: directly accepted at ASE 2025 (site news); deployed in production at a leading global technology company (Section IV-C).

## One sentence

Triangle triages cloud incidents with Analyzer, Decider and per-team Team Manager agents that enrich and vote, reaching 91.7% hop-5 accuracy.

## Problem

- Misassigned incidents bounce between teams ("triage cycles"), extending Time to Engage (TTE) while the system stays degraded (Section I).
- In a study of over 3,000 teams over 12 months, incidents with more transfer hops have exponentially increasing median triage time and human discussion turns (Section II-B, Fig. 3).
- Three challenges: incident semantic heterogeneity, decentralized and dynamic domain knowledge across teams, and high human labor (Section I).
- Incident data are sparse, auto-generated alerts or vague complaints, unlike detailed bug reports (Section I).

## Insight

- Triage is collaborative problem-solving among teams, so simulate it with multiple agents: each team gets a Team Manager agent holding its own knowledge (Section I, Section III-A).
- When a team's responsibilities change, only its functional documentation needs updating (Section III-D).
- The main reason for inaccurate triage is the insufficient information in raw incidents; agents can fetch it themselves instead of waiting for human discussion (Section IV-E).

## Method

- Phase 1, Analyzer Agent, semantic distillation: semantic alignment of the incident's terms with team functional documents (TF-IDF, glossary matching, LLM rephrasing), then extraction of key phrases for location, symptoms and needed capabilities (Section III-B).
- Phase 2, Decider Agent, candidate generation: top-K teams from TF-IDF similarity to historical incidents plus top-N teams from LLM matching against compressed team documents, re-ranked to select top M for a discussion group (Section III-C, Algorithm 1).
- Phase 3, Team Manager Agents: Team Information Enrichment queries each team's monitoring databases and summarizes logs into "enriched discussion"; agents then vote, and a majority assigns the incident (Section III-D, Fig. 5).
- If there is no majority, the incident with all enriched discussion returns to the Decider, which drops the failed teams and picks new candidates; at most 5 reassignment loops (Section III-D).

## Results

- Production deployment: triage accuracy up to 97% and TTE reduced by up to 91% (abstract). Per service (Table I): accuracy 92/82/96/64/96/97% and TTE reduction 18/91/48/72/61/67% for services A–F, three months before vs after deployment.
- Offline, 15 months of incidents (12 history, 3 evaluation): hop accuracy 54.7 / 70.4 / 80.5 / 86.0 / 91.7% at hops 1–5, versus DeepCT 43.4 / 54.6 / 60.4 / 64.4 / 67.6% (Table II, Section IV-A); 26%–42% relative improvement over DeepCT (Section I). Triangle uses no manually enriched discussions; DeepCT is fed them.
- Ablation: removing Team Information Enrichment drops hop-5 accuracy to 65.8% (−25.9); removing multi-agent negotiation drops hop 1 to 42.8% (Table III).
- Scale: about 600 million logs per day, over 2,000 fault types, more than 20 TB of data daily (Section IV-C). Generalization: 63.2% on the MSR 2013 Bug Dataset vs DeepCT 52.1% (Table IV).

## Limits as stated by the paper

- Accuracy depends on complete historical records and clear team documentation; Service D reached only 64% because its templated monitoring-tool incident descriptions lack context (Section IV-C, Section V-A).
- External validity: data come from one company's cloud systems and may not represent other companies (Section V-B).

## BibTeX

```bibtex
@inproceedings{yu2025triangle,
  title     = {Triangle: Empowering Incident Triage with Multi-Agent},
  author    = {Yu, Zhaoyang and Fang, Aoyang and Ma, Minghua and Walia, Jaskaran Singh and Zhang, Chaoyun and Chi, Shu and Li, Ze and Chintalapati, Murali and Zhang, Xuchao and Wang, Rujia and Bansal, Chetan and Rajmohan, Saravan and Lin, Qingwei and Zhang, Shenglin and Pei, Dan and He, Pinjia},
  booktitle = {Proceedings of the 40th IEEE/ACM International Conference on Automated Software Engineering (ASE)},
  pages     = {674--686},
  year      = {2025},
  doi       = {10.1109/ASE63991.2025.00062}
}
```
