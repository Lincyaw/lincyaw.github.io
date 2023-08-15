---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Keynotes for Paper Writing"
subtitle: ""
summary: ""
authors: []
tags: []
categories: []
date: 2023-08-14T21:37:32+08:00
lastmod: 2023-08-14T21:37:32+08:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---


{{< toc >}}


## General tips for writing

### Flow
It should be clear how each sentence and paragraph relates to **the adjacent ones**.

{{% callout note %}}
Rule1: 

- **Begin sentences with old information.** Create link to earlier text
- **End sentence with new information.** Create link to the text that follows, also places new info in position of emphasis
{{% /callout %}}



### Coherence

It should be clear how each sentence and paragraph relates to the big picture.

{{% callout note %}}
Rule2: **One paragraph, one point.**


- A paragraph should  have one main point, express in a single **point sentence**.
- **Typically** the point sentence should appear at or **near the beginning of the paragraph**.


{{% /callout %}}


### Name your baby

{{% callout note %}}
Rule3: **Give unique names to things and use them consistently**
{{% /callout %}}



### Just in time

{{% callout note %}}
Rule4: **Give information precisely when it is needed, not before.**
{{% /callout %}}



## Structure of a research paper

The basic idea: TOP-DOWN.

Explain your work at multiple levels of abstraction starting at a high level and getting progressively more detailed. A typical structure is:


- Abstract(1-2 paragraphs, 1000 readers)
- Intro(1-2 pages, 100 readers)
- Key ideas(2-3 pages, 50 readers)
- Technical meat(4-6 pages, 5 readers)
- Related work(1-2 pages, 100 readers)


### Abstract

The CGI model for an abstact/intro.

**Context**. Set the stage, motivate the general topic.

**Gap**. Explain your specific problem and why existing work does not adequately solve it.

**Innovation**. State what you've done that is new and explain how it helps fill the gap.

### Introduction

There are two ways in writing the introduction.

- Like an expanded version of abstract
- Eliminate **C**ontext. For example: 
  1. Start with a contrete example. 
  2. If this works, it can be effective, but I find it often doesn't work. 

In the second way, it assumes reader already knows the context.

### Key ideas

1. Use **concrete illustrative** examples and **high-level** intuition.

2. Do not have to show the general solution.(that's what the technical section is for)

Why have a "key ideas" section at all? 


- Force you to have a "takeaway"
- Many readers only care about the takeaway, not the technical details
- For those who want the technical details, the key ideas are still useful as "scaffolding".


{{< figure src="1.png" id="wowchemy" width="50%">}}

### Related work

**It goes at the end** of the paper. You can only properly compare to related work once you've explained your own.

**Give real comparisons**, not a "laundry list"! Explain in detail how your work fills the **G**ap in a way that related work doesn't.


## References
1. How to write papers so people can read them
{{< youtube aZp4vZccI6Q >}}

2. [Tips on Writing a Research Paper](https://www.pldi21.org/prerecorded_plmw.2.html)