---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

I graduated with a bachelor's degree from Harbin Institute of Technology (Shenzhen) and am currently a PhD student in School of Data Science at The Chinese University of Hong Kong, Shenzhen (CUHK(SZ)) and fortunate to be advised by [Prof. Pinjia He](https://pinjiahe.github.io/).

My research centers on software reliability, security and observability through innovative testing and monitoring methodologies.

I warmly welcome collaborations and discussions in this domain (DevOps, MLOps, LLMOps, AI4SE, SE4AI).

<!-- 
<style>
.roadmap {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  overflow-x: auto;
  align-items: center;
}

.roadmap-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.roadmap-root-node {
  background: linear-gradient(135deg, #224b8d 0%, #3a6fb5 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75em;
  text-align: center;
  box-shadow: 0 2px 6px rgba(34, 75, 141, 0.25);
}

.roadmap-branches {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.roadmap-branch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.roadmap-connector {
  display: flex;
  align-items: center;
}

.roadmap-line {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, #224b8d 0%, var(--branch-color) 100%);
  border-radius: 1px;
}

.roadmap-topic {
  min-width: 130px;
  max-width: 130px;
  padding: 6px 10px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.7em;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.roadmap-topic:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.18);
}

.roadmap-topic.mr { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); --branch-color: #e74c3c; }
.roadmap-topic.st { background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%); --branch-color: #27ae60; }
.roadmap-topic.pa { background: linear-gradient(135deg, #9b59b6 0%, #7d3c98 100%); --branch-color: #9b59b6; }

.roadmap-papers {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.roadmap-paper {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid var(--branch-color);
  font-size: 0.68em;
  color: #444;
  transition: background 0.2s ease, transform 0.2s ease;
}

.roadmap-paper:hover {
  background: #e9ecef;
  transform: translateX(2px);
}

.roadmap-paper-venue {
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.85em;
  white-space: nowrap;
}

.roadmap-branch.mr .roadmap-paper { --branch-color: #e74c3c; }
.roadmap-branch.mr .roadmap-paper-venue { background: #fdeaea; color: #c0392b; }

.roadmap-branch.st .roadmap-paper { --branch-color: #27ae60; }
.roadmap-branch.st .roadmap-paper-venue { background: #e8f8ef; color: #1e8449; }

.roadmap-branch.pa .roadmap-paper { --branch-color: #9b59b6; }
.roadmap-branch.pa .roadmap-paper-venue { background: #f4ecf7; color: #7d3c98; }

@media (max-width: 768px) {
  .roadmap {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  .roadmap-root {
    align-items: center;
  }
  .roadmap-connector {
    display: none;
  }
  .roadmap-branch {
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
  }
  .roadmap-topic {
    max-width: none;
  }
}
</style>

<div class="roadmap">
  <div class="roadmap-root">
    <div class="roadmap-root-node">Research</div>
  </div>
  <div class="roadmap-branches">
    <div class="roadmap-branch mr">
      <div class="roadmap-connector"><div class="roadmap-line"></div></div>
      <div class="roadmap-topic mr">Microservice Reliability</div>
      <div class="roadmap-papers">
        <div class="roadmap-paper"><span class="roadmap-paper-venue">FSE'26</span>Fault propagation-aware RCA benchmark</div>
        <div class="roadmap-paper"><span class="roadmap-paper-venue">Arxiv</span>DynaCausal for dynamic RCA</div>
        <div class="roadmap-paper"><span class="roadmap-paper-venue">Arxiv</span>Goal-driven RCA survey</div>
        <div class="roadmap-paper"><span class="roadmap-paper-venue">ASE'25</span>Multi-agent incident triage</div>
      </div>
    </div>
    <div class="roadmap-branch st">
      <div class="roadmap-connector"><div class="roadmap-line"></div></div>
      <div class="roadmap-topic st">Software Testing</div>
      <div class="roadmap-papers">
        <div class="roadmap-paper"><span class="roadmap-paper-venue">ICSE'24</span>Graph DB testing via query rewriting</div>
      </div>
    </div>
    <div class="roadmap-branch pa">
      <div class="roadmap-connector"><div class="roadmap-line"></div></div>
      <div class="roadmap-topic pa">Program Analysis</div>
      <div class="roadmap-papers">
        <div class="roadmap-paper"><span class="roadmap-paper-venue">ASE'23</span>gRPC dependency recovery</div>
      </div>
    </div>
  </div>
</div> -->

# 🔥 News {#news}
- *2025.12*: &nbsp;🎉🎉 Our paper "Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark" (arxiv version: "An Empirical Study of ...") has been directly accepted by FSE 2026 (**Direct Accept**, 87/920, 9.5%)!
- *2025.10*: &nbsp;🎉🎉 Our paper "DynaCausal: Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices" has preprint available on Arxiv!
- *2025.10*: &nbsp;🎉🎉 Our paper "A Goal-Driven Survey on Root Cause Analysis" has preprint available on Arxiv!
- *2025.10*: &nbsp;🎉🎉 Our paper "An Empirical Study of SOTA RCA Models: From Oversimplified Benchmarks to Realistic Failures" has preprint available on Arxiv!
- *2025.09*: &nbsp;🎉🎉 Our paper "Triangle: Empowering Incident Triage with Multi-Agent" has been directly accepted by ASE 2025!
- *2024.09*: &nbsp;🎉🎉 I have been invited to serve on the Artifact Reviewer Program Committee for TACAS 2025.
- *2024.09*: &nbsp;🎉🎉 Recieved ECOOP'24 Distinguished Artifact Reviewer Award!
- *2024.09*: &nbsp;🎉🎉 I have been invited to serve on the Artifact Reviewer Program Committee for ICSE 2025.


# 📝 Publications {#publications} 

- `FSE'26` [Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark](https://www.arxiv.org/abs/2510.04711), **Aoyang Fang**, Songhan Zhang, Yifan Yang, Haotong Wu, Junjielong Xu, Xuyang Wang, Rui Wang, Manyi Wang, Qisheng Lu, Pinjia He
- `Arxiv` [DynaCausal: Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices](https://arxiv.org/abs/2510.22613), Songhan Zhang, **Aoyang Fang**, Yifan Yang, Ruiyi Cheng, Xiaoying Tang, Pinjia He
- `Arxiv` [A Goal-Driven Survey on Root Cause Analysis](https://arxiv.org/abs/2510.19593), **Aoyang Fang**, Haowen Yang, Haoze Dong, Qisheng Lu, Junjielong Xu, Pinjia He
- `ASE'25` [Triangle: Empowering Incident Triage with Multi-Agent](/assets/publications/ase25/ASE_triangle.pdf), Zhaoyang Yu, **Aoyang Fang** (co-first author), Minghua Ma, Jaskaran Singh Walia, Chaoyun Zhang, Ze Li, Murali Chintalapati, Xuchao Zhang, Rujia Wang, Chetan Bansal, Saravan Rajmohan, Qingwei Lin, Shenglin Zhang, Dan Pei, Pinjia He
- `ICSE'24` [Testing Graph Database Systems via Equivalent Query Rewriting](/assets/publications/icse24/grev.pdf), Qiuyang Mang, **Aoyang Fang** (co-first author), Boxi Yu, Hanfei Chen, Pinjia He <a href="https://github.com/CUHK-SE-Group/GRev" class="badge">Code</a>
- `ASE'23` [RPCover: Recovering gRPC Dependency in Multilingual Projects](/assets/publications/ase23/ASE_grpc.pdf), **Aoyang Fang**, Ruiyu Zhou, Xiaoying Tang, Pinjia He <a href="https://github.com/CUHK-SE-Group/protoc-gen-scip" class="badge">Code</a>


# 🎖 Honors and Awards {#honors-and-awards}
- *2024.09* Distinguished Artifact Reviewer Award, ECOOP. 4 reviewers (out of 61) whose reviews and contributions to the discussions stood out and to whom we would like to present a Distinguished Artifact Reviewer award.
- *2023.09* Distinguished Paper Award of Industry Challenge Track, ASE. 

# 📖 Educations {#educations}
- *2024.09 - now*, PhD in Computer Science, The Chinese University of Hong Kong (Shenzhen)
- *2023.01 - 2024.07*, MPhil in Computer Information and Engineering, The Chinese University of Hong Kong (Shenzhen)
- *2018.09 - 2022.06*, BSc in Computer Science, Harbin Institute of Technology(Shenzhen) 

# 💻 Academic Positions and Internships {#academic-positions-and-internships}
- *2025.08 - Present*, Research Intern, [ByteDance Byte Brain](https://www.bytedance.com/)
- *2025.10 - 2025.12*, TOSEM'24 Reviewer
- *2025.01 - 2025.05*, Research Intern, [Microsoft Research Asia (MSRA)](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia/)
- *2024.11 - 2025.04*, USENIX Security '25 Cycle-1 Artifact Reviewer
- *2024.09 - 2025.02*, TACAS'25 Artifact Reviewer
- *2024.09 - 2025.02*, ICSE'25 Artifact Reviewer
- *2024.08 - 2024.09*, ISSRE'24 Artifact Reviewer
- *2024.04 - 2024.05*, ATC'24 Artifact Reviewer
- *2024.04 - 2024.05*, OSDI'24 Artifact Reviewer
- *2024.03 - 2024.04*, TOSEM'24 Reviewer
- *2024.01 - 2024.02*, ISSTA'24 Artifact Reviewer
- *2023.12 - 2024.01*, ECOOP'24, Extended Reviewer and Artifact Reviewer
- *2023.12 - 2023.12*, TACAS'24 Artifact Reviewer

# 🎓 Teaching Assistant {#teaching-assistant}
- *2025 Fall*, Teaching Assistant, CSC1001: Introduction to Computer Science: Programming Methodology
- *2025 Fall*, Leading Teaching Assistant, AIE1001: Introduction to AI Programming
- *2025 Spring*, Teaching Assistant, CSC4001: Software Engineering

# 💼 Industry Experience {#industry-experience}
- *2022.03 - 2022.09*, Backend Software Engineer, [Shopee Pte. Ltd.](https://shopee.com/)

# 🧸 Side Projects {#side-projects}
- [h-mem](https://github.com/Lincyaw/h-mem): A cognitive memory system for AI agents. Following Unix philosophy, it provides only two APIs: `remember` and `recall`.
- [agent-env](https://github.com/Lincyaw/agent-env): A Kubernetes-native execution environment for AI agents with warm pooling and ultra-low latency code execution.
- [claude-notify](https://github.com/Lincyaw/claude-notify): A notification plugin for Claude Code with desktop alerts and webhook integrations (Slack, Discord, Telegram, etc.).