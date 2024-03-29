---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "[CSS'23]NestFuzz: Enhancing Fuzzing with Comprehensive Understanding of Input Processing Logic"
subtitle: ""
summary: "Paper reading in Chinese"
authors: []
tags: []
categories: []
date: 2023-12-10T15:51:47+08:00
lastmod: 2023-12-10T15:51:47+08:00
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

本篇论文来自复旦大学系统软件与安全实验室。本文的主要贡献有：提出了一个能够有效建模复杂系统输入的方法；基于建模出来的结构应用了一种级联依赖感知的变异策略，这使得它能够更加充分地探索输入空间和程序的代码空间；通过这一套方法找到了46个新bug。

## 现状

现有的fuzzing工具很难生成复杂的输入结构、探索到程序深层的代码区域。以一个 MP4 多媒体播放器为例，这类软件可以接收一个 MP4 文件作为输入，而 MP4 文件的格式与 CSV、XML 相比更为复杂，并且各个结构之间还有互相的依赖和约束。

![](image.png)

例如，最外层的 moof 结构将 type、length 和 payload 聚合在一起。这意味着 payload 的解释很大程度上依赖于 type 和 length。同时， payload 字段又包含 mfhd 和 traf 两个子结构；traf又嵌套了tfhd和sdtp两个结构。这些子结构又可以被任意地组合，所以输入空间非常大，现有工具很难生成一个既符合要求，又能触发bug的输入。

具体来讲，现有基于静态分析或者神经网络的方法只能获取（学习）到各个单个字段的边界，但是无法了解字段内部嵌套的结构，以及结构和结构之间的关系。例如 sdtp 必须与 tfhd 结构相邻，并且这两个结构必须是 traf 的子结构。另外的一些方法是通过预定义的格式模板来生成 input 的，但是这需要很多的人力来完成，并且很多文档里定义到的所谓的specification，在真实的代码实现里并不是这样的。

针对这个问题，本文主要想通过分析和建模程序的输入处理逻辑来获取两个重要的信息：

1. 字段之间的依赖。比如 MP4 里的 moof 结构里的 length 是用来决定 payload 的长度的。如果 payload 的长度与 length 不同，那么就会在程序执行早期就被拒绝。
2. 层次间结构依赖。一个更加复杂的情况是推理 input 里的子结构的层次关系。例如在程序里可能会使用循环和递归来处理类似的结构，例如 MP4 里的 moof 的 payload 里会嵌套 traf，而 traf 又会继续嵌套别的结构。

针对这个目标，论文提出了两个步骤：

1. 使用 Input Processing Tree(新结构)，来表示输入处理逻辑。该结构能够帮助建模字段到字段的、结构到结构的依赖关系。
2. 基于 Input Processing Tree 设计一种能够感知 dependency 的mutation 策略。即，一旦需要变更某个字段，那么那些对这个字段有依赖的元素也要变更。

> 读到这里，小编猜测本文最核心的内容就是这个 Input Processing Tree。针对这个结构，自然而然地能提出几个问题：
> 
> 1. 作者是如何在树中表示一个元素的（field 和 sub-structure）？
> 2. 作者是如何将代码、input seed转换成这样的一颗树的？
> 2. 作者是如何用树来表示元素和元素之间的关系的？
> 3. 假设元素和元素之间的依赖关系存在着环，作者是怎么解决的？
> 让我们带着这几个问题，一起往下看

## 方法

![](image-1.png)

作者首先给出了一些常用名词的定义：

1. F，字段（Field）。一个字段包含了一组连续的 bytes。F 通常会有一些属性，包括这些 bytes 在 raw data 里的 `start` 位置和 `end` 位置，具体的值，以及字段的类型。所以可以定义 $F=\{\cup_{start}^{end}byte_i,value,type\}$
2. SF，子结构（substructure）。一个子结构会包含一组连续的 fields，或者是其他的子结构。因此定义$SF=\cup_{i,j}(F_i|SF_j)$。
3. 一个$F_1$可能依赖于另一个$F_2$，如果修改了$F_2$的值，那么会影响$F_1$。因此使用$D[F_1,F_2]$来表示这两者之间的依赖关系。

### 建模 IPL

Input processing logic 是程序中包含读取、翻译、验证input的代码逻辑。为了建模 IPL，NestFuzz 使用三个步骤：

1. 通过动态污点分析来识别 input-accessing 指令。
2. 分别推断字段间的依赖和层次间的依赖。
3. 最后用 Input Processing Tree 来表示 IPL。


#### 识别处理输入的指令

作者使用污点分析来识别处理输入的指令。具体来说，作者先把输入的所有字节都标记为 tainted，然后跟踪每一个字节的传播。当一个变量被赋予taint label时，可以通过这些标签追溯到流向该变量的输入字节。因此，当一个指令涉及到被污染的操作数时，它就可以被分类为输入访问指令。在这个过程中，重点关注三种类型的输入访问指令：Load（加载）、Cmp（比较）和Switch（切换）。这些指令被加入了监测代码，以跟踪它们的指令地址和操作数的污点标签，这些标签指示相应输入字段的偏移量。

> 这种方式可能只比较适用于二进制格式。

此外，一个指令可能在不同的上下文中执行多次，因此具有不同的污点标签。通过这个步骤，就可以采集到一些字段里不同的值被哪些代码处理了。

#### 识别字段间的依赖

在识别到哪些指令是用于处理输入之后，就可以通过这些指令来分析输入的格式信息。在这个步骤中，NestFuzz 会识别关键的字段，例如（length、offset、category、payload），然后推导这些字段汇总的关系。

> 根据此处的描述，这些关键字段仍然需要human expert来定义，变相还是使用了模板。后面需要考查一下这种方式的通用性，是否能够覆盖到足够多的情况（除了二进制格式文件外，可能还需要考虑别的格式，例如各种通信协议等）。

在这里，作者主要考虑了三种 inter-field 的关系，包括 $D[payload, length]$，$D[payload,offset]$ 和 $D[payload, category]$。

##### $D[payload, length]$

对于$D[payload, length]$，作者假设 length 字段通常会被用在 buffer 相关的系统 API 中。

当一个被污染的变量用作某个API的参数时，如果这个API是以长度类型的参数为特征的，那么这个污点变量就被识别为长度类型的字段。例如，如果一个API负责读取或写入数据，并且它接受一个指定了要处理的字节数的参数，那么这个参数（如果被污点变量所影响）就被视为一个长度字段。

```c
read(handler, buffer, length) // read content 
buffer = malloc(length) // allocate a buffer 
memcpy(dst, src, length) // copy from src to dst
```

一旦长度字段被识别，就可以进一步分析使用这个长度字段的API，以推断出与之相关的有效载荷字段。有效载荷字段是指实际包含数据或信息的部分，其大小或长度通常由前面识别的长度字段所指定。通过观察哪些数据或缓冲区与长度字段一起被处理，可以识别出有效载荷字段。

另一方面，如果有一个被污染的变量被用在循环里，来决定读取被污染的数据的循环次数，那么就可以将 length 和 buffer 绑定在一起，并且认定在循环里的被污染变量是 payload 部分。

##### $D[payload,offset]$ 

当分析系统API的使用时，如果一个变量被污染并且被用作API的参数，这个变量可能被识别为偏移量类型的字段。例如，如果一个API接受一个参数来指定从输入数据的哪个位置开始读取或处理数据，那么这个参数（如果被污染）就被视为偏移量字段。

一旦偏移量字段被识别，接下来的步骤是分析在该API调用之后访问的缓冲区。如果这个缓冲区被污染，那么它就可以被认为是与偏移量字段相关的payload。Payload包含了实际的数据或信息，其在输入数据中的位置由偏移量字段指定。

##### $D[payload, category]$

如果有一个类型字段（如 𝑏𝑜𝑥→𝑡𝑦𝑝𝑒）决定了如何解析缓冲区（如 𝑏𝑜𝑥→𝑑𝑎𝑡𝑎），那么在对目标程序进行模糊测试时，就需要充分理解并识别这个类别字段及其相关的有效载荷结构。

如果一个被污染的变量出现在条件检查（如 if-else 或 switch-case 语句）中，这个变量可能是一个类别字段。在条件指令的两个操作数中，只有一个应该被污染，另一个应该是常量或未被污染的值。因此，可以将同一层级（如同一个 if-else 或 switch-case 结构）中条件检查的相关操作数（如 type1 和 type2）分组，作为该类别字段的值选择集。

如果是分支语句，那么收集并分组被污染的变量。这些被污染的变量被保存在一个临时列表中，稍后将在下一个阶段处理，以构建相应的有效载荷。

#### 识别多层次的依赖

为了识别层次间的依赖，作者提出了 Input Process Tree，结构如下：

- **内部节点**： 内部节点代表导致其他指令执行的指令。这些通常包括三种类型：函数、分支和循环指令。由这样的内部节点引导的子树必须涉及被污染的数据（即受输入数据影响的数据）。这意味着，这些节点是输入处理逻辑的关键部分，它们控制着程序如何根据输入数据的不同来执行不同的操作。

- **叶节点**： 叶节点是直接访问输入的指令，其操作数被污染。这些指令直接处理输入数据，例如读取或修改基于输入的变量。

- **节点关系**： 如果一个指令包含在对应的内部节点（即函数、循环或分支体）中，那么这个指令就是该内部节点的子节点。这定义了树中节点之间的层级关系，反映了程序中不同指令之间的嵌套和逻辑关系。

- **子树包含污点变量的节点**： 输入处理树的任何子树都包含涉及污点变量的节点。这表明，树的每个部分都以某种方式参与到输入数据的处理中，确保了树结构全面覆盖了程序中所有相关的输入处理逻辑。

下面给出一个例子来说明这颗树的结构，以及这棵树是如何与代码对应的。

<div style="display: flex; justify-content: space-between;">
<img src="image-2.png"style="max-width: 50%; height: auto;"/> <img src="image-3.png" style="max-width: 50%; height: auto;" />
</div>

总的来说，这个所谓的 input processing tree就是控制流图（control flow graph）的**剪枝**版本。把控制流图中的环展开、把与input无关程序处理逻辑删除后，就成了input processing tree。

- 根节点表示的是main函数，在该例子中代表的是`parse_boxes_internal`。
- 内部节点是函数、分支、循环，在这里是`while loop`, `box_parse_ex`, `moof_read`等。对于循环，在控制流图里表示的是一个环，但是在input processing tree里将环展开了，从而得到了不同的Iter，因为在不同的Iter里，处理的逻辑可能是不同的。
- 而对于叶子结点，在这个图里显示的都是load对应的数据（即与输入处理有关的指令）。其中不同的Load有对应的tag，例如`Tag:<0,4>`表示的就是这部分的Load会接收输入的第0个字节到第4个字节的数据。

这么一个input processing 恰好类似于输入的数据格式，原因是一般来说数据处理是类似于解包的过程，是由外往内一层一层解开，因此会与输入格式类似。有了input processing tree，就有助于NestFuzz来识别输入的格式（结构）。

基于input processing tree，就可以进行“有依赖的”mutation。即，更改了payload之后，也需要同时修改length。

![](image-4.png)

## 实验评估

本文主要从代码覆盖率、找到的bug数量、推导出来的输入格式的准确率和性能，三个方面来进行评估。

### 代码覆盖率（行覆盖率L，分支覆盖率B）

在二进制格式的输入中，NestFuzz几乎超过了所有的baseline（除了pngtest，原因是当前的实现没有考虑 PNG 格式使用的校验和来检查文件完整性）。因此说明这个方法在二进制格式上的探索非常有效。

而在非二进制格式上，就仅有(2/6)超过了baseline。作者给出的理由是例如json或者C语言文件都是基于语法的，有严格的语法约束，并不是他们关注的重点，他们关注的是具有复杂结构的块状输入。

![](image-5.png)

### 找到的Bug

在找到的bug数量方面，NestFuzz几乎也是能比全部的baseline在每个单项测试里找到的都多（除了tic-MOPT和indent-MOPT）。并且有相当一部分的bug是仅能被NestFuzz找到的，这也证明了NestFuzz的巨大有效性。

![](image-6.png)

除此之外，NestFuzz还能在更短的时间内达到更高的覆盖率、更短的时间内找到相同数量的bug。作者还对自身做了消融实验，表明是否学习到输入的结构以及是否学习到字段之间的依赖关系对代码覆盖率的影响，结果表明仅使用字段间依赖的知识，代码覆盖率平均下降了11%，而仅使用输入的结构，代码覆盖率平均下降了25%。因此这说明字段之间的依赖关系对NestFuzz，及其对应的场景来说更加重要。
为了节省空间，这部分的数据就不贴上来了。



### 格式推断的表现

- NestFuzz在输入结构推断方面表现出色，平均推断时间约为0.77秒，远远快于其他方法（如TIFF平均需要24.9秒）。
- NestFuzz能够构建复杂的树形结构来表示输入数据，例如在处理MP4文件时，树的平均深度达到11.68。
- NestFuzz能够识别出即使是相同输入在不同程序中的处理差异，这对于模板化的模糊测试方法（如AFLSmart）是一个显著的优势。
- 相比其他工具，NestFuzz在测试中能生成更多具有复杂结构的输入，这对于发现深层次的漏洞非常有效。
- 输入结构的正确性: NestFuzz在正确识别输入结构方面表现出色，例如在MP4格式中，它能识别出比010 Editor更多的字段和结构。
- 传统工具（如010 Editor）在处理复杂输入时受限于模板，而NestFuzz能够处理更多类型的输入结构，这在发现程序中的深层漏洞方面非常关键。




## 总结


本文提出了input processing tree来建模输入内的依赖关系以及输入内的层次结构。找到了46个新bug，其中有37个被赋予了CVE-ID。在实验方面，不仅与baseline方法有比较详细的对比，也对自己方法内部有一个比较细节的分析，因此是一个比较充分的工作。但是这篇论文也有比较大的改进空间。

首先先来回答小编前面提出的几个问题：
> 
> 1. 作者是如何在树中表示一个元素的（field 和 sub-structure）？见上文input processing tree的结构
> 2. 作者是如何将代码、input seed转换成这样的一颗树的？通过控制流图和污点分析
> 2. 作者是如何用树来表示元素和元素之间的关系的？见input processing tree结构
> 3. 假设元素和元素之间的依赖关系存在着环，作者是怎么解决的？将环展开

作者提出的input processing tree，本质上是一个简化版的控制流图。通过展开图里的环（例如将循环展开成对应的分支），以及删减没有被污染的区域，从而将一个图剪枝成了一颗树。

然后通过预定义的模式（本文仅仅提出并实现了3种模式，[payload,offset], [payload,category], [payload,length]），去这一个简化版的控制流图中进行匹配，如果匹配上了，那么就对对应的区域打上标记，表示这块区域对应的是payload、category等。这里作者也提到了这部分的缺点，作者的解决方案是增加更加多样的模式来适配不同的情况，原文为：“除此之外，还存在其他类型的复杂输入约束，例如输入校验和验证和字段间的数值约束。对于校验和相关的约束，可以通过插桩和修补校验和来缓解。对于数值约束，可以通过应用符号执行或梯度下降方法来处理。”

适用场景方面，NestFuzz只适用于二进制下基于chunk的，有多层次间依赖的场景，无法在约束更加严格的场景下表现良好（例如语法约束），这部分也比较可惜。

另外，作者也提到依赖于污点分析带来的局限性：NestFuzz基于字节级动态污点分析来识别输入处理指令。这种方法可能存在欠污点（under-taint）和过污点（over-taint）问题，这些问题不可避免地会影响NestFuzz的精确度。解决这些问题的策略将是未来的研究工作。