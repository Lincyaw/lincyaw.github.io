# SpecGuardBench: Can Coding Agents Construct Reliable Validation Harnesses from Natural Language Specifications? — Highlights

Source: arXiv 2610.16870v1 (LaTeX source, abstract, §1–§5, Appendices A–C).

**Task.** Given one atomic natural language specification, the code repository and a reference implementation (the agent is not told whether the reference satisfies the specification), a coding agent must build a *validation harness*: a scenario generator (`build_cases()`, concrete arguments for single invocations) and scenario-agnostic executable checks (`check_case(case)`, invoke the code and assert what the specification requires). The harness should reject every implementation that violates the specification, accept every one that satisfies it, and exercise the relevant code thoroughly (§1, §2.1).

**Challenge.**
- Passing a finite test suite does not establish conformance: an incorrect implementation can pass the tested examples and violate the specification in untested situations; test inputs are coupled to expected outputs, so suites are hard to scale (§1).
- Test-generation benchmarks score fault detection, bug reproduction or structural coverage, and overlook tests that overfit the reference implementation instead of the specification (§1).
- Verification-oriented benchmarks (Verina, CLEVER) evaluate machine-checkable specifications in predefined formal languages, which says little about validating real repositories against diverse natural language specifications (§1).

**Solution.** SpecGuardBench scores a harness by running its checks on three kinds of implementations of each atomic specification: the gold implementation (must be accepted), a violating implementation (must be rejected), and valid alternative implementations that change only code the specification does not constrain (must be accepted). Metrics: **faithfulness** (rejects the violation and accepts every satisfying implementation), split into **detection** (rejects the violation) and **false alarm** (rejects the gold or an alternative), plus **edge coverage** of the scenarios over the gold-patch functions (§2.1).
- Built on 30 FeatureBench instances from 13 Python repositories (§2.2).
- **Decomposition:** an LLM (Claude Opus 5) splits each feature specification into atomic specifications, each copied from the original text and paired with its gold-patch implementation (§2.2).
- **Violation synthesis:** the same LLM injects a violation of one atomic specification and writes a *differential witness* (scenarios whose output diverges from gold). A candidate is kept only if it **passes the instance's original test suite** and its witness diverges from gold; a second LLM (GPT-5.6-sol) confirms the violation by majority vote of three (§2.2).
- **Other specifications kept:** neighbours' witnesses are run on the candidate and the second LLM checks every other specification still holds; a neighbour's surviving candidate serves as the valid alternative (§2.2).
- Human check: 50 sampled tasks, two annotators agree on 94.7% of judgments; adjudication confirms the pipeline on 98% of tasks (§2.2).
- Result: 291 tasks (Full Set; median 7.5 per instance, IQR 4–11), and a Lite Set of 100 stratified tasks. Eight types of verification logic from open coding: functional postcondition 143 (49.1%), input validation 52 (17.9%), interaction protocol 32 (11.0%), interface signature 23 (7.9%), state postcondition 18 (6.2%), frame condition 14 (4.8%), relational property 5 (1.7%), call order 2 (0.7%) (§2.3, App. A, Table 3).
- Example task (App. B): astropy `default_cosmology.validate`, S16 "Raises TypeError: If value is not None, a string, or a Cosmology instance." The violation widens `isinstance(value, Cosmology)` to `isinstance(value, (Cosmology, int, float))`, so 1, 0, −3, 2.5 and True are returned unchanged instead of raising; the original suite reaches this branch only with a class object and cosmology instances. A Codex/GPT-5.6-sol harness that asserts TypeError only when the value is not None, str or Cosmology, and nothing otherwise, is faithful.

**Insight.** A harness must assert "no more and no less than the specification requires": checks decoupled from scenarios can be reused on new scenarios and real executions, and a check is only trustworthy if it accepts implementations that differ from the one it was written against. Because every reported failure is witnessed by a concrete misjudged implementation, measured faithfulness is an upper bound that errs only in the agents' favour (§1, §2.1).

**Findings.**
- The bottleneck is the checks, not the scenarios: false alarms leave each agent's faithfulness 11–22 points below its detection rate, and false alarms make up 42–60% of each agent's failures (§4.2, §4.3, Fig. 5a).
- Replacing generated scenarios with witness scenarios that expose the violation repairs about two thirds of missed violations for GPT-5.6-sol and half for GLM-5.3, but about three quarters persist for Claude Opus 5 (74%) and DeepSeek-V4-Pro (77%); scenarios account for at most 33–42% of each agent's failures (§4.3, Fig. 5b).
- Agents mirror the reference: shown the violating implementation as reference (Lite Set), every agent loses 19–31 points of faithfulness, and rejection of the unseen gold implementation rises from 0–15% to 12–41% (§4.4.1, Table 2).
- Agents read their own rejections differently: Claude Opus 5 and GLM-5.3 blame their checks (detection drops sharply, 66→33 and 75→44); GPT-5.6-sol and DeepSeek-V4-Pro blame the implementation (detection barely changes) but over-assert and reject gold (§4.4.1).
- A detection-only evaluation would misrank agents: GPT-5.6-sol detects 8 points more than GLM-5.3 but also raises 8 points more false alarms, so their faithfulness is similar (§4.2). More steps help little: 50 steps are no more faithful than 30; gains appear only between 50 and 80 for the open-weight agents (§4.4.2).

**Results.** Main experiment, 291 tasks, 80-step budget, gold reference (Table 1):

| Agent | Detection | False alarm | Faithfulness | Edge cov. | Cost/task |
|---|---|---|---|---|---|
| Codex / GPT-5.6-sol | 81.8% | 23.0% | 61.9% | 82.0% | $0.74 |
| Claude Code / Claude Opus 5 | 65.3% | 20.6% | 50.2% | 72.4% | $1.79 |
| OpenCode / DeepSeek-V4-Pro | 66.7% | 26.8% | 45.0% | 75.1% | $0.43 |
| OpenCode / GLM-5.3 | 74.2% | 15.1% | 62.9% | 84.3% | $1.48 |

- No agent is faithful on more than 63% of tasks; the best are GLM-5.3 (62.9%) and GPT-5.6-sol (61.9%). Agents miss the violation on 18–35% of tasks and raise false alarms on 15–27%.
- Violating reference, Lite Set, faithfulness gold → violating reference: GPT-5.6-sol 65→46, Claude Opus 5 52→21, DeepSeek-V4-Pro 52→28, GLM-5.3 68→39; gold rejection 4→29, 4→31, 15→41, 0→12 (Table 2).
- Feature-averaged results (App. C) change every metric by under 3 points.

Limits stated: tasks come from a subset of FeatureBench and are uneven across repositories; Python only; faithfulness is estimated on a finite set of implementations, so over-assertion no alternative exercises goes undetected; repositories are public, but violating and alternative implementations are newly synthesized (§5).
