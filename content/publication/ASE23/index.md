---
title: 'RPCover: Recovering gRPC Dependency in Multilingual Projects'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Aoyang Fang
  - Ruiyu Zhou
  - Xiaoying Tang
  - Pinjia He

# Author notes (optional)
# author_notes:
#   - 'Equal contribution'
#   - 'Equal contribution'

date: '2023-08-05T00:00:00Z'
doi: ''

# Schedule page publish date (NOT publication's date).
publishDate: '2023-08-05T00:00:00Z'

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ['1']

# Publication name and optional abbreviated publication name.
publication: In *38th IEEE/ACM International Conference on Automated Software Engineering*
publication_short: In *ASE*

abstract: The advent of microservice architecture has led to a significant shift in the development of service-oriented software. In particular, the use of Remote Procedure Call (RPC), a mode of Inter-Process Communication (IPC) prevalent in microservices, has noticeably increased. To figure out the rela- tionships between services and obtain a high-level understanding of service-oriented software, a line of recent work focuses on the dynamic construction of service call graphs, which relies on the preliminary deployment of services and only captures the calling relationships within a specific time frame. Meanwhile, static methods avoid the need for pre-deployment and often provide a more stable and complete graph compared to dynamic techniques. However, research and practical applications of static call graph construction remain relatively unexplored.This paper introduces RPCover, a novel gRPC dependency recovery framework that facilitates the interconnection of ser- vices across various programming languages using their static gRPC calls. In addition, due to the lack of a multilingual microservice benchmark that uses gRPC, we build the first multilingual benchmark RPCoverBench that contains complex gRPC call relations. RPCover has been evaluated on a single language benchmark (DeathStarBench) and our multilingual benchmark (RPCoverBench). The results show that RPCover effectively recovers 99.33% of the use cases of gRPC calls with less than 200% of the overhead compared with a single-language semantic dependency analyzer.

# Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags: 
  - Static Analysis

# Display this page in the Featured widget?
featured: false

# Custom links (uncomment lines below)
# links:
# - name: Custom Link
#   url: http://example.org

url_pdf: 'publication/ase23/ASE_grpc.pdf'
url_code: 'https://github.com/CUHK-SE-Group/protoc-gen-scip'
url_dataset: ''
url_poster: ''
url_project: ''
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  focal_point: ''
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
  - example

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ''
---

<!-- {{% callout note %}}
Click the _Cite_ button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the _Slides_ button to check out the example.
{{% /callout %}} -->

<!-- Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/). -->
