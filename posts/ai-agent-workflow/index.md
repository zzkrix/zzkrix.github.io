# AI Agent 和 workflow 介绍


## 概念

> 首先明确一点，AI 输出内容存在随机性。

AI 推理是指人工智能在处理问题时，根据已有的数据和模型，进行逻辑推断和生成答案的过程。这个过程包括了从大量的数据中抽取有用信息、应用已学的规则或模式、并最终得出一个可能的回答。由于 AI 生成的结果有时会有所不同，主要有以下几个原因：

1. **随机性**：许多 AI 模型在生成回答时会引入一定的随机性。例如，在生成文本时，模型可能会从多个合适的选项中随机选择一个，因此同一个问题的回答可能会有所不同。

2. **上下文理解**：AI 的回答会受到上下文的影响。不同的上下文或问法可能导致模型关注不同的细节，从而产生不同的回答。

3. **训练数据**：AI 的回答基于其训练数据和学习到的模式。如果训练数据有多种可能的解释或观点，模型的回答可能会体现这些多样性。

4. **模型参数**：不同的模型版本或配置可能会产生不同的回答。参数调整或模型更新也可能影响生成的内容。

5. **生成策略**：在生成答案时，AI 模型可能会使用不同的策略，例如长度限制、内容多样性等，这也会导致回答的变化。

![2024-08-23-15-00-fMIFbT](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-00-fMIFbT.png)

> 如果有外部知识库的辅助，AI 输出的内容就会有更好的确定性

检索增强生成（RAG - Retrieval-Augmented Generation）是指**对大型语言模型输出进行优化**，使其能够在生成响应之前引用训练数据来源之外的权威知识库。大型语言模型（LLM）用海量数据进行训练，使用数十亿个参数为回答问题、翻译语言和完成句子等任务生成原始输出。在 LLM 本就强大的功能基础上，RAG 将其扩展为能访问特定领域或组织的内部知识库，所有这些都无需重新训练模型。这是一种经济高效地改进 LLM 输出的方法，让它在各种情境下都能保持相关性、准确性和实用性。

![2024-08-23-15-00-eVrspz](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-00-eVrspz.jpg)

![2024-08-23-15-00-RgS12u](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-00-RgS12u.png)

AI Agent（一般称 AI 代理 或 AI 智能体）

AI 聊天机器人主要靠“说”来回答你的问题，而 AI Agent 则会**“动”起来完成具体的任务**，就像人类助理一样，在你忙不过来的时候替你完成一些工作，区别就是用 AI 来驱动而不是人脑驱动。

从原理上说，AI Agent 的核心驱动力是大模型，在此基础上增加规划（Planning）、记忆（Memory）和工具使用（Tool Use）三个关键组件。

**AI Agent = LLM（大模型） + Planning（规划） + Memory（记忆） + Tools（工具）**

![2024-08-23-15-00-gF9WPr](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-00-gF9WPr.png)

1. **LLM（大模型）**：就像园丁的智慧和知识库，它阅读了海量的园艺书籍和资料，不仅知道各种植物的名字，还懂得如何照顾它们。在 AI Agent 中，LLM 提供了庞大的信息存储和处理能力，以理解和响应我们提出的各种问题。

2. **Planning（规划）**：园丁需要规划整个花园的布局。AI Agent 的规划功能，就像园丁制定种植计划，决定先种哪些花草、后种哪些蔬菜，或者如何分步骤修剪树冠。

3. **Memory（记忆）**：这类似于园丁的笔记本，记录了每个植物的种植时间、生长情况和前一次施肥的时间。记忆模块让 AI Agent 能记住以往的经验和已经完成的任务，确保不会重复错误。

4. **Tools（工具）**：就是园丁的用具，比如铲子、水壶和剪刀。AI Agent 的工具模块，指的是它可以运用的各种软件和程序，帮助它执行复杂的任务，就像园丁用工具进行园艺活动一样。

**Workflow**更像是一组**预定的规则和步骤的组合**，通过这些步骤的顺序执行，来实现一个复杂的任务。Workflow 的每一步可能涉及多个 Agent 来完成特定的子任务。

Agent 和 Workflow 是相辅相成的关系。在一个复杂的 Workflow 中，可能需要**多个 Agent**来完成不同的任务。例如，在一个自动化的客户服务系统中，可能有一个 Agent 负责与用户互动、另一个 Agent 负责后台数据处理，还有一个 Agent 负责决策制定。Workflow 则负责**协调**这些 Agent，使得整个任务可以流畅地执行。因此，Workflow 可以被看作是 Agent 操作的框架，它规定了每个 Agent 的角色、任务顺序以及如何在不同任务之间传递信息。

![2024-08-23-15-01-gNUA99](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-01-gNUA99.png)

**RAG、Agent、Workflow 有什么区别和联系**

RAG（Retrieval-Augmented Generation）是近年来流行的一种结合信息检索和生成的 AI 模型，它通过先检索相关信息再进行文本生成来提供更准确的答案。与 Agent 和 Workflow 不同，RAG 专注于单一任务的优化，即通过增强生成模型的输入质量来提高输出的准确性。Agent 和 Workflow 则更关注于任务的执行过程和多任务协作。简而言之，RAG 是在单个任务（如问答生成）中提高表现的技术，而 Agent 和 Workflow 则是在多任务场景下实现任务的高效执行与协作的框架。

## 应用

[AI 产品案例严选](https://waytoagi.feishu.cn/wiki/MdNUwjXUZiuKLCkN4YrcNSZcnFb?table=tblwdvsWICkId67f&view=vewJuuzsne)

[ChatDev](https://github.com/OpenBMB/ChatDev) 是一家虚拟软件公司，通过各种**不同角色的智能体**运营，包括执行官，产品官，技术官，程序员 ，审查员，测试员，设计师 等。这些智能体形成了一个多智能体组织结构，其使命是“通过编程改变数字世界”。ChatDev 内的智能体通过参加专业的功能研讨会来 协作，包括设计、编码、测试和文档编写等任务。

![2024-08-23-15-02-XWZ7AE](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-02-XWZ7AE.png)

[Coze](https://www.coze.cn/) 是新一代一站式 **AI Bot 开发平台**。无论你是否有编程基础，都可以在 Coze 平台上快速搭建基于 AI 模型的各类问答 Bot，从解决简单的问答到处理复杂逻辑的对话。并且，你可以将搭建的 Bot **发布到各类社交平台和通讯软件**上，与这些平台/软件上的用户互动。

![2024-08-23-15-02-RYJP0v](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-02-RYJP0v.png)

[Dify](https://dify.ai/zh) 是一款开源的大语言模型 (LLM) **应用开发平台**。它融合了后端即服务（Backend as Service）和 **LLMOps** 的理念，使开发者可以快速搭建生产级的生成式 AI 应用。即使你是非技术人员，也能参与到 AI 应用的定义和数据运营过程中。

![2024-08-23-15-02-kEEKP5](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-23-15-02-kEEKP5.png)

## 参考资料

[大模型幻觉](https://github.com/wdndev/llm_interview_note/blob/main/09.%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E8%AF%84%E4%BC%B0/1.%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%BB%E8%A7%89/1.%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%BB%E8%A7%89.md)

[AI Agent 来了，但它是什么？ AI 代理介绍、趋势全解读](https://www.gvm.com.tw/article/113965)

[什么时候该用多智能体是不是一定要用多智能体？](https://baoyu.io/blog/ai/when-to-use-multi-agent-systems-or-cot)

[为什么大佬都在说 Agent 是未来？换个角度来谈一谈](https://www.aixinzhijie.com/article/6845404)

[吴恩达红杉美国 AI 峰会谈 Agent Workflow 以及 4 种主流设计模式、\_腾讯新闻](https://new.qq.com/rain/a/20240329A041XC00)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/ai-agent-workflow/  

