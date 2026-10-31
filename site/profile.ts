/** Everything the home page says about Aoyang Fang and his papers. Each paper's page is its document under papers/<id>/. */

export type Thread = 'incident' | 'testing' | 'agents'
export type Direction = 'llm4se' | 'se4llm'

/** The two directions of the research, and the threads each one holds. */
export const DIRECTIONS: Record<Direction, { label: string, from: string, to: string, says: string, threads: Thread[], now?: string }> = {
  llm4se: {
    label: 'LLM for SE', from: 'LLMs', to: 'Software',
    says: 'Keeping large software systems reliable: testing them, recovering how they are built, and finding why they fail in production, more and more with LLM agents.',
    threads: ['incident', 'testing'],
  },
  se4llm: {
    label: 'SE for LLM', from: 'Software engineering', to: 'LLMs',
    says: 'Engineering rigor for LLM agents: benchmarks that grade how they reason step by step, not only what they answer, and analysis of what they do.',
    threads: ['agents'],
    now: 'Now at ByteDance: analyzing and monitoring the trajectories of LLM agents.',
  },
}

export const THREADS: Record<Thread, { label: string }> = {
  incident: { label: 'Incident management' },
  testing: { label: 'Testing & analysis' },
  agents: { label: 'LLM agents' },
}

export interface Paper {
  id: string
  venue: string
  short: string
  /** When it appeared, as a fractional year: its place on the research map. */
  at: number
  thread: Thread
  title: string
  authors: string
  /** One sentence: the claim the paper's film proves. */
  claim: string
  badge?: string
  links: { label: string, href: string }[]
  /** The film's chapters, as its story names them. */
  chapters: [string, string][]
}

export const PAPERS: Paper[] = [
  {
    id: 'openrca2', venue: "arXiv'26", short: 'OpenRCA 2.0', at: 2026.45, thread: 'agents',
    title: 'OpenRCA 2.0: From Outcome Labels to Causal Process Supervision',
    authors: "Aoyang Fang, Yifan Yang, Jin'ao Shang, Qisheng Lu, Junjielong Xu, Rui Wang, Songhan Zhang, Yuzhong Zhang, Boxi Yu, Pinjia He",
    claim: "A right root cause is not a right diagnosis. OpenRCA 2.0 grades whether an agent's reasoning follows the fault the way it really spread.",
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2606.27154' }],
    chapters: [['0:00', 'Right answer, skipped step'], ['0:14', 'The cause is known'], ['0:27', 'Following the fault forward'], ['0:45', 'Grading the chain']],
  },
  {
    id: 'gleaner', venue: "ISSTA'26", short: 'Gleaner', at: 2026.3, thread: 'incident',
    title: 'Gleaner: A Semantically-Rich and Efficient Online Sampler for Microservice Diagnostics',
    authors: 'Yifan Yang, Aoyang Fang, Songhan Zhang, Pinjia He',
    claim: 'A trace that looks fine can hide the error in its logs. Gleaner reads traces and logs together, so a small sample keeps what diagnosis needs.',
    badge: 'Direct accept · 90 of 888',
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2604.16810' }],
    chapters: [['0:00', 'A trace that looks fine'], ['0:14', 'Why samplers drop it'], ['0:27', 'Traces as sets of pairs'], ['0:46', 'One percent, better diagnosis']],
  },
  {
    id: 'fse26', venue: "FSE'26", short: 'RCA benchmark', at: 2026.0, thread: 'incident',
    title: 'Rethinking the Evaluation of Microservice RCA with a Fault Propagation-Aware Benchmark',
    authors: 'Aoyang Fang, Songhan Zhang, Yifan Yang, Haotong Wu, Junjielong Xu, Xuyang Wang, Rui Wang, Manyi Wang, Qisheng Lu, Pinjia He',
    claim: 'Public benchmarks made RCA look solved. When faults travel, 11 state-of-the-art models find the root cause first 21% of the time.',
    badge: 'Direct accept · 87 of 920',
    links: [{ label: 'PDF', href: 'https://dl.acm.org/doi/pdf/10.1145/3797100' }, { label: 'arXiv', href: 'https://arxiv.org/abs/2510.04711' }, { label: 'Project', href: 'https://operationspai.github.io/revisiting-rca-evaluation/' }],
    chapters: [['0:00', 'Who gets blamed?'], ['0:13', 'The shortcut'], ['0:31', 'Faults that travel'], ['0:46', 'The scores fall']],
  },
  {
    id: 'dynacausal', venue: "arXiv'25", short: 'DynaCausal', at: 2025.85, thread: 'incident',
    title: 'DynaCausal: Dynamic Causality-Aware Root Cause Analysis for Distributed Microservices',
    authors: 'Songhan Zhang, Aoyang Fang, Yifan Yang, Ruiyi Cheng, Xiaoying Tang, Pinjia He',
    claim: 'The loudest services are often victims. DynaCausal follows a fault upstream over a call graph rebuilt in every time window.',
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2510.22613' }],
    chapters: [['0:00', 'Which service broke?'], ['0:13', 'The loudest are victims'], ['0:27', 'Follow the fault upstream'], ['0:42', 'Where to look first']],
  },
  {
    id: 'survey', venue: "arXiv'25", short: 'RCA survey', at: 2025.62, thread: 'incident',
    title: 'A Goal-Driven Survey on Root Cause Analysis',
    authors: 'Aoyang Fang, Haowen Yang, Haoze Dong, Qisheng Lu, Junjielong Xu, Pinjia He',
    claim: '135 RCA papers, sorted by the goal they serve, each explain points of an incident. None yet returns its whole propagation path.',
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2510.19593' }],
    chapters: [['0:00', 'One incident, 135 papers'], ['0:15', 'Same data, different goals'], ['0:30', 'Sorted by goal'], ['0:43', 'Points, not the path']],
  },
  {
    id: 'triangle', venue: "ASE'25", short: 'Triangle', at: 2025.55, thread: 'incident',
    title: 'Triangle: Empowering Incident Triage with Multi-Agent',
    authors: 'Zhaoyang Yu, Aoyang Fang (co-first), Minghua Ma, Jaskaran Singh Walia, Chaoyun Zhang, Shu Chi, Ze Li, Murali Chintalapati, Xuchao Zhang, Rujia Wang, Chetan Bansal, Saravan Rajmohan, Qingwei Lin, Shenglin Zhang, Dan Pei, Pinjia He',
    claim: 'An incident ticket alone cannot name its owner. One LLM agent per team fetches evidence and votes, so tickets reach the right team in fewer hops.',
    badge: 'Co-first author',
    links: [{ label: 'PDF', href: 'https://profile.aoyangfang.top/assets/publications/ase25/ASE_triangle.pdf' }, { label: 'DOI', href: 'https://doi.org/10.1109/ASE63991.2025.00062' }],
    chapters: [['0:00', 'A ticket nobody owns'], ['0:16', "The answer isn't in the ticket"], ['0:24', 'Agents go and look'], ['0:44', 'Fewer hops, sooner']],
  },
  {
    id: 'grev', venue: "ICSE'24", short: 'GRev', at: 2024.3, thread: 'testing',
    title: 'Testing Graph Database Systems via Equivalent Query Rewriting',
    authors: 'Qiuyang Mang, Aoyang Fang (co-first), Boxi Yu, Hanfei Chen, Pinjia He',
    claim: 'Ask a graph database one question many equivalent ways: where the answers disagree, there is a bug. GRev found 22 unknown ones.',
    badge: 'Co-first author',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1145/3597503.3639200' }, { label: 'Code', href: 'https://github.com/CUHK-SE-Group/GRev' }],
    chapters: [['0:00', 'Two answers to one question'], ['0:10', 'Why testers miss it'], ['0:22', 'The question is a graph'], ['0:35', 'Same question, many routes'], ['0:46', 'Where routes disagree']],
  },
  {
    id: 'rpcover', venue: "ASE'23", short: 'RPCover', at: 2023.75, thread: 'testing',
    title: 'RPCover: Recovering gRPC Dependency in Multilingual Projects',
    authors: 'Aoyang Fang, Ruiyu Zhou, Xiaoying Tang, Pinjia He',
    claim: 'Cross-language gRPC calls can be traced from source code alone, by joining both ends of each call through the Protobuf definition they share.',
    badge: 'Distinguished Paper Award, Industry Challenge Track',
    links: [{ label: 'DOI', href: 'https://doi.org/10.1109/ASE56229.2023.00108' }, { label: 'Code', href: 'https://github.com/CUHK-SE-Group/protoc-gen-scip' }],
    chapters: [['0:00', 'A call loses its trail'], ['0:12', 'Tracing waits for traffic'], ['0:19', 'The shared blueprint'], ['0:32', 'Every service, one map'], ['0:43', 'The system, drawn from source']],
  },
]

export const NEWS: [string, string][] = [
  ['2026.06', 'OpenRCA 2.0: From Outcome Labels to Causal Process Supervision is on arXiv.'],
  ['2026.04', 'Gleaner is directly accepted by ISSTA 2026 (90 direct accepts of 888). Congrats to Yifan, whom I mainly advised on this work.'],
  ['2025.12', 'Our fault propagation-aware RCA benchmark is directly accepted by FSE 2026 (87 of 920).'],
  ['2025.10', 'DynaCausal, A Goal-Driven Survey on Root Cause Analysis and our empirical study of SOTA RCA models are on arXiv.'],
  ['2025.09', 'Triangle is directly accepted by ASE 2025.'],
  ['2024.09', 'Artifact Evaluation Committee member of TACAS 2025 and ICSE 2025.'],
  ['2024.09', 'ECOOP 2024 Distinguished Artifact Reviewer Award.'],
]

export const ABOUT: { label: string, summary: string, items: [string, string][] }[] = [
  { label: 'Experience', summary: 'ByteDance · MSRA · Shopee', items: [
    ['2025.08–2026.08', 'Research intern, ByteDance Byte Brain'],
    ['2025.01–2025.05', 'Research intern, Microsoft Research Asia'],
    ['2022.03–2022.09', 'Backend software engineer, Shopee'],
  ] },
  { label: 'Education', summary: 'PhD · MPhil · BSc', items: [
    ['2024.09–now', 'PhD in Computer Science, CUHK-Shenzhen'],
    ['2023.01–2024.07', 'MPhil in Computer Information and Engineering, CUHK-Shenzhen'],
    ['2018.09–2022.06', 'BSc in Computer Science, Harbin Institute of Technology (Shenzhen)'],
  ] },
  { label: 'Honors', summary: 'ECOOP · ASE', items: [
    ['2024.09', 'Distinguished Artifact Reviewer Award, ECOOP'],
    ['2023.09', 'Distinguished Paper Award, ASE Industry Challenge Track'],
  ] },
  { label: 'Service', summary: 'TOSEM · OSDI · ATC · ICSE …', items: [
    ['Reviewer', 'TOSEM 2024, TOSEM 2025'],
    ['Artifacts', 'USENIX Security 2025, TACAS 2025, ICSE 2025, ISSRE 2024, ATC 2024, OSDI 2024, ISSTA 2024, ECOOP 2024, TACAS 2024'],
  ] },
  { label: 'Teaching', summary: '3 courses', items: [
    ['2025 Fall', 'Lead TA, AIE1001 Introduction to AI Programming'],
    ['2025 Fall', 'TA, CSC1001 Programming Methodology'],
    ['2025 Spring', 'TA, CSC4001 Software Engineering'],
  ] },
  { label: 'Projects', summary: 'h-mem · agent-env · claude-notify', items: [
    ['h-mem', 'A memory system for AI agents with two APIs: remember and recall'],
    ['agent-env', 'A Kubernetes-native execution environment for AI agents with warm pools'],
    ['claude-notify', 'Desktop and webhook notifications for Claude Code'],
  ] },
]
