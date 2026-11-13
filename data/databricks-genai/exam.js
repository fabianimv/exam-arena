/* =========================================================================
   data/databricks-genai/exam.js — Databricks · Generative AI Engineer Associate (English)
   ========================================================================= */
(function (w) {
  w.EXAMS = w.EXAMS || {};
  w.EXAMS["databricks-genai"] = {
    "id": "databricks-genai",
    "appId": "databricks-genai",
    "provider": "Databricks",
    "badge": "Databricks · GenAI Eng",
    "icon": "🧱",
    "color": "#ff3621",
    "featured": true,
    "title": "Databricks · Generative AI Engineer Associate",
    "subtitle": "Mosaic AI Vector Search, Model Serving, RAG, MLflow Evaluation, and Unity Catalog Governance",
    "passingScore": 70,
    "domains": {
      "1": "GenAI Application Design (14%)",
      "2": "Application Development and Chunking (14%)",
      "3": "Data Preparation and Vector Search (30%)",
      "4": "Deployment with Mosaic AI Model Serving (22%)",
      "5": "Evaluation with MLflow and Governance (20%)"
    },
    "shortDomains": {
      "1": "Design",
      "2": "RAG & Chains",
      "3": "Vector Search",
      "4": "Model Serving",
      "5": "MLflow & UC"
    },
    "topics": [
      {
        "id": "dbg-t-1-1",
        "d": 1,
        "title": "1.1 · GenAI Architectures: RAG vs Fine-Tuning vs Pre-training vs Prompt Engineering",
        "html": "<table class=\"keytable\">\n<tr><th>Architectural Approach</th><th>When to Choose It</th><th>Data Freshness & Citations</th><th>Cost & Latency</th></tr>\n<tr><td><b>Prompt Engineering / Few-Shot</b></td><td>General reasoning tasks, quick classification, or extraction over short texts that fit in the immediate context.</td><td>Static, based on the base model's cutoff date; no automatic citations from external databases.</td><td>Low cost per call; minimal latency with no dedicated infrastructure.</td></tr>\n<tr><td><b>RAG (Retrieval-Augmented Generation)</b></td><td>Grounded answers over changing knowledge bases, corporate manuals, internal policies, or private data.</td><td>Data kept up to date in near real time through synchronization with Delta Lake; precise, auditable verbatim citations.</td><td>Moderate cost (Vector Search + LLM); latency governed by retrieval (~15-50 ms) plus inference.</td></tr>\n<tr><td><b>Fine-Tuning (PEFT / LoRA / Full)</b></td><td>Adapting tone/style, following proprietary syntax, specialized classification tasks, or structured-output tasks.</td><td>The weights freeze knowledge; it does not guarantee factual accuracy or dynamic citations without an additional RAG component.</td><td>High training cost; inference requires dedicated compute in Model Serving.</td></tr>\n<tr><td><b>Pre-training / Continued Pre-training</b></td><td>Building highly specialized domain models (biomedical, ultra-specific legal) or low-resource languages.</td><td>Knowledge embedded in the model parameters; requires very costly periodic repetition to stay current.</td><td>Extremely high financial and compute cost (hundreds of A100/H100 GPUs for weeks).</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-1-2",
        "d": 1,
        "title": "1.2 · Foundation Model Selection, Embeddings, and Orchestration Patterns",
        "html": "<table class=\"keytable\">\n<tr><th>Component</th><th>Options in Databricks</th><th>Selection Criteria</th></tr>\n<tr><td><b>Foundation Models (LLMs)</b></td><td>DBRX, Llama-3 (8B, 70B), Mistral/Mixtral, external APIs (OpenAI GPT-4, Anthropic Claude via AI Gateway).</td><td>Trade-off among reasoning quality, p95 latency, context window size (8k to 128k+), and data sovereignty/privacy.</td></tr>\n<tr><td><b>Embedding Models</b></td><td>BGE-large-en, BGE-multilingual, GTE-large, text-embedding-ada-002, custom embedding endpoints.</td><td>Vector dimension (384, 768, 1024, 1536), maximum input sequence length, and native multilingual support.</td></tr>\n<tr><td><b>Chain Orchestration</b></td><td>LangChain, LlamaIndex, MLflow PyFunc / Databricks-native ResponsesAgent.</td><td>Complexity of the conversational flow, tool support (Tool Calling), modularity, and ease of packaging in MLflow.</td></tr>\n<tr><td><b>Vector Store</b></td><td>Mosaic AI Vector Search (Delta Sync Index vs Direct Vector Access).</td><td>Native integration with Unity Catalog, data governance, row-level security, and automatic synchronization via Change Data Feed.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-2-1",
        "d": 2,
        "title": "2.1 · Chunking and Tokenization: Strategies, Overlap, and Context Windows",
        "html": "<table class=\"keytable\">\n<tr><th>Chunking Strategy</th><th>Mechanism</th><th>Ideal Use Cases</th><th>Risk / Drawback</th></tr>\n<tr><td><b>Fixed-size Chunking</b></td><td>Cuts the text every N characters or tokens without analyzing linguistic structure.</td><td>Quick prototyping and plain texts with no defined hierarchies or paragraphs.</td><td>Cuts words or sentences in half; loses semantic context at the cut boundaries.</td></tr>\n<tr><td><b>Recursive Character Chunking</b></td><td>Tries to split by hierarchical delimiters (`\n\n`, `\n`, ` `, `\"\"`) until reaching the target size.</td><td>Prose documents, user manuals, long articles, and general technical documentation.</td><td>Can produce irregularly sized fragments if paragraphs are extremely long.</td></tr>\n<tr><td><b>Document-specific (Markdown / HTML)</b></td><td>Splits while respecting H1, H2, H3 headings, HTML tags, or delimited code blocks.</td><td>README files, Markdown specifications, API documentation, and structured web pages.</td><td>Requires specific parsers and consistent document schemas.</td></tr>\n<tr><td><b>Semantic Chunking</b></td><td>Computes the distance between embeddings of consecutive sentences and cuts when similarity drops sharply.</td><td>Texts with subtle topic shifts where paragraph breaks do not reflect semantic changes.</td><td>High computational cost during the preparation phase because every preceding sentence must be vectorized.</td></tr>\n<tr><td><b>Chunk Overlap</b></td><td>Shares 10% to 20% of the boundary text between two consecutive adjacent chunks.</td><td>Essential in almost all chunking strategies to avoid fragmenting key facts.</td><td>Slightly increases the total volume of tokens indexed and stored in Vector Search.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-2-2",
        "d": 2,
        "title": "2.2 · Advanced RAG Techniques: Re-ranking, HyDE, RRF, and Multi-turn Chains",
        "html": "<table class=\"keytable\">\n<tr><th>Advanced Technique</th><th>How It Works</th><th>Problem It Solves</th></tr>\n<tr><td><b>Cross-Encoder Re-ranking</b></td><td>A model (e.g. BGE-reranker) processes the query and the chunk together, evaluating full cross-attention over the top-N candidates.</td><td>Eliminates false positives from the initial bi-encoder by retrieving the best K chunks with far higher precision.</td></tr>\n<tr><td><b>HyDE (Hypothetical Document Embeddings)</b></td><td>An LLM generates an ideal hypothetical document from the user's query; Vector Search is then queried using that document's embedding.</td><td>Lexical and semantic gap when the query is short or abstract and does not share vocabulary with the indexed texts.</td></tr>\n<tr><td><b>Reciprocal Rank Fusion (RRF)</b></td><td>Combines and normalizes the ranked positions from multiple retrievers (e.g. dense + sparse) with the formula `RRF_Score = sum(1 / (60 + rank))`.</td><td>Mismatch between vector similarity scales and BM25 scores when merging hybrid search results.</td></tr>\n<tr><td><b>Context Reordering (Lost in the Middle)</b></td><td>Reorders the retrieved chunks, placing the most relevant ones at the beginning and end of the prompt context.</td><td>Mitigates the positional bias of LLMs, which tend to ignore information located in the middle of the context window.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-3-1",
        "d": 3,
        "title": "3.1 · Mosaic AI Vector Search: Delta Sync Index vs Direct Vector Access",
        "html": "<table class=\"keytable\">\n<tr><th>Index Type</th><th>Data Source</th><th>Embedding Computation</th><th>Maintenance & Use Cases</th></tr>\n<tr><td><b>Delta Sync: Managed Embeddings</b></td><td>Delta table registered in Unity Catalog.</td><td>Databricks manages automatic vectorization using a Model Serving endpoint.</td><td>Ideal for serverless flows without an external inference pipeline; automatic synchronization via CDF.</td></tr>\n<tr><td><b>Delta Sync: Self-managed Embeddings</b></td><td>Delta table registered in Unity Catalog with an `ARRAY<FLOAT>` column.</td><td>The user precomputes the embeddings (e.g. in a Spark or DLT job) and writes them to Delta.</td><td>Full control over the embedding model, custom pipelines, or embeddings precomputed in batch.</td></tr>\n<tr><td><b>Direct Vector Access Index</b></td><td>No underlying Delta table required.</td><td>The user sends vectors and metadata directly through REST API calls (`upsert_data`).</td><td>External applications that need to insert or update vectors in real time without going through Delta Lake.</td></tr>\n<tr><td><b>Sync Mode: Continuous vs Triggered</b></td><td>Applies to Delta Sync indexes.</td><td><b>Continuous</b> maintains continuous streaming (low latency); <b>Triggered</b> runs in scheduled micro-batches.</td><td>Continuous minimizes indexing delay but has a higher cost; Triggered optimizes costs for batch workloads.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-3-2",
        "d": 3,
        "title": "3.2 · Hybrid Search (Dense + BM25), Metadata Filters, and Change Data Feed",
        "html": "<table class=\"keytable\">\n<tr><th>Technical Capability</th><th>Implementation Detail</th><th>Exam Key</th></tr>\n<tr><td><b>Hybrid Search</b></td><td>Combines dense vector similarity (deep semantics) with BM25 sparse text search (exact keywords).</td><td>Essential when queries contain error codes, part numbers, SKUs, or proper names alongside natural language.</td></tr>\n<tr><td><b>Metadata Filtering (`filters_json`)</b></td><td>Vector pre-filtering by evaluating SQL conditions on indexed columns (`country = 'ES'`, `category IN (...)`).</td><td>Pre-filtering reduces the in-memory search space; non-indexed columns force slow post-filtering in Delta.</td></tr>\n<tr><td><b>Change Data Feed (CDF)</b></td><td>`delta.enableChangeDataFeed = true` on the source Delta table.</td><td>Mandatory requirement for Delta Sync Index; allows INSERT, UPDATE, and DELETE to be captured incrementally.</td></tr>\n<tr><td><b>Primary Key Requirement</b></td><td>The source Delta table must have a defined, non-null `PRIMARY KEY`.</td><td>Mandatory so that Vector Search can uniquely identify each vector and apply updates and deletes.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-4-1",
        "d": 4,
        "title": "4.1 · Mosaic AI Model Serving: Provisioned Throughput, Serverless, and External Models",
        "html": "<table class=\"keytable\">\n<tr><th>Serving Mode</th><th>Billing Mechanism</th><th>Performance Guarantee</th><th>When to Use It</th></tr>\n<tr><td><b>Pay-per-token (Foundation Models)</b></td><td>Exact payment for input tokens and generated output tokens.</td><td>Shared capacity; subject to rate limits under high concurrency.</td><td>Exploratory workloads, development, non-production environments, or highly variable, sporadic traffic.</td></tr>\n<tr><td><b>Provisioned Throughput</b></td><td>Fixed hourly rate per reserved Model Unit (MU).</td><td>Guaranteed dedicated concurrency; deterministic latency with no blocking from external rate limits.</td><td>Real-time production applications with continuous traffic, strict SLAs, and a high volume of requests.</td></tr>\n<tr><td><b>External Models (AI Gateway)</b></td><td>Billed by the external provider (OpenAI, Anthropic) or unified.</td><td>Governed by the external provider; Databricks adds caching, guardrails, fallback, and unified auditing.</td><td>Companies that combine proprietary OpenAI/Anthropic models with open source models under a single API.</td></tr>\n<tr><td><b>Custom Models (MLflow PyFunc)</b></td><td>Scalable serverless compute instances (CPU/GPU) based on concurrency.</td><td>Automatic scaling down to zero (`scale_to_zero`); latency subject to cold starts if set to 0.</td><td>Deploying packaged RAG chains, Scikit-Learn classifiers, or your own fine-tuned models.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-4-2",
        "d": 4,
        "title": "4.2 · AI Gateway: Guardrails, Rate Limiting, PII Redaction, and Fallback Routing",
        "html": "<table class=\"keytable\">\n<tr><th>AI Gateway Feature</th><th>Main Function</th><th>Impact on Architecture and Security</th></tr>\n<tr><td><b>Security Guardrails</b></td><td>Detection and redaction of personal data (PII) and toxicity and jailbreak filters on prompts and responses.</td><td>Prevents confidential information from reaching external providers and blocks prompt injection attacks.</td></tr>\n<tr><td><b>Rate Limiting</b></td><td>Sets maximum quotas of requests per minute (RPM) and tokens per minute (TPM) per user or team.</td><td>Prevents uncontrolled consumption, protects against DoS attacks, and controls inference operating costs.</td></tr>\n<tr><td><b>Fallback Routing</b></td><td>Automatically routes to a secondary model if the primary returns error codes 429, 500, or 503.</td><td>Maximizes system resilience and availability during external provider outages.</td></tr>\n<tr><td><b>Auditing and Cost Attribution</b></td><td>Logs each call with its user identifier and tokens consumed.</td><td>Facilitates internal cost allocation (chargeback) among corporate departments.</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-5-1",
        "d": 5,
        "title": "5.1 · MLflow GenAI Evaluation: LLM-as-a-Judge, Faithfulness, Relevance, and Tracing",
        "html": "<table class=\"keytable\">\n<tr><th>Metric / Tool</th><th>What It Measures / Purpose</th><th>Calculation / Rubric in `mlflow.evaluate()`</th></tr>\n<tr><td><b>Faithfulness (Groundedness)</b></td><td>Detects hallucinations by evaluating whether the claims in the response come from the retrieved context.</td><td>LLM-as-a-judge analyzes each claim in the response against the supplied context chunks.</td></tr>\n<tr><td><b>Answer Relevance</b></td><td>Evaluates whether the generated response directly answers the user's query.</td><td>LLM-as-a-judge rates the relevance and conciseness of the response with respect to the initial prompt.</td></tr>\n<tr><td><b>Context Precision & Recall</b></td><td><b>Precision:</b> useful chunks ranked at the top. <b>Recall:</b> all the required information was retrieved.</td><td>Evaluates retriever quality; Context Recall usually requires a reference answer (ground truth).</td></tr>\n<tr><td><b>MLflow Tracing (`mlflow.trace`)</b></td><td>Runtime observability: span tree with latencies, tokens, and intermediate calls.</td><td>OpenTelemetry instrumentation to audit each step (retrieval, prompt formatting, LLM call).</td></tr>\n</table>"
      },
      {
        "id": "dbg-t-5-2",
        "d": 5,
        "title": "5.2 · Governance with Unity Catalog: Inference Tables, Review App, and End-to-End Lineage",
        "html": "<table class=\"keytable\">\n<tr><th>Governance Component</th><th>Role in the GenAI Lifecycle</th><th>Operational and Compliance Benefit</th></tr>\n<tr><td><b>Inference Tables</b></td><td>Asynchronous capture of incoming requests, generated responses, latencies, and metadata in Delta tables.</td><td>Enables continuous monitoring with Lakehouse Monitoring, compliance auditing, and data drift detection.</td></tr>\n<tr><td><b>Review App (Agent Evaluation)</b></td><td>Web interface for business experts to test agents and provide human feedback (thumbs up/down).</td><td>Generates reference evaluation datasets (golden datasets) curated directly by humans.</td></tr>\n<tr><td><b>Unity Catalog End-to-End Lineage</b></td><td>Visual graph connecting source Delta tables, vector indexes, registered models, and serving endpoints.</td><td>Immediate regulatory auditing for right-to-be-forgotten requests (GDPR) or changes in data sources.</td></tr>\n<tr><td><b>Granular Access Control</b></td><td>`USE CATALOG`, `USE SCHEMA`, `SELECT` permissions and row/column filters on tables and vector indexes.</td><td>Ensures users can only retrieve information they are formally authorized to access in Unity Catalog.</td></tr>\n</table>"
      }
    ],
    "questions": [
      {
        "id": "dbg-01",
        "d": 1,
        "t": "RAG vs Fine-Tuning",
        "q": "A multinational insurance company needs to implement a conversational assistant for its adjusters that queries policy terms and internal regulations that are updated every two weeks. The answers must quote the source clause verbatim for legal audit purposes. Which architectural approach is the most suitable and why?",
        "o": [
          "Implement RAG with `Mosaic AI Vector Search`, allowing changes in Delta Lake to be synchronized without retraining and ensuring citations and legal traceability.",
          "Fine-tune an open source model with LoRA on Databricks to memorize the policy texts within the neural weights.",
          "Run Continued Pre-training of a Llama-3 model on GPU clusters with millions of policies so that it acquires static regulatory knowledge.",
          "Apply basic Prompt Engineering with Few-Shot, embedding the entire 60,000-page manual in the system prompt of every API call."
        ],
        "a": 0,
        "e": "RAG is the ideal architecture when the knowledge base changes frequently (every two weeks) and traceability and exact citations to the original sources are required. Fine-Tuning and Pre-training freeze the information in the neural weights (knowledge cutoff) and are prone to hallucinations without offering direct auditable citations."
      },
      {
        "id": "dbg-02",
        "d": 1,
        "t": "Model Selection",
        "q": "An e-commerce platform needs to process 2 million daily purchase-intent classification queries with a strict p95 latency SLA < 60 ms and a controlled budget. The task consists only of categorizing the text into one of 12 predefined classes. Which model strategy offers the best balance of cost, latency, and performance?",
        "o": [
          "Deploy a 70B-parameter foundation model on Foundation Model APIs with pay-per-token billing to take advantage of its general reasoning capability.",
          "Train and deploy a small classifier model (SLM / encoder such as DeBERTa or RoBERTa) optimized through fine-tuning on `Mosaic AI Model Serving`.",
          "Build a multi-stage RAG flow with Vector Search that retrieves examples of previous classifications to feed a giant model on every inference.",
          "Configure a multi-step agent with LangChain and three recursive calls to external models through `AI Gateway` to verify logical consistency."
        ],
        "a": 1,
        "e": "For pure classification tasks over a closed set of classes with very high volume (2M requests/day) and ultra-low latency (<60 ms), a small classifier model (SLM/encoder) fine-tuned and served on Model Serving is vastly faster, cheaper, and more deterministic than invoking massive generative LLMs or RAG architectures."
      },
      {
        "id": "dbg-03",
        "d": 1,
        "t": "Embedding Models",
        "q": "When designing a RAG pipeline over technical and contractual documentation written interchangeably in Spanish, Portuguese, and English, an architect must select the embedding model for the `Mosaic AI Vector Search` index. Which set of technical criteria should be prioritized?",
        "o": [
          "Select only the model with the highest possible vector dimension (e.g., 4096), assuming that higher dimensionality compensates for the lack of multilingual data.",
          "Use the last hidden layer of a giant autoregressive generative model such as DBRX, extracting raw tensors during every interactive search query.",
          "Evaluate multilingual support, the token window (e.g., 512 or 8192), and the trade-off among vector dimension, latency, and accuracy.",
          "Choose a model trained only on English and place a real-time machine translation service before every vector embedding computation."
        ],
        "a": 2,
        "e": "Embedding model selection must weigh native multilingual support (to align semantic representations in Spanish, Portuguese, and English in the same vector space), the maximum token length supported per chunk, and the vector dimensionality, which directly impacts memory consumption, search latency, and accuracy."
      },
      {
        "id": "dbg-04",
        "d": 1,
        "t": "RAG vs Extended Context",
        "q": "A team debates between using an extended context window (e.g., 1M tokens), sending the entire technical library in every prompt, versus implementing a RAG architecture with `Mosaic AI Vector Search`. In which scenario is Vector Search decisively superior to Context Augmented Generation (CAG)?",
        "o": [
          "When the entire corpus does not exceed 10,000 tokens in total and is queried only once a week by a single user in a local development environment.",
          "When the task requires comparing the full narrative style of two 70,000-word literary novels in a single global structural analysis pass.",
          "When a model is required with no connection to databases or corporate networks, operating exclusively in the volatile memory of a workstation.",
          "When the document volume reaches gigabytes or terabytes, concurrent query traffic is high, and the goal is to optimize latency and cost per token."
        ],
        "a": 3,
        "e": "When the document volume is massive (GB or TB) and traffic is continuous, sending hundreds of thousands of tokens in every request is economically unviable and produces latencies of seconds or minutes. Vector Search selectively retrieves only the relevant chunks (a few thousand tokens), minimizing cost and processing time."
      },
      {
        "id": "dbg-05",
        "d": 1,
        "t": "Security and Guardrails",
        "q": "A bank will deploy an internal RAG assistant with access to confidential financial statements. During threat analysis, risks of indirect prompt injection and data leaks to unauthorized employees are identified. Which TWO architectural measures should be implemented in Databricks? (Choose 2 answers)",
        "o": [
          "Configure guardrails in `AI Gateway` to detect jailbreak patterns, evaluate toxicity, and redact personally identifiable information (PII).",
          "Apply row-level and column-level access controls in `Unity Catalog` on the source Delta tables and the `Mosaic AI Vector Search` indexes.",
          "Completely disable the audit log in the `Inference Tables` so that auditors do not examine the attackers' malicious texts.",
          "Raise the model's sampling temperature to 1.0 in `Mosaic AI Model Serving` so that responses to attacks are stochastic and inconsistent."
        ],
        "a": [
          0,
          1
        ],
        "e": "The combination of guardrails in `AI Gateway` (to intercept prompt injection attacks and malicious language, and to redact PII before and after inference) together with the granular governance of `Unity Catalog` (row/column filters and `SELECT` permissions on Delta tables and vector indexes) establishes a robust defense in depth for enterprise GenAI applications."
      },
      {
        "id": "dbg-06",
        "d": 1,
        "t": "Model Serving Costs",
        "q": "An engineering team projects constant, predictable traffic of 160 requests per second, 24 hours a day, for a Llama-3-70B model in production. When evaluating the `Mosaic AI Model Serving` modes, why is `Provisioned Throughput` the most suitable option compared to `Pay-per-token`?",
        "o": [
          "Because it reserves dedicated compute units (Model Units), guaranteeing concurrency, deterministic latency, and lower cost under high traffic.",
          "Because `Pay-per-token` mode does not support models with more than 7 billion parameters and only works with small classification models on Spark.",
          "Because `Provisioned Throughput` mode exempts the team from the governance policies, granular authentication, and strict lineage of `Unity Catalog`.",
          "Because `Provisioned Throughput` continuously retrains the model's neural weights with each batch of incoming requests at no additional infrastructure cost."
        ],
        "a": 0,
        "e": "`Provisioned Throughput` provisions dedicated processing capacity (measured in Model Units), which prevents saturation errors (HTTP 429) caused by shared concurrency, offers stable and predictable latency, and is far more cost-effective than `Pay-per-token` when the request volume is sustained and high."
      },
      {
        "id": "dbg-07",
        "d": 1,
        "t": "Data Residency and Compliance",
        "q": "A university hospital must process highly sensitive clinical records while complying with strict data sovereignty regulations that prohibit clinical texts from leaving the company's managed cloud perimeter or being sent to third-party APIs. Which architecture in Databricks meets this requirement?",
        "o": [
          "Configure `AI Gateway` to redirect requests to the public multitenant API of an external SaaS provider in another, unregulated geographic region.",
          "Deploy an open foundation model (e.g., Llama-3 or Mistral) on `Mosaic AI Model Serving` running inside the customer's data plane with no internet egress.",
          "Transmit the clinical records encrypted in Base64 in the prompt body to a public web service without formal medical confidentiality agreements.",
          "Store the records in a public storage bucket without Unity Catalog and allow open vector queries from any public IP on the internet."
        ],
        "a": 1,
        "e": "Deploying open source models on `Mosaic AI Model Serving` ensures that the weights and inference run inside the managed Databricks environment (corporate data plane / control plane), meeting sovereignty and privacy policies without sending patient data to external SaaS providers."
      },
      {
        "id": "dbg-08",
        "d": 2,
        "t": "Chunking Strategies",
        "q": "A data engineer processes machinery technical specifications structured in Markdown with hierarchical sections (#, ##, ###) and detailed tables. When fixed-size chunking is applied, the tables and subtitles are split in half, degrading the quality of RAG answers. Which chunking technique solves this problem?",
        "o": [
          "Use a `CharacterTextSplitter` with a rigid limit of 256 characters and zero overlap to force strictly uniform cuts on any type of technical text.",
          "Convert the entire document into a single continuous line of plain text, removing line breaks and formatting before generating a single vector for the whole file.",
          "Apply a `RecursiveCharacterTextSplitter` configured with hierarchical Markdown separators (`\\n## `, `\\n### `, `\\n\\n`, `\\n`, ` `).",
          "Generate a single massive chunk of 120,000 words per technical manual and skip any segmentation or structural partitioning of the content entirely."
        ],
        "a": 2,
        "e": "`RecursiveCharacterTextSplitter` (or MarkdownHeaderTextSplitter) respects the document hierarchy by trying to split first on higher-level delimiters (Markdown section headings, paragraphs) before splitting by lines or words. This keeps logical sections, titles, and tables intact within the same contextual block."
      },
      {
        "id": "dbg-09",
        "d": 2,
        "t": "Chunk Overlap",
        "q": "In a RAG system over commercial contracts, it is observed that when a relevant indemnity clause falls exactly on the cut boundary between two chunks, the LLM produces incomplete or hallucinated answers. When inspecting the text splitter configuration, `chunk_size = 512` and `chunk_overlap = 0` are found. What is the recommended fix?",
        "o": [
          "Reduce `chunk_size` to 32 tokens while keeping `chunk_overlap = 0` to generate atomic fragments that isolate each keyword separately.",
          "Delete the even-numbered chunks from the database, keeping only the odd-numbered chunks to avoid read redundancies in the index.",
          "Increase the chunk size to 80,000 tokens with no overlap, forcing the embedding model to ignore 90% of the text through truncation.",
          "Configure a `chunk_overlap` of between 10% and 20% of the chunk size (e.g., 50 to 100 tokens) to ensure continuity at the boundaries."
        ],
        "a": 3,
        "e": "Configuring an overlap of between 10% and 20% of the chunk size ensures that sentences or clauses located at the dividing edges do not lose their contextual meaning, since they are captured in full in at least one of the two neighboring chunks."
      },
      {
        "id": "dbg-10",
        "d": 2,
        "t": "Cross-Encoder Re-ranking",
        "q": "An enterprise RAG search engine uses a bi-encoder to retrieve the 50 most similar chunks in `Mosaic AI Vector Search`. However, irrelevant chunks that contain matching words but opposite meaning frequently displace the correct answers. Which two-stage retrieval pattern solves this deficiency?",
        "o": [
          "Add a second re-ranking stage with a cross-encoder (e.g., `BGE-reranker`) over the top-50 to reorder and select the 5 best chunks.",
          "Replace the Vector Search index with a standard SQL relational query using the pattern-matching operator `WHERE columna_texto LIKE '%query%'`.",
          "Run a second bi-encoder identical to the first with the same vector weights and arithmetically average all the previously computed Euclidean distances.",
          "Reverse the positional order of the 50 retrieved chunks so that the chunks with the lowest bi-encoder similarity appear at the top of the delivered context prompt."
        ],
        "a": 0,
        "e": "The two-stage pattern (Two-Stage Retrieval) combines the speed and scalability of a bi-encoder (to filter millions of vectors and keep the top-50 candidates) with the high semantic precision of a cross-encoder (which evaluates deep cross-attention between the query and the chunk to reorder and select the final top-5 with minimal added latency)."
      },
      {
        "id": "dbg-11",
        "d": 2,
        "t": "HyDE (Hypothetical Document Embeddings)",
        "q": "Employees at a company ask very short, abstract queries such as 'vacation for marriage?', while the internal labor regulations describe the benefits using legal terms such as 'extraordinary paid leave for nuptials'. Which retrieval technique solves this lexical mismatch?",
        "o": [
          "Concatenate the user's query directly into an unsanitized SQL statement to search for literal character matches in Delta Lake.",
          "`HyDE` (Hypothetical Document Embeddings), first generating a hypothetical document with an LLM and searching for vectors using its embedding.",
          "Remove all vowels from the user's query to compress the text before passing it to the Databricks embeddings endpoint.",
          "Apply Zero-Shot classification with a deterministic classifier and discard the employee's original query text entirely."
        ],
        "a": 1,
        "e": "`HyDE` uses an LLM to generate a hypothetical answer document from the user's question. Even if the hypothetical document contains unverified factual data, its vocabulary and semantic structure are much closer to the real documents indexed in Vector Search than the brief initial question, achieving much more accurate retrieval."
      },
      {
        "id": "dbg-12",
        "d": 2,
        "t": "Logging in MLflow",
        "q": "An AI developer builds a conversational RAG chain in Databricks combining LangChain with `Mosaic AI Vector Search`. To properly log and deploy the chain on `Mosaic AI Model Serving`, which TWO practices are mandatory according to the MLflow standard? (Choose 2 answers)",
        "o": [
          "Log the model with `mlflow.langchain.log_model()`, specifying the dependency environment (`pip_requirements` or `conda_env`) and artifacts.",
          "Explicitly declare a model signature (`model signature`) in MLflow that defines the schema of the expected input and output types.",
          "Save the model by exporting Python `.pkl` files to a temporary `/tmp` directory on the driver node of the interactive cluster.",
          "Hardcode the developer's personal access tokens (PAT) in the chain's source code to streamline authentication with Vector Search."
        ],
        "a": [
          0,
          1
        ],
        "e": "For a LangChain model to be reproducibly deployable on `Mosaic AI Model Serving`, it must be logged with `mlflow.langchain.log_model()` clearly indicating its library dependencies, and have a signature (`signature`) that formally defines the input structure (e.g., a `query` field or a list of `messages`) and output, enabling automatic schema validation."
      },
      {
        "id": "dbg-13",
        "d": 2,
        "t": "Tool Calling and Structured Outputs",
        "q": "A virtual support assistant must check shipment status or cancel orders by invoking existing corporate APIs. When using a foundation model in Databricks with Function Calling (Tool Calling) capability, how should the tools be defined and the model's requests processed?",
        "o": [
          "Embed Windows executable binaries inside the prompt body so that the Model Serving container runs them directly on its base operating system.",
          "Ask the LLM to generate arbitrary SQL code that drops tables and run it automatically with a superuser role in the central Unity Catalog catalog.",
          "Declare the tools through formal JSON schemas with a name, detailed description, and typed parameters, executing the function upon receiving `tool_calls` from the model.",
          "Disable the model's JSON parser and force it to respond only with free text without any kind of argument delimitation or computational schemas."
        ],
        "a": 2,
        "e": "Tool Calling requires providing the LLM with a catalog of tools described in JSON Schema format (specifying types, required fields, and clear descriptions). When the LLM decides it needs to invoke a tool, it generates a structured JSON payload with the function name and the arguments that the client application code executes in a controlled manner."
      },
      {
        "id": "dbg-14",
        "d": 2,
        "t": "Context Window and Lost in the Middle",
        "q": "When evaluating a RAG pipeline that injects 25 retrieved chunks into an LLM prompt, it becomes evident that the model answers accurately if the answer is in the first or last chunk, but systematically ignores the information located in chunks 11 to 15 (the 'Lost in the Middle' effect). Which context-ordering technique mitigates this phenomenon?",
        "o": [
          "Duplicate all the middle chunks 8 times consecutively to artificially saturate the model's memory during runtime inference.",
          "Arbitrarily truncate the context by removing 90% of the retrieved chunks, leaving only 2 sentences for the entire technical document analyzed.",
          "Retrain the transformer weights through fine-tuning to completely nullify the positional attention of the model's multi-head attention layers.",
          "Reorder the retrieved chunks, placing the most relevant ones at the extremes (at the beginning and end) and the least relevant ones in the middle."
        ],
        "a": 3,
        "e": "Transformers suffer from a U-shaped attention bias ('Lost in the Middle'): they pay more attention to information located at the beginning and end of the prompt context. Reordering the chunks so that the documents with the highest similarity scores sit at the head and at the close of the context block maximizes the probability that the LLM will consider them."
      },
      {
        "id": "dbg-15",
        "d": 3,
        "t": "Delta Sync vs Direct Access",
        "q": "A team of analysts manages a knowledge base of 8 million articles stored in a Unity Catalog Delta table subject to constant inserts, updates, and deletions by streaming ETL pipelines. They want the vector index to stay automatically synchronized without developing manual reconciliation code. Which type of `Mosaic AI Vector Search` index should be used?",
        "o": [
          "`Delta Sync Index`, which automatically tracks the operations of the source Delta table by leveraging Change Data Feed (CDF).",
          "`Direct Vector Access Index`, sending manual REST calls row by row from periodic scripts scheduled in Linux cron.",
          "An external Elasticsearch table hosted outside the Unity Catalog governance perimeter without permission synchronization.",
          "An exhaustive full-table scan in Apache Spark computing Euclidean distances in distributed memory on every individual query."
        ],
        "a": 0,
        "e": "`Delta Sync Index` is linked directly to a governed Delta table in Unity Catalog and consumes its Change Data Feed (CDF) to automatically process, continuously or by micro-batch, any record insert, update, or delete, keeping the vector index up to date without manual intervention."
      },
      {
        "id": "dbg-16",
        "d": 3,
        "t": "Managed vs Self-managed Embeddings",
        "q": "When configuring a `Delta Sync Index` in `Mosaic AI Vector Search`, the engineer must choose between the `Managed Embeddings` and `Self-managed Embeddings` modes. What is the fundamental operational difference between the two options?",
        "o": [
          "In `Self-managed Embeddings`, Databricks automatically takes over all the infrastructure and does not allow the user to use their own or custom embedding models.",
          "In `Managed Embeddings`, Databricks computes and updates the embeddings from a text column using an endpoint; in `Self-managed`, the user provides the vectors.",
          "`Managed Embeddings` only supports tables stored in flat CSV format, whereas `Self-managed` requires external relational databases mounted via JDBC.",
          "In `Self-managed Embeddings`, the index does not support vector similarity searches and only runs deterministic filters based on text regular expressions."
        ],
        "a": 1,
        "e": "In `Managed Embeddings`, Databricks takes care of calling a Model Serving endpoint (embedding model) to generate and maintain the vectors from the specified text column. In `Self-managed Embeddings`, the user is responsible for computing the vector column (type `ARRAY<FLOAT>`) before the data reaches the Vector Search index."
      },
      {
        "id": "dbg-17",
        "d": 3,
        "t": "Delta Sync Index Requirements",
        "q": "An engineer tries to create a `Delta Sync Index` on a Delta table in Unity Catalog, but the Databricks interface throws a validation error that prevents completing the operation. When reviewing the table configuration, what are the TWO mandatory structural requirements that the source table must meet?",
        "o": [
          "Have a total size under 10 megabytes and be mandatorily partitioned by day and hour in the corporate cloud file storage system.",
          "Be registered in the legacy Hive metastore and have all Delta Lake ACID transaction and versioning properties disabled.",
          "Have the property `delta.enableChangeDataFeed = true` enabled and have an explicit, non-null primary key (`PRIMARY KEY`).",
          "Contain only numeric columns, with no text fields or alphanumeric identifiers allowed within the table structure."
        ],
        "a": 2,
        "e": "For a `Delta Sync Index` to synchronize changes incrementally and consistently, the source Delta table in Unity Catalog must have Change Data Feed enabled (`delta.enableChangeDataFeed = true`) and have a defined `PRIMARY KEY`, which allows the engine to track exactly which vector to insert, update, or delete."
      },
      {
        "id": "dbg-18",
        "d": 3,
        "t": "Sync Mode: Continuous vs Triggered",
        "q": "An algorithmic trading financial application requires that corporate news entered into a Delta table be available for semantic search in Vector Search with a latency of under 60 seconds after insertion. When configuring the `Delta Sync Index`, which sync mode should be selected and what is its trade-off?",
        "o": [
          "`Triggered` mode, which shuts down the indexing infrastructure immediately but produces synchronization latencies of several days between table updates.",
          "`Manual Snapshot` mode, which requires an analyst to press a button in the Databricks graphical interface for each individual news item registered in the system.",
          "`Read-Only` mode, which freezes the Delta table and prevents new news from entering to ensure there are no discrepancies between the storage and the vector.",
          "`Continuous` mode, which runs a continuous streaming pipeline keeping the index up to date in near real time but at a higher compute cost."
        ],
        "a": 3,
        "e": "`Continuous` mode keeps an active streaming pipeline that immediately processes Change Data Feed events, achieving update latencies of seconds, ideal for real-time applications. Its trade-off is a continuous infrastructure cost compared to `Triggered` mode, which processes changes in periodic batches and shuts down the resources when finished."
      },
      {
        "id": "dbg-19",
        "d": 3,
        "t": "Hybrid Search",
        "q": "An aviation spare-parts catalog receives maintenance queries that combine natural language descriptions ('O-ring failure in hydraulic valve') with exact serial numbers and codes ('MS28775-224'). Users report that pure vector searches often confuse the part code with similar ones. Which `Mosaic AI Vector Search` capability resolves this limitation?",
        "o": [
          "`Hybrid Search`, combining dense vector search with sparse lexical search (BM25 / full-text) and merging the results in a weighted manner.",
          "Reduce the embedding dimensions to 4 values so that serial numbers are encoded as simple spatial coordinates.",
          "Remove the serial codes and part numbers from the document database to prevent them from interfering with semantic similarity.",
          "Use exact KNN search, performing a dot product calculation over all records on a single CPU thread."
        ],
        "a": 0,
        "e": "`Hybrid Search` combines the best of both worlds: dense vector search (which captures the deep semantics of phrases such as 'O-ring failure') together with BM25 / full-text sparse search (which matches alphanumeric codes such as 'MS28775-224' with absolute exactness), combining both scores to return the optimal ordering."
      },
      {
        "id": "dbg-20",
        "d": 3,
        "t": "Metadata Filters",
        "q": "An international law firm manages case law from multiple jurisdictions. When querying the `Mosaic AI Vector Search` index, the application must restrict the responses exclusively to documents where the `jurisdiction` column is 'Spain' and the `year` field is greater than or equal to 2021. How should this filter be implemented in the search call?",
        "o": [
          "Retrieve the 100,000 closest vectors on the web client and perform in-memory filtering using a Python list comprehension on the web server.",
          "Pass the structured condition through the `filters_json` parameter in the vector search API to perform optimized pre-filtering in the index.",
          "Create a separate Spark cluster for each individual query and run a full reindexing of the documents matching those time criteria.",
          "Append the text 'Spain 2021' 50 times at the end of the user's query, hoping the vector model interprets the temporal restriction automatically."
        ],
        "a": 1,
        "e": "`Mosaic AI Vector Search` supports the `filters_json` parameter in its query API (`similarity_search`), allowing boolean and relational filters to be applied to the indexed metadata columns. This pre-filtering reduces the in-memory vector search space before computing nearest neighbors, ensuring low latency and accuracy."
      },
      {
        "id": "dbg-21",
        "d": 3,
        "t": "Vector Search Endpoint Sizing",
        "q": "An architecture team is planning a `Mosaic AI Vector Search` endpoint for a knowledge base of 30 million vectors with an expected demand of 400 queries per second (QPS). Which sizing and scaling aspect must be considered to ensure service availability?",
        "o": [
          "Vector Search endpoints are exclusively static and limited to a strict maximum of 50,000 vectors per catalog in any Databricks workspace.",
          "Vector indexes run entirely inside users' web browsers via WebAssembly without consuming any Databricks cloud compute.",
          "Select the appropriate endpoint type considering capacity in millions of vectors and unit scaling to tolerate the required QPS peaks.",
          "The service can only scale if the Unity Catalog metastore is manually restarted during a weekly maintenance window scheduled by the administrator."
        ],
        "a": 2,
        "e": "`Mosaic AI Vector Search` endpoints come in specific types and capacities (oriented to in-memory vector volume and throughput performance). Properly sizing the endpoint and allowing capacity autoscaling is essential to support 30M vectors and peaks of 400 QPS with stable sub-second latencies."
      },
      {
        "id": "dbg-22",
        "d": 3,
        "t": "Governance and Permissions in Unity Catalog",
        "q": "An external web application authenticated through a Service Principal needs to run semantic search queries against a `Mosaic AI Vector Search` index registered in Unity Catalog. What are the minimum required privileges that must be granted to that Service Principal?",
        "o": [
          "Grant the `ACCOUNT ADMIN` role at the cloud account level so the application has full access to billing and global Databricks user management.",
          "Assign destructive `MODIFY` write permissions and `CREATE TABLE` privileges on all schemas of the company's corporate data catalog.",
          "Disable Unity Catalog in the workspace so that authentication is fully anonymous and requires no credentials or security validation.",
          "Grant `USE CATALOG` on the catalog, `USE SCHEMA` on the schema, and the `SELECT` privilege on the vector index and the associated Delta table."
        ],
        "a": 3,
        "e": "Under the Unity Catalog security model, reading or querying any object (including tables and vector indexes) requires the read permission hierarchy: `USE CATALOG` on the containing catalog, `USE SCHEMA` on the schema, and `SELECT` on the Vector Search index and its source Delta table."
      },
      {
        "id": "dbg-23",
        "d": 3,
        "t": "GDPR Compliance and Deletes in Delta Sync",
        "q": "In compliance with the right to be forgotten (GDPR), a customer requests the deletion of their records. An analyst runs `DELETE FROM clientes_docs WHERE cliente_id = 'C-8842'` on the Delta table connected to a `Delta Sync Index`. Which TWO elements ensure that the associated vectors disappear from the Vector Search results? (Choose 2 answers)",
        "o": [
          "That the Delta table has Change Data Feed (CDF) enabled, recording the delete event for propagation to the index.",
          "That the index synchronization pipeline processes the changes (continuously or on the next scheduled run in triggered mode).",
          "That the entire Vector Search endpoint is destroyed and reprovisioned every time a delete statement is run in Delta Lake.",
          "That a `VACUUM` command with zero-hour retention is immediately invoked on the table before the vector synchronizer reads the logs."
        ],
        "a": [
          0,
          1
        ],
        "e": "In a `Delta Sync Index`, deletes in the source Delta table are captured through the Change Data Feed (CDF), where the deleted row is marked as `_change_type = 'delete'`. When the index pipeline processes that change (continuous or triggered), it locates the vector through the primary key and removes it from the vector index without requiring the endpoint to be recreated."
      },
      {
        "id": "dbg-24",
        "d": 3,
        "t": "Vector Distance Metrics",
        "q": "When defining a search index in `Mosaic AI Vector Search` with embeddings that have been rigorously normalized to unit norm (L2 = 1.0), the team debates whether to configure `Cosine Similarity` or `Dot Product` as the similarity metric. What is the mathematical and performance relationship between the two metrics?",
        "o": [
          "With normalized vectors, the dot product is identical to cosine similarity and is more efficient because it skips the norm calculation.",
          "The dot product can only be computed if the vectors contain positive integer values between 0 and 255 and does not support single-precision floating-point numbers.",
          "Cosine similarity inverts the geometric polarity of Euclidean distances, producing only complex imaginary values in multidimensional spaces.",
          "The dot product requires the vectors to be orthogonal to each other before the search starts and produces divisions by zero on parallel vectors oriented toward the origin."
        ],
        "a": 0,
        "e": "The cosine similarity formula is `dot(u, v) / (||u|| * ||v||)`. When the vectors are pre-normalized to unit norm (`||u|| = ||v|| = 1`), the denominator is 1 and the expression simplifies exactly to `dot(u, v)`. Computing the pure dot product saves the real-time calculation of the Euclidean norms, speeding up searches."
      },
      {
        "id": "dbg-25",
        "d": 3,
        "t": "Delta Optimization for Vector Search",
        "q": "A Delta table with 200 million rows experiences slow reads and high I/O consumption when the `Delta Sync Index` engine queries the modified records. Which Delta Lake physical optimization command should be run on the table to compact small files and optimize reads by primary key?",
        "o": [
          "Run `DROP TABLE` followed by a recreation in plain-text TSV format with no indexes or metadata on a local disk attached to the cluster's driver node.",
          "Run `OPTIMIZE table_name ZORDER BY (primary_key_col)` (or enable Liquid Clustering) to physically organize the data into optimized Parquet files.",
          "Disable ACID transactions and convert the Delta table into an unstructured collection of JSON documents with no partitions or concurrency control.",
          "Split the table into 200 million individual files of 50 bytes to force massive parallelism in the distributed cloud storage system."
        ],
        "a": 1,
        "e": "The `OPTIMIZE` command compacts small Delta Lake files into larger Parquet files (~1 GB) and the `ZORDER BY` clause (or the modern `Liquid Clustering`) physically organizes the data by co-locating similar values of the selected columns. This drastically minimizes the amount of data read by the Vector Search synchronizer."
      },
      {
        "id": "dbg-26",
        "d": 3,
        "t": "Source Column in Managed Embeddings",
        "q": "When configuring a `Delta Sync Index` with `Managed Embeddings` in `Mosaic AI Vector Search`, what is the formal requirement that the column containing the source text to be vectorized (`source_text`) must meet in the Delta table?",
        "o": [
          "It must be of type `BINARY`, containing the Pickle serialization of Python objects generated on the cluster driver node during data ingestion.",
          "It must contain a two-dimensional array of 64-bit integers with hash values generated by a SHA-512 cryptographic algorithm with no plain-text information.",
          "It must be of type `STRING`, must not allow null values in the rows to be indexed, and must store the text content to be vectorized.",
          "It must be named `raw_unstructured_text_payload` or else the Unity Catalog schema will reject the creation of the vector index."
        ],
        "a": 2,
        "e": "In `Managed Embeddings` mode, the source column must be strictly of type `STRING` and contain readable, non-null text. Databricks takes the content of this column and sends it to the configured embeddings endpoint to automatically generate and persist the vector representation in the index."
      },
      {
        "id": "dbg-27",
        "d": 3,
        "t": "Metadata Evolution in Vector Search",
        "q": "A data team adds a new metadata column called `department_code` to the source Delta table of a `Delta Sync Index` in production. They want developers to be able to filter searches by this new attribute. How is this new column incorporated into the vector index?",
        "o": [
          "It is impossible to add columns to an existing index, and the only alternative is to delete the corporate Unity Catalog metastore and manually create it from scratch.",
          "The Delta table is permanently locked and no longer allows inserts of new rows until the underlying cloud storage is unmounted and mounted again.",
          "The entire table must be exported to an external NoSQL database to manually rebuild the inverted indexes on another provider's infrastructure.",
          "The vector index specification in Vector Search is updated to include the new column in the metadata synchronization list."
        ],
        "a": 3,
        "e": "`Mosaic AI Vector Search` indexes allow their definition to be updated to include new columns from the source Delta table as additional metadata synchronization columns. After the specification is updated, the synchronization pipeline propagates the new attributes without requiring the metastore to be recreated or the source table to be interrupted."
      },
      {
        "id": "dbg-28",
        "d": 3,
        "t": "Latency and Metadata Pre-filtering",
        "q": "During a performance audit of a `Mosaic AI Vector Search` index, the team observes that average latency jumps from 18 ms to 340 ms when applying a filter on the `cost_center` field. When investigating the index definition, it is discovered that `cost_center` was not included in the index's synchronized columns. What causes this degradation?",
        "o": [
          "Because it is not indexed in the endpoint's memory, the engine must perform post-filtering by reading data from the Delta table after the vector search.",
          "Because the Vector Search endpoint automatically shuts down and cold-restarts every time it detects an unknown column name in the submitted query.",
          "Because the HTTP/2 protocol does not support sending structured JSON filters when the search key names exceed 8 characters in length.",
          "Because queries on non-indexed attributes are forwarded by email to a system administrator for assisted manual resolution."
        ],
        "a": 0,
        "e": "When a filter is applied on columns that are included in the vector index, the engine performs ultra-fast pre-filtering directly in memory during the nearest-neighbor computation. If the column is not indexed in the endpoint, the system must retrieve many more candidates and post-filter by accessing the underlying Delta table, driving up query latency."
      },
      {
        "id": "dbg-29",
        "d": 3,
        "t": "Troubleshooting FAILED Sync",
        "q": "The pipeline of a `Delta Sync Index` with `Managed Embeddings` enters the `FAILED` state, interrupting the index update. In the Vector Search Manager diagnostics tab, the following error is displayed: `Model Serving endpoint 'bge-large-serving' unavailable or returned HTTP 500`. What is the root cause and the immediate corrective action?",
        "o": [
          "The source Delta table exceeded 1,000 records and Unity Catalog blocked synchronization for exceeding the free community quota assigned to the customer's subscription.",
          "The Model Serving endpoint that generates the embeddings for the index failed or was modified; that endpoint must be restored and the synchronization restarted.",
          "The user who created the index closed their web browser, interrupting the execution of the Databricks background batch process that updated the tables.",
          "The Databricks SQL dialect must be changed to Transact-SQL and all the tables recreated in a local relational database mounted on a traditional hard drive."
        ],
        "a": 1,
        "e": "In `Managed Embeddings`, the synchronization pipeline continuously invokes the Model Serving endpoint to compute the vectors for new or modified rows. If that embeddings endpoint stops, is deleted, or returns HTTP 500 errors due to overload, the Vector Search pipeline cannot compute the embeddings and moves to the `FAILED` state. The solution is to verify and stabilize the serving endpoint."
      },
      {
        "id": "dbg-30",
        "d": 4,
        "t": "Model Types in Model Serving",
        "q": "An enterprise software company needs to deploy three inference components to production: an open source LLM (Mistral-7B), a custom RAG chain built with LangChain and packaged with MLflow, and OpenAI's GPT-4o model. How does `Mosaic AI Model Serving` cover these three needs?",
        "o": [
          "Model Serving only supports traditional logistic regression models and has no capability to serve generative models or external APIs from third-party providers.",
          "It requires compiling all three models into native C++ binary code and deploying them on separate Kubernetes clusters self-managed by the infrastructure team.",
          "It provides Foundation Model APIs for Mistral-7B, Custom Models support (MLflow PyFunc) for the RAG chain, and External Models to govern GPT-4o.",
          "It forces all models to be converted to ONNX format and run exclusively within scheduled batch SQL queries on Databricks SQL Serverless."
        ],
        "a": 2,
        "e": "`Mosaic AI Model Serving` is a comprehensive platform that supports: 1) Foundation Model APIs (open models such as Llama-3, Mistral, DBRX ready to use serverless), 2) Custom Models (your own models or LangChain/LlamaIndex chains registered with MLflow PyFunc), and 3) External Models (external proprietary models such as OpenAI or Anthropic under a unified API governed with AI Gateway)."
      },
      {
        "id": "dbg-31",
        "d": 4,
        "t": "Provisioned Throughput vs Pay-per-token",
        "q": "A financial assistance banking application experiences unexpected peaks of 500 requests per second on a Foundation Model endpoint. When using `Pay-per-token` mode, customers receive frequent `HTTP 429 Too Many Requests` errors due to the platform's shared concurrency limits. Which architectural change guarantees dedicated capacity and eliminates these blocks?",
        "o": [
          "Reduce the application timeout to 5 milliseconds so that requests are dropped immediately before the serving web server starts processing them.",
          "Deploy the model in an interactive Databricks notebook and share the interactive cluster's public URL with all end users of the organization.",
          "Implement an infinite loop of synchronous retries on the client with no exponential backoff until the corporate network connections are completely saturated.",
          "Migrate the endpoint to `Provisioned Throughput`, assigning the Model Units needed to absorb peak traffic with guaranteed dedicated capacity."
        ],
        "a": 3,
        "e": "`Provisioned Throughput` mode reserves dedicated compute infrastructure (Model Units) for the customer's endpoint. Because the resources are guaranteed and not shared with other tenants of the workspace, HTTP 429 errors caused by shared rate limits are eliminated and predictable latency is ensured under high traffic volume."
      },
      {
        "id": "dbg-32",
        "d": 4,
        "t": "External Models Security",
        "q": "When configuring an `External Models` endpoint in `Mosaic AI Model Serving` to query Anthropic Claude or Azure OpenAI models, what is the Databricks security best practice for storing and supplying the private API keys required by the provider?",
        "o": [
          "Store the keys in Databricks Secrets (or Unity Catalog secrets) and reference the secret path in the endpoint configuration.",
          "Write the API key in plain text inside a commented cell in an interactive notebook visible to all developers in the organization.",
          "Create a `.txt` file with the key at the DBFS root (`/dbfs/api_keys.txt`), granting public read permissions to any user in the corporate workspace.",
          "Pass the API key as a text parameter in the header of the end user's prompt in every interactive HTTP call sent from the browser."
        ],
        "a": 0,
        "e": "To protect access credentials for external providers, Databricks requires storing the keys in Databricks Secrets or secrets integrated into Unity Catalog. When configuring the `External Models` endpoint, the secret is referenced with `{{secrets/scope/key}}`, allowing the inference service to access the key securely without exposing it in plain text or in the logs."
      },
      {
        "id": "dbg-33",
        "d": 4,
        "t": "AI Gateway Architecture",
        "q": "A multinational deploys `Mosaic AI Gateway` as the unified entry point for all the applications and microservices that consume language models in the organization. What is the main architectural value of this solution compared to direct access to provider APIs?",
        "o": [
          "It acts as a real-time compiler that automatically translates legacy Scala code to Python 3 during the model inference phase in the cloud.",
          "It centralizes governance, auditing, guardrail policies, cost control, rate limiting, and resilience without modifying the clients' code.",
          "It completely replaces the Unity Catalog data catalog and removes the permission restrictions on all the Delta tables registered in the Lakehouse.",
          "It disables the workspace's internet connections, forcing models to run on offline magnetic backup tapes."
        ],
        "a": 1,
        "e": "`Mosaic AI Gateway` decouples consuming applications from the underlying AI model providers, acting as a managed intelligent intermediary that uniformly applies query auditing, spend control, rate limiting, security filters (guardrails), and routing with failover (fallback), simplifying corporate governance."
      },
      {
        "id": "dbg-34",
        "d": 4,
        "t": "Guardrails in AI Gateway",
        "q": "A citizen services department deploys a conversational assistant. For regulatory reasons, the system must guarantee that no bank card number, national ID number, or sensitive medical data is sent to external models, and it must also reject messages with offensive content. Which `AI Gateway` feature automates this requirement?",
        "o": [
          "Enable gzip compression at the HTTP transport layer to reduce the JSON payload size by 40% without altering the transmitted text content.",
          "Configure manual iptables network firewall rules on the operating system of the driver node of an interactive development Spark cluster.",
          "Enable Guardrails in `AI Gateway`, configuring filters for PII detection and redaction and toxicity moderation policies.",
          "Ask users to sign a paper document promising not to type personal data into the web browser window when using the assistant."
        ],
        "a": 2,
        "e": "The `Guardrails` of `Mosaic AI Gateway` let you define automatic security policies that analyze requests and responses in real time. They can automatically detect and mask personally identifiable information (PII such as card numbers, national IDs, or phone numbers) and block messages that exceed toxicity thresholds, ensuring regulatory compliance without additional code."
      },
      {
        "id": "dbg-35",
        "d": 4,
        "t": "Rate Limiting Policies",
        "q": "To prevent a faulty application stuck in an infinite loop or a malicious user from exhausting the monthly spending quota on an endpoint served through `AI Gateway`, which TWO rate limit policies (`Rate Limits`) can be configured at the endpoint or token level? (Choose 2 answers)",
        "o": [
          "Requests Per Minute (RPM) limit to restrict the total number of API calls within a time window.",
          "Tokens Per Minute (TPM) limit to control the total volume of input and output processed by the model.",
          "Character-per-function limit in the Python scripts of the team's Git version control repository.",
          "Stochastic temperature limit, forcing that no model can use temperature values higher than 0.01."
        ],
        "a": [
          0,
          1
        ],
        "e": "`AI Gateway` lets you configure rate limit quotas based on: 1) Requests Per Minute (RPM), controlling the request frequency to prevent connection saturation, and 2) Tokens Per Minute (TPM), restricting the massive volume of tokens processed to keep the financial budget under strict control."
      },
      {
        "id": "dbg-36",
        "d": 4,
        "t": "Fallback Routing in AI Gateway",
        "q": "A medical emergency triage application uses an `External Models` endpoint that invokes a state-of-the-art external API as its primary model. If the external provider experiences a service degradation and starts responding with `HTTP 503` or `HTTP 429` errors, the application must switch immediately to a secondary model without manual intervention. Which `AI Gateway` mechanism implements this behavior?",
        "o": [
          "Replicate all the client application code on 10 different physical servers connected in a fiber-optic ring to balance HTTP requests.",
          "Disconnect the system's load balancer so that clients accumulate requests in an indefinite waiting queue on the application server.",
          "Send a pager alert to the overnight on-call team so they edit the client's environment variable on the production servers.",
          "`Fallback Routing`, configuring a prioritized backup route to which traffic is automatically redirected when the primary model fails."
        ],
        "a": 3,
        "e": "`Fallback Routing` in `AI Gateway` lets you configure an ordered list of alternative models. If the primary endpoint fails or returns overload or unavailability errors (e.g., HTTP 429, 500, or 503), Gateway transparently intercepts the error and forwards the request to the defined backup model, ensuring uninterrupted high availability for critical services."
      },
      {
        "id": "dbg-37",
        "d": 4,
        "t": "Streaming with Server-Sent Events (SSE)",
        "q": "In a conversational assistant web interface built on `Mosaic AI Model Serving`, users complain that the screen stays blank for 5 seconds and then the entire paragraph appears all at once. To drastically improve the perception of fluidity and the Time To First Token (TTFT), which inference parameter must be enabled on the endpoint and the client?",
        "o": [
          "Enable streaming generation through Server-Sent Events by sending the parameter `stream=True` in the request to the serving API to receive continuous tokens.",
          "Increase the batch size to 64 grouped requests so that the server accumulates multiple questions before generating any response text.",
          "Disable the endpoint's graphics processing units (GPUs) so that inference runs on a single low-power CPU thread.",
          "Package the model's response in a RAR compressed file protected with a cryptographic key before transferring it to the web client over HTTP."
        ],
        "a": 0,
        "e": "Setting `stream=True` allows the `Mosaic AI Model Serving` endpoint to transmit the generated tokens progressively over a persistent connection using Server-Sent Events (SSE). The client can render each word or token on screen as it is produced, reducing the perceived Time To First Token to just a few milliseconds."
      },
      {
        "id": "dbg-38",
        "d": 4,
        "t": "Deploying Custom Models with MLflow",
        "q": "When deploying a custom RAG chain built with `MLflow PyFunc` on `Mosaic AI Model Serving`, the endpoint fails during the initialization phase with the error `ModuleNotFoundError: No module named 'langchain_community'`. How should the engineer fix this problem to ensure a reproducible environment?",
        "o": [
          "Install the library on the developer's laptop and restart the local VS Code work session, hoping it syncs to the cloud.",
          "Explicitly declare `langchain_community` in the `pip_requirements` or `conda_env` parameter when calling `mlflow.pyfunc.log_model()`.",
          "SSH into the Databricks serving container and manually run `sudo apt-get install python3-langchain` on the host command line.",
          "Remove all references to external libraries and rewrite the entire chain in assembly code with no third-party package dependencies."
        ],
        "a": 1,
        "e": "When `Mosaic AI Model Serving` deploys a model packaged with MLflow, it provisions a clean container where it installs the dependencies declared in the model artifact. Specifying the exact dependencies in `pip_requirements` (or `conda_env`) during the `log_model()` call ensures that the inference container installs all the necessary libraries automatically and in isolation."
      },
      {
        "id": "dbg-39",
        "d": 4,
        "t": "Autoscaling and Scale to Zero",
        "q": "An innovation department has 12 fine-tuned experimental models for occasional R&D testing. Each model is queried an average of twice a week. To optimize the budget and avoid paying for idle GPU infrastructure 24 hours a day, which autoscaling configuration should be applied to the `Mosaic AI Model Serving` endpoints?",
        "o": [
          "Set the minimum concurrency to 4 permanent dedicated instances to ensure that a cold start never occurs under any operating circumstance.",
          "Delete and retrain all 12 models every night with an automated script to free up memory on the organization's interactive cluster.",
          "Configure `Scale to Zero`, setting the minimum compute size to 0 units to shut down resources during idle periods.",
          "Shut down the Databricks workspace's network connection outside working hours from Monday to Friday, interrupting all of the company's tasks."
        ],
        "a": 2,
        "e": "`Scale to Zero` allows `Mosaic AI Model Serving` endpoints to automatically deprovision their compute resources after a period of inactivity, reducing the running cost to exactly zero when there is no traffic. When a new request arrives, the service performs a cold start, provisioning the resources automatically."
      },
      {
        "id": "dbg-40",
        "d": 4,
        "t": "Traffic Splitting and Canary Deployments",
        "q": "A new version (v2) of a RAG chain has been developed with an optimized prompt and a more recent vector index. To evaluate its stability in production without putting the experience of all users at risk, the team wants to route 90% of the requests to the proven version v1 and 10% to the candidate version v2. How is this pattern implemented in `Mosaic AI Model Serving`?",
        "o": [
          "Publish two different URLs in a public Slack channel and kindly ask 10% of customers to manually choose the second option.",
          "Configure a Bash script that randomly restarts the web server every 10 requests to alternate versions on each controlled service crash.",
          "Deactivate the endpoint for one hour a day to force users to try the experimental version under pressure in their work environments.",
          "Configure `Traffic Splitting` on the serving endpoint, assigning a traffic weight of 90% to the v1 entity and 10% to the v2 version."
        ],
        "a": 3,
        "e": "`Mosaic AI Model Serving` supports deployments of multiple served entities within a single endpoint with weighted routing (`Traffic Splitting`). This enables Canary-style deployments or A/B tests by managing traffic percentages (e.g., 90/10) behind a single stable endpoint URL, monitoring the new version's behavior with minimal risk."
      },
      {
        "id": "dbg-41",
        "d": 5,
        "t": "MLflow GenAI Evaluation with LLM-as-a-Judge",
        "q": "An AI team must evaluate the performance of a conversational assistant on a set of 5,000 complex questions from real customers. The team does not have ideal human-written reference answers (ground truth) for most of the questions. Which methodological approach enabled in `mlflow.evaluate()` makes it possible to perform this rigorous evaluation at scale?",
        "o": [
          "Use `LLM-as-a-Judge`, employing a high-capacity evaluator model that applies formal quality rubrics to the generated outputs.",
          "Compare the generated responses by counting only the number of consonants and assigning a higher score to the longer texts in the analytical report.",
          "Assign a fixed 5-star rating to all responses, assuming modern language models never make factual errors.",
          "Evaluate the model by measuring the temperature in degrees Celsius of the data center processors during intensive inference of the questions."
        ],
        "a": 0,
        "e": "When no exhaustive ground truth is available, `mlflow.evaluate()` supports the `LLM-as-a-Judge` paradigm. In this scheme, a high-capacity model (such as GPT-4 or DBRX) evaluates the generated responses against structured rubrics for metrics such as `faithfulness`, `answer_relevance`, and `toxicity`, making it possible to validate thousands of cases with high correlation with human judgment."
      },
      {
        "id": "dbg-42",
        "d": 5,
        "t": "Faithfulness (Groundedness) Metric",
        "q": "When running an evaluation suite with `mlflow.evaluate()` on a RAG pipeline, the report shows a poor score on the `Faithfulness` (Groundedness) metric. What specific failure in the system's behavior does this metric reflect?",
        "o": [
          "It indicates that the user asked questions with spelling mistakes or in a language not recognized by the user portal's authentication system.",
          "It indicates that the response contains factual claims not supported by the retrieved context chunks (model hallucinations).",
          "It indicates that the network connection between the serving endpoint and the Unity Catalog metastore took more than 500 ms to complete successfully.",
          "It indicates that the size of the model binary file registered in MLflow exceeds the disk space allocated to the customer's corporate workspace."
        ],
        "a": 1,
        "e": "The `Faithfulness` metric measures the degree to which the claims in the generated response derive directly from the information contained in the retrieved context. A low faithfulness score is a direct indicator that the model is hallucinating information not grounded in the supplied documents."
      },
      {
        "id": "dbg-43",
        "d": 5,
        "t": "Answer Relevance Metric",
        "q": "During the evaluation of a conversational agent with `mlflow.evaluate()`, the following behavior is observed: for the question 'How do I reset my password?', the model responds with an impeccable three-page text explaining in detail the history of RSA encryption and the biography of Alan Turing. Which combination of metrics will reflect this problem?",
        "o": [
          "Very low `Faithfulness` and very high `Answer Relevance`, because the text invents Alan Turing's biography without consulting the supplied document context.",
          "Both metrics will yield a perfect value of 1.0 because the generated text is grammatically elegant and free of syntax errors in its wording.",
          "High `Faithfulness` (if the history was in the context), but very low `Answer Relevance` because it completely omits the answer to the specific question asked.",
          "Perfect `Context Recall` and zero `Faithfulness` because the user did not enter a valid session token in the HTTP header of the submitted web request."
        ],
        "a": 2,
        "e": "`Answer Relevance` evaluates whether the generated response addresses the intent of the user's question directly and pertinently. If the model provides perfectly truthful information grounded in the documents (high `Faithfulness`) that does not answer the user's question at all (how to change the password), `Answer Relevance` collapses."
      },
      {
        "id": "dbg-44",
        "d": 5,
        "t": "Context Precision vs Context Recall",
        "q": "An engineer evaluates only the retrieval component (retriever) of a RAG system using `mlflow.evaluate()`. What is the fundamental technical distinction between the `Context Precision` and `Context Recall` metrics?",
        "o": [
          "`Context Precision` measures the total number of words retrieved; `Context Recall` measures the time in milliseconds for the Vector Search endpoint to respond.",
          "`Context Precision` is computed only for computer vision models; `Context Recall` applies exclusively to high-frequency audio signals.",
          "Both metrics are mathematically identical and the name depends on whether the Databricks workspace is set to English or Spanish in the console.",
          "`Context Precision` evaluates whether the useful chunks are ranked at the top; `Context Recall` measures whether all the required information was retrieved."
        ],
        "a": 3,
        "e": "In retriever evaluation: `Context Precision` evaluates ranking quality, penalizing irrelevant chunks that appear in the top positions ahead of useful chunks. `Context Recall` evaluates completeness, measuring whether the total set of retrieved chunks contains all the facts needed (compared against a reference answer or ground truth) to answer the query."
      },
      {
        "id": "dbg-45",
        "d": 5,
        "t": "Mosaic AI Agent Review App",
        "q": "Within the framework of GenAI application governance in Databricks, the `Mosaic AI Agent Evaluation Review App` is deployed. Which TWO fundamental capabilities does this application provide for the validation and curation of the model's behavior by business experts? (Choose 2 answers)",
        "o": [
          "Provide an interactive graphical interface for human reviewers to test the agent, rate responses (thumbs up/down), and edit corrections.",
          "Systematically store the reviewers' feedback and corrections in Unity Catalog Delta tables to enrich reference datasets.",
          "Hot-modify the binary weights of the model's attention layers in the GPU memory of the inference nodes.",
          "Automatically disconnect from the corporate network the reviewers who give unfavorable ratings to the agent's responses."
        ],
        "a": [
          0,
          1
        ],
        "e": "The Mosaic AI Agent Evaluation `Review App` provides an intuitive web interface for human experts (doctors, adjusters, analysts) to interact with the RAG chain or agent, rate the quality of the responses, and provide textual corrections. All of this feedback is automatically recorded in managed Delta tables in Unity Catalog, making it easier to build golden datasets for continuous evaluation."
      },
      {
        "id": "dbg-46",
        "d": 5,
        "t": "MLflow Tracing for Observability",
        "q": "An engineering team investigates an intermittent latency degradation in a composite RAG chain that invokes a vector retriever and an external credit validation API. When instrumenting the application with `MLflow Tracing` (`mlflow.trace`), what visual and diagnostic information do they get in the MLflow UI?",
        "o": [
          "A hierarchical tree of spans that breaks down the latency, inputs, outputs, prompts, and token consumption of each step in the chain.",
          "The hexadecimal dump of the L1 cache records of the processors of the central relational database server.",
          "A list of the personal phone numbers and access keys of the users who queried the system during the last week of testing.",
          "A static diagram that hides response times and replaces execution traces with random numbers of no analytical use."
        ],
        "a": 0,
        "e": "`MLflow Tracing` (based on OpenTelemetry standards) captures a hierarchical trace of the model or agent execution. The MLflow interface displays a waterfall chart of spans where you can examine the exact time consumed by the Vector Search lookup, prompt formatting, intermediate tool calls, and the final LLM call with its breakdown of input and output tokens."
      },
      {
        "id": "dbg-47",
        "d": 5,
        "t": "Inference Tables in Model Serving",
        "q": "To satisfy AI regulatory audit requirements and drift monitoring in production, an architect enables `Inference Tables` on a `Mosaic AI Model Serving` endpoint. How does this mechanism work and where is the captured data persisted?",
        "o": [
          "It sends backup copies of the requests as compressed CSV files to an external email account through the traditional SMTP protocol.",
          "It asynchronously logs incoming requests, generated responses, latencies, and metadata to a managed Delta table in Unity Catalog.",
          "It overwrites the contents of the inference table every 60 seconds, deleting the previous history so as not to consume disk space in the cloud account.",
          "It blocks the endpoint's execution until an administrator manually reviews and approves each incoming request in a local command console."
        ],
        "a": 1,
        "e": "`Inference Tables` capture, completely transparently, asynchronously, and without penalizing endpoint latency, every request payload received, the response generated by the model, the status codes, latencies, and associated metadata. This information is persisted directly in a Delta table in Unity Catalog, enabling audits, monitoring with Lakehouse Monitoring, and retraining."
      },
      {
        "id": "dbg-48",
        "d": 5,
        "t": "End-to-End Lineage in Unity Catalog",
        "q": "During an external GDPR compliance audit, it is required to demonstrate exactly which training or indexing data was used to generate a controversial response produced by a conversational assistant. How does `Unity Catalog` make it possible to verify this traceability?",
        "o": [
          "By forcing data scientists to print out the Git command history on paper and present it to a notary public for official certification.",
          "Unity Catalog lineage only supports traditional relational tables and lacks support for language models or AI vector indexes.",
          "By connecting the lineage between source Delta tables, Vector Search indexes, models registered in MLflow, and the endpoint's Inference Tables.",
          "By irreversibly deleting all records in the workspace so that auditors do not find information discrepancies in the systems."
        ],
        "a": 2,
        "e": "`Unity Catalog` offers End-to-End Lineage. It makes it possible to visually and programmatically trace the full dependency chain: from the source Delta tables where the documents resided, through the `Delta Sync Index` synchronization pipeline, the model artifact registered in the model catalog, to the serving endpoint and its associated `Inference Tables`."
      },
      {
        "id": "dbg-49",
        "d": 5,
        "t": "Custom Metrics with make_genai_metric",
        "q": "A telecommunications company wants to evaluate whether its virtual assistant's responses comply with the corporate directive to 'maintain a professional, empathetic tone and avoid technical jargon incomprehensible to the end user'. How is this qualitative metric defined in `mlflow.evaluate()`?",
        "o": [
          "By writing a Bash script that counts how many times the word 'thanks' appears in the text output generated by the assistant's endpoint.",
          "By modifying the BIOS memory of the cloud servers to alter the probabilistic behavior of the random numbers generated at runtime.",
          "By configuring a firewall that blocks any HTTP response packet that contains more than 50 words in total in the delivered response.",
          "By using `mlflow.metrics.genai.make_genai_metric()`, specifying the name, evaluation criteria, scale, and examples for the judge LLM."
        ],
        "a": 3,
        "e": "`mlflow.metrics.genai.make_genai_metric()` lets you create custom metrics evaluated by a judge LLM. The developer defines the metric name, the rubric with the detailed evaluation criteria (e.g., empathy, professionalism, absence of excessive jargon), the scoring scale (e.g., 1 to 5), and few-shot calibration examples, making it possible to evaluate qualitative aspects consistently."
      },
      {
        "id": "dbg-50",
        "d": 5,
        "t": "Lakehouse Monitoring on Inference Tables",
        "q": "An AI operations team maintains a RAG assistant in production and wants to continuously monitor concept drift, variations in response length, and anomalies in error rates over the weeks without scheduling manual ETL pipelines. Which native Databricks solution integrates with `Inference Tables` for this purpose?",
        "o": [
          "An AWK script running in a continuous loop in the terminal of one of the operations team engineers' personal laptops.",
          "Completely disable inference tables to avoid consuming storage space in the corporate Unity Catalog catalog.",
          "Install a standalone Apache Tomcat server that receives screenshots from the mobile phones of the customers who use the application.",
          "`Databricks Lakehouse Monitoring`, configuring a quality monitor on the inference Delta table to generate metrics and alerts."
        ],
        "a": 3,
        "e": "`Databricks Lakehouse Monitoring` integrates directly with Model Serving `Inference Tables`. By attaching a monitor to the inference Delta table, Databricks automatically computes temporal aggregate statistics, drift metrics on inputs and outputs, variations in latencies and error rates, publishing dashboards and triggering alerts on anomalies without requiring manual ETL code."
      }
    ],
    "why": {
      "dbg-01": [
        null,
        "`Fine-Tuning` adjusts the model's style, tone, or syntax but does not guarantee factual accuracy with dynamic data, introduces hallucinations, and does not provide direct auditable verbatim citations.",
        "`Continued Pre-training` is extremely expensive computationally, requires weeks of computation on GPU clusters, and freezes the data in the weights, making it unviable for regulations that change biweekly.",
        "Simple `Prompt Engineering` is unviable because a 60,000-page manual far exceeds the context window of current models and would generate unacceptable per-token cost and latency."
      ],
      "dbg-02": [
        "Using a giant 70B LLM for simple classification over 12 classes produces latency substantially above 60 ms and a disproportionate financial cost at 2 million requests per day.",
        null,
        "Multi-stage RAG adds vector search latency (~20-40 ms) and generative inference (~200-500 ms), comfortably breaking the 60 ms SLA and making the solution more expensive.",
        "A multi-step agent with recursive calls adds multiple network round trips over the API, raising latency above several seconds per classification request."
      ],
      "dbg-03": [
        "A larger vector dimension does not imply better semantic performance if the model was not trained on multilingual data, and it needlessly increases memory consumption and index latency.",
        "Generative autoregressive LLMs are not trained to produce comparative dense similarity representations like dedicated encoders (e.g. BGE), and their inference is slow and costly.",
        null,
        "Runtime machine translation adds considerable extra latency, introduces possible lexical translation errors, and raises the solution's operating costs."
      ],
      "dbg-04": [
        "For a tiny corpus of 10,000 tokens with very sporadic queries, loading the full text directly into the prompt is simpler and does not justify the Vector Search infrastructure.",
        "Holistic stylistic analysis of two complete novels requires processing the entire text globally, a use case suited to long context windows and not to chunk-based RAG.",
        "The absence of storage and connectivity rules out cloud-based architectures and does not represent a favorable scenario for Vector Search in Databricks.",
        null
      ],
      "dbg-05": [
        null,
        null,
        "Disabling `Inference Tables` destroys the system's traceability and observability, preventing security audits and forensic incident monitoring.",
        "Raising the temperature to 1.0 does not protect against prompt injection and makes the model much more prone to hallucinations and operational inconsistencies."
      ],
      "dbg-06": [
        null,
        "`Pay-per-token` (Foundation Model APIs) does support large models such as Llama-3-70B and DBRX; its limitation under high traffic lies in per-token costs and shared rate limits.",
        "`Provisioned Throughput` is governed strictly under `Unity Catalog` like the rest of the Model Serving components; it does not bypass enterprise security.",
        "No serving mode retrains the model weights during inference; the service is strictly for evaluation and real-time response generation."
      ],
      "dbg-07": [
        "Sending data to a multitenant external SaaS provider in another region directly violates data residency requirements and strict health regulations.",
        null,
        "Base64 encoding is not an anonymization or security mechanism; the text can be decoded immediately and still travels to unauthorized external services.",
        "Publishing health data in open buckets without access control in Unity Catalog constitutes a serious security breach and a legal violation of regulations such as HIPAA or GDPR."
      ],
      "dbg-08": [
        "A rigid `CharacterTextSplitter` that ignores syntax worsens the problem by arbitrarily cutting tables and sentences at blind points every 256 characters.",
        "Removing line breaks and Markdown structure destroys the coherence of the tables and technical headings, hindering the model's semantic understanding.",
        null,
        "A chunk of 120,000 words exceeds the capacity of most embedding models (typically 512 or 8192 tokens) and destroys the granularity of semantic retrieval."
      ],
      "dbg-09": [
        "A size of 32 tokens is excessively tiny, destroys the syntax of contract clauses, and prevents the model from extracting coherent legal context.",
        "Deleting alternate chunks causes a catastrophic loss of 50% of the document information available in the system.",
        "Enlarging the chunk to 80,000 tokens exceeds the context limit of the vast majority of embedding models, causing forced truncation and data loss.",
        null
      ],
      "dbg-10": [
        null,
        "A `LIKE '%query%'` query performs a strict text scan without semantic understanding, missing synonyms and lacking the ability to rank by contextual relevance.",
        "Running an identical bi-encoder produces exactly the same scores and adds no new discriminative capability or cross-attention.",
        "Reversing the order places the least relevant chunks in the prime positions of the prompt, seriously degrading the quality of the LLM's response."
      ],
      "dbg-11": [
        "Concatenating into SQL without sanitizing exposes the system to SQL injection, and a literal search will fail because the exact words are not shared ('marriage' vs 'nuptials').",
        null,
        "Removing vowels corrupts the semantics of the language and destroys the embedding model's ability to map the meaning of the text.",
        "Discarding the original query and imposing a static label prevents searching for the specificity of the employee's question in the document base."
      ],
      "dbg-12": [
        null,
        null,
        "Exporting `.pkl` files to `/tmp` does not register the model in Unity Catalog or manage dependencies, making reproducible deployment on Model Serving impossible.",
        "Embedding access tokens in the source code violates basic security policies and exposes credentials; the endpoint's managed identity or Databricks Secrets should be used."
      ],
      "dbg-13": [
        "Sending executable binaries in the prompt is impossible in the LLM API and would represent an aberrant remote code execution vulnerability.",
        "Allowing uncontrolled generation and execution of destructive SQL by an LLM violates all security principles and would put the database at risk.",
        null,
        "Forcing unstructured free text prevents the system from deterministically interpreting when to invoke the tools and with which exact parameters."
      ],
      "dbg-14": [
        "Duplicating middle chunks wastes token budget, increases inference costs, and can induce hallucinations or redundancies in the response.",
        "Removing 90% of the chunks deprives the model of the information needed to answer complex queries that require multiple sources.",
        "Modifying positional attention weights is not a viable practice for Foundation Model APIs users and does not resolve the inherent bias of the Transformer architecture.",
        null
      ],
      "dbg-15": [
        null,
        "`Direct Vector Access Index` requires the client application to manage ingestion, deletion, and vector computation through explicit REST API calls, losing the automation with Delta Lake.",
        "Elasticsearch outside Unity Catalog loses the native integration with the catalog, the access controls, and the Databricks data lineage.",
        "A full distributed scan in Spark for every interactive query takes minutes or tens of seconds, making it totally unviable for real-time conversational applications."
      ],
      "dbg-16": [
        "It is in `Managed Embeddings` where Databricks manages the vectorization infrastructure; in `Self-managed` it is the user who controls and computes the embeddings.",
        null,
        "`Managed Embeddings` operates exclusively on Delta tables in Unity Catalog, not on flat CSV files lacking Change Data Feed.",
        "`Self-managed Embeddings` does perform vector similarity searches; the difference lies only in who computes the vector."
      ],
      "dbg-17": [
        "Delta Sync Index supports millions of records and hundreds of gigabytes; there is no size restriction below 10 MB or an obligation to partition by hour.",
        "Delta Sync Index requires Unity Catalog; it does not work with the legacy Hive metastore or support tables with ACID disabled.",
        null,
        "The table must contain text fields in order to vectorize them (in Managed) or vector columns along with metadata; it cannot be numeric only."
      ],
      "dbg-18": [
        "`Triggered` mode is typically scheduled at intervals (e.g., hourly or daily) to minimize costs in batch workloads, and does not meet the 60-second SLA.",
        "A manual process is unviable for automated algorithmic flows and does not exist as a formal production mode for SLAs of seconds.",
        "`Read-Only` mode would block the insertion of new news, defeating the functional purpose of the financial system.",
        null
      ],
      "dbg-19": [
        null,
        "Reducing the embeddings to 4 dimensions destroys the representational capacity of the vector space and produces massive collisions between disparate concepts.",
        "Removing part numbers deprives the system of the critical spare-part identification information that technicians urgently need.",
        "Exact KNN with dot product on CPU does not resolve the representation mismatch of alphanumeric codes in continuous embeddings and is extremely slow."
      ],
      "dbg-20": [
        "Retrieving 100,000 results on the client creates enormous network overhead, saturates the application server's memory, and penalizes latency.",
        null,
        "Creating a Spark cluster and reindexing for each individual search would take tens of minutes and generate an insane financial cost.",
        "Adding text to the prompt does not guarantee that the retriever excludes documents from other countries or years; it is a fragile and ineffective technique for strict filters."
      ],
      "dbg-21": [
        "Vector Search supports tens of millions of vectors in enterprise production environments; there is no rigid limit of 50,000 vectors.",
        "HNSW vector storage and indexing run on Databricks' managed serverless infrastructure, not in the client's browser.",
        null,
        "Scaling Vector Search endpoints is done live without needing to restart Unity Catalog or schedule maintenance windows that interrupt the service."
      ],
      "dbg-22": [
        "`ACCOUNT ADMIN` violates the principle of least privilege by needlessly granting control over users, billing, and global governance.",
        "`MODIFY` and `CREATE TABLE` grant destructive data modification and creation permissions that are unnecessary and dangerous for an application that only reads.",
        "Disabling Unity Catalog removes the company's security, exposes sensitive data, and is not a supported or recommended practice in Databricks.",
        null
      ],
      "dbg-23": [
        null,
        null,
        "Recreating the entire endpoint on every delete would cause unacceptable service outages and needless waits of tens of minutes.",
        "Running `VACUUM` prematurely before the pipeline processes the CDF could purge data files required by the synchronization, causing inconsistencies."
      ],
      "dbg-24": [
        null,
        "The dot product operates natively on floating-point numbers (`float32`, `float64`); it is not restricted to 8-bit integers.",
        "Cosine similarity bounds real values between -1 and 1; it does not produce imaginary complex numbers in any vector calculation.",
        "The dot product is maximal for parallel vectors in the same direction and zero for orthogonal vectors; it does not require prior orthogonality."
      ],
      "dbg-25": [
        "Dropping the table destroys corporate information, and the TSV format has no transactions, CDF, or optimization for Vector Search.",
        null,
        "Disabling ACID corrupts data reliability and disables the Delta Lake capabilities required by Vector Search.",
        "Having 200 million tiny files causes the classic 'small files' problem, saturating the metastore and drastically slowing I/O."
      ],
      "dbg-26": [
        "The embeddings endpoint processes readable text, not objects serialized with Pickle, which also represent a serious security risk.",
        "An array of SHA-512 cryptographic hashes has no semantic meaning for an embedding language model.",
        null,
        "The column name is fully configurable by the user when creating the index; there is no fixed naming restriction."
      ],
      "dbg-27": [
        "Deleting the Unity Catalog metastore is neither necessary nor permitted; the vector index definition can be modified or synchronized in an orderly manner.",
        "Adding columns to a Delta table is a standard schema evolution operation that does not lock the table or corrupt storage.",
        "Migrating to external NoSQL solutions is not required; Vector Search natively supports metadata and advanced filters within the Lakehouse.",
        null
      ],
      "dbg-28": [
        null,
        "The endpoint does not restart or shut down on queries with non-indexed filters; the degradation is purely I/O from deferred post-filtering.",
        "HTTP/2 and JSON handle text strings of any common length with no arbitrary limit of 8 characters.",
        "Queries are run automatically in the Vector Search engine; no email process or manual resolution is involved."
      ],
      "dbg-29": [
        "There is no 1,000-record limit in Databricks Vector Search; the error explicitly indicates a failure in the embeddings serving endpoint.",
        null,
        "Syncs run on serverless clusters decoupled from the user's web session; closing the browser does not stop the pipeline.",
        "Databricks runs on Spark SQL and Delta Lake; it does not use Transact-SQL or local databases for vector synchronization."
      ],
      "dbg-30": [
        "Model Serving is heavily optimized for GenAI, supporting state-of-the-art LLMs, multimodal models, agents, and external APIs.",
        "There is no need to compile C++ or manage Kubernetes; Model Serving is a fully managed serverless service on Databricks.",
        null,
        "Model Serving provides real-time REST inference endpoints and low-latency streaming; it is not restricted to SQL batch executions."
      ],
      "dbg-31": [
        "Reducing the timeout to 5 ms would cause virtually 100% of requests to fail before completing, destroying usability.",
        "An interactive notebook is not a production environment, lacks autoscaling, offers no serving SLAs, and cannot support 500 requests per second.",
        "Infinite retries without backoff create a request storm (retry storm) that worsens system saturation and aggravates 429 errors.",
        null
      ],
      "dbg-32": [
        null,
        "Embedding API keys in notebook cells exposes the credentials to accidental security leaks, version control, and unauthorized access.",
        "Uploading keys to DBFS with public read access is a critical vulnerability that allows any workspace user to steal the credentials.",
        "Passing the key in the prompt exposes the credential in inference logs, chat interfaces, and vectors, violating any security standard."
      ],
      "dbg-33": [
        "AI Gateway manages inference traffic and governance of AI models; it is not a transpiler or compiler for programming languages.",
        null,
        "AI Gateway relies on and integrates deeply with Unity Catalog for security and auditing; it does not replace it or remove its access controls.",
        "It does not disconnect internet access or use magnetic tapes; it is a highly available, low-latency cloud service."
      ],
      "dbg-34": [
        "gzip compression reduces network bandwidth consumption but does not analyze semantic content or anonymize personal data.",
        "iptables rules filter packets at the IP/TCP network layer; they are completely blind to PII contained in natural language payloads.",
        null,
        "Relying on user promises is a purely administrative measure that offers no technical guarantee and does not meet data protection regulations."
      ],
      "dbg-35": [
        null,
        null,
        "The length of scripts in Git repositories has no relation to real-time inference traffic or endpoint rate limits.",
        "Temperature is a probabilistic sampling hyperparameter of the model, not a rate-limiting mechanism for controlling resource consumption."
      ],
      "dbg-36": [
        "Replicating application servers does not solve the underlying problem if the external API that everyone queries is down.",
        "Stopping the load balancer completely blocks the medical application, causing a total denial of service in an emergency environment.",
        "Relying on human alerts to edit code introduces minutes or even quarter-hours of delay that are unacceptable for a medical triage system.",
        null
      ],
      "dbg-37": [
        null,
        "Grouping requests into batches increases each user's individual latency because processing must wait until 64 queries have accumulated.",
        "Running LLM inference on a single CPU thread would dramatically slow token generation speed, worsening the problem.",
        "Compressing the response into a RAR file would require waiting for generation to finish completely and then compressing and decompressing, adding more delay."
      ],
      "dbg-38": [
        "Installing libraries on the local machine has no effect whatsoever on the serverless containers running in the Databricks cloud.",
        null,
        "Model Serving containers are serverless and managed; they do not offer interactive SSH access or root superuser privileges to the user.",
        "Rewriting AI frameworks in assembly is infeasible and absurd; standard libraries integrate cleanly through MLflow environment management."
      ],
      "dbg-39": [
        "Keeping 4 fixed instances for 12 rarely queried models would generate exorbitant costs for completely idle resources.",
        "Retraining models from scratch is extremely costly in time and GPU compute; already trained artifacts should be preserved in Unity Catalog.",
        null,
        "Disconnecting the workspace network would interrupt other critical ETL and production processes unrelated to the R&D models."
      ],
      "dbg-40": [
        "Relying on users' manual discipline is not a technical traffic control mechanism and does not work for application or API calls.",
        "Restarting servers degrades the service, causes connection errors for clients, and does not distribute traffic in a controlled probabilistic manner.",
        "Shutting down the service interrupts corporate availability and negatively impacts users instead of performing a gradual transition.",
        null
      ],
      "dbg-41": [
        null,
        "Counting characters or consonants does not evaluate at all the meaning, factual accuracy, or relevance of an answer to a question.",
        "Assuming there are no errors ignores the phenomenon of hallucinations, loss of relevance, and comprehension errors inherent to LLMs.",
        "The physical temperature of the hardware does not reflect the linguistic quality or correctness of the outputs produced by the model."
      ],
      "dbg-42": [
        "The metric evaluates the relationship between the generated answer and the context documents; it does not judge the spelling of the user's query.",
        null,
        "Network latencies are measured in milliseconds through tracing or network monitoring, not through the semantic faithfulness metric.",
        "The file size of the weights is a static storage property that has nothing to do with the semantic faithfulness of the answer."
      ],
      "dbg-43": [
        "Faithfulness can be high if the history of RSA was present in the context chunks; the main and obvious failure is the lack of relevance.",
        "Syntactic elegance does not compensate for a lack of pertinence; Answer Relevance severely penalizes straying off the topic of the query.",
        null,
        "Context Recall evaluates whether the retriever retrieved all the necessary information; the validity of session tokens does not affect MLflow metric calculation."
      ],
      "dbg-44": [
        "Precision and Recall do not measure raw word counts or latencies in milliseconds; they are formal retrieval relevance metrics.",
        "These metrics are standard in evaluating information retrieval (IR) and RAG systems over natural language, not exclusive to vision or audio.",
        "They are clearly distinct concepts in the IR literature and in MLflow; they are not synonyms nor do they depend on the workspace language setting.",
        null
      ],
      "dbg-45": [
        null,
        null,
        "The Review App captures human feedback on the application; it does not perform destructive operations or alter the neural network weights on the fly.",
        "Blocking or penalizing evaluators who report failures would destroy the continuous improvement process and is an outlandish claim."
      ],
      "dbg-46": [
        null,
        "MLflow Tracing operates at the application logic and software call level; it does not interact with low-level L1 hardware cache registers.",
        "Tracing records inference payloads for observability; it does not steal private data or phone numbers from users' devices.",
        "The purpose of Tracing is precisely to make the exact temporal and diagnostic execution transparent, not to hide the information with random numbers."
      ],
      "dbg-47": [
        "Inference Tables do not use email or external SMTP protocols; they persist data natively and securely in Lakehouse Delta tables.",
        null,
        "Delta tables retain the full transaction history for auditing and temporal analysis; they are not overwritten or deleted every 60 seconds.",
        "Logging is strictly asynchronous and does not block the real-time inference flow; it does not require human approvals per request."
      ],
      "dbg-48": [
        "Printing code on paper is not a technical auditing mechanism in the cloud and does not demonstrate the real lineage of the data consumed in production.",
        "Unity Catalog natively extends its lineage engine to MLflow models, volumes, Vector Search indexes, and serving endpoints.",
        null,
        "Destroying the information would constitute obstruction of the audit, a serious legal violation, and the loss of critical corporate data."
      ],
      "dbg-49": [
        "Counting the word 'thank you' is an extremely simplistic heuristic that does not evaluate genuine empathy, clarity, or the professional tone of the message.",
        "Modifying the hardware BIOS is impossible in managed cloud environments and has no impact on natural language semantics.",
        "Blocking packets by word length prevents the assistant from providing complete explanations and does not evaluate the qualitative quality of the tone.",
        null
      ],
      "dbg-50": [
        "A local script on a personal machine is a precarious, non-scalable solution that lacks high availability for continuous enterprise monitoring.",
        "Disabling inference tables removes all operational visibility and makes it impossible to monitor drift and quality in production.",
        "Screenshots on a Tomcat server do not structure data drift metrics nor enable analytical supervision of models in production.",
        null
      ]
    },
    "glossary": [
      {
        "term": "Mosaic AI Vector Search",
        "cat": "Vector Search",
        "d": 3,
        "def": "Serverless vector database engine in Databricks integrated with Unity Catalog that offers approximate nearest neighbor (ANN) search and hybrid search."
      },
      {
        "term": "Delta Sync Index",
        "cat": "Vector Search",
        "d": 3,
        "def": "Vector Search index that automatically synchronizes vectors and metadata from a Unity Catalog Delta table using Change Data Feed (CDF)."
      },
      {
        "term": "Direct Vector Access Index",
        "cat": "Vector Search",
        "d": 3,
        "def": "Vector Search index where vectors and metadata are inserted, updated, or deleted directly through REST API calls with no linked Delta table."
      },
      {
        "term": "Change Data Feed (CDF)",
        "cat": "Data Preparation",
        "d": 3,
        "def": "Delta Lake feature that records row-level changes (inserts, updates, deletes) for incremental streaming or batch processing."
      },
      {
        "term": "Hybrid Search",
        "cat": "Vector Search",
        "d": 3,
        "def": "Search technique that combines dense (semantic) vector similarity with sparse lexical search (BM25 / full-text) using Reciprocal Rank Fusion."
      },
      {
        "term": "Mosaic AI Model Serving",
        "cat": "Model Serving",
        "d": 4,
        "def": "Low-latency serverless platform for deploying foundation LLMs, custom MLflow models, and external model APIs with automatic scaling."
      },
      {
        "term": "AI Gateway",
        "cat": "Governance & Serving",
        "d": 4,
        "def": "Centralized management layer in Model Serving that provides security guardrails, rate limits, routing with fallback, and cost tracking."
      },
      {
        "term": "Provisioned Throughput",
        "cat": "Model Serving",
        "d": 4,
        "def": "Model Serving deployment mode with reserved compute capacity (Model Units) that guarantees deterministic latency and concurrency without rate limits."
      },
      {
        "term": "Pay-per-token",
        "cat": "Model Serving",
        "d": 4,
        "def": "Consumption mode in Foundation Model APIs where billing is based solely on the volume of input tokens and output tokens processed."
      },
      {
        "term": "External Models",
        "cat": "Model Serving",
        "d": 4,
        "def": "Model Serving feature that lets you expose and govern models from external providers (OpenAI, Anthropic, Cohere) through a unified API."
      },
      {
        "term": "Guardrails (AI Gateway)",
        "cat": "Security & Guardrails",
        "d": 4,
        "def": "Configurable filters in AI Gateway for automatic detection and redaction of PII (sensitive information), toxicity analysis, and jailbreak prevention."
      },
      {
        "term": "Rate Limiting",
        "cat": "Model Serving",
        "d": 4,
        "def": "AI Gateway policies that restrict the number of requests per minute (RPM) or tokens per minute (TPM) per user, team, or API key."
      },
      {
        "term": "Fallback Routing",
        "cat": "Model Serving",
        "d": 4,
        "def": "High-availability mechanism in AI Gateway that automatically switches to a backup model if the primary endpoint returns 429 or 5xx errors."
      },
      {
        "term": "Inference Tables",
        "cat": "Governance & Auditing",
        "d": 5,
        "def": "Automatic, asynchronous logging of incoming requests, model responses, and metrics to a Unity Catalog Delta table for auditing and monitoring."
      },
      {
        "term": "mlflow.evaluate()",
        "cat": "Evaluation",
        "d": 5,
        "def": "MLflow function for evaluating models and GenAI chains by computing classic, statistical, and LLM-as-a-judge metrics over evaluation datasets."
      },
      {
        "term": "LLM-as-a-Judge",
        "cat": "Evaluation",
        "d": 5,
        "def": "Pattern where a high-capacity language model evaluates the quality, relevance, and correctness of responses generated by another model following formal rubrics."
      },
      {
        "term": "Faithfulness (Groundedness)",
        "cat": "Evaluation",
        "d": 5,
        "def": "GenAI evaluation metric that quantifies whether all factual claims in the response are strictly grounded in the retrieved context (anti-hallucination)."
      },
      {
        "term": "Answer Relevance",
        "cat": "Evaluation",
        "d": 5,
        "def": "Evaluation metric that rates whether the generated answer responds pertinently and directly to the user's question, regardless of the context."
      },
      {
        "term": "Context Precision",
        "cat": "Evaluation",
        "d": 5,
        "def": "Retrieval component (retriever) metric that measures whether the most relevant context chunks appear in the top positions of the returned ranking."
      },
      {
        "term": "Context Recall",
        "cat": "Evaluation",
        "d": 5,
        "def": "Retriever metric that evaluates whether the retrieved chunks contain all the information needed to adequately answer the query."
      },
      {
        "term": "MLflow Tracing",
        "cat": "Observability",
        "d": 5,
        "def": "OpenTelemetry-based observability tool that captures hierarchical spans, latencies, prompts, and tool calls in GenAI chains and agents."
      },
      {
        "term": "Review App",
        "cat": "Evaluation",
        "d": 5,
        "def": "Interactive Mosaic AI Agent Evaluation application that lets business experts rate generated responses, record feedback, and refine test datasets."
      },
      {
        "term": "Unity Catalog",
        "cat": "Governance",
        "d": 1,
        "def": "Unified governance layer in Databricks for data, models, functions, volumes, and vector indexes with fine-grained access control and lineage."
      },
      {
        "term": "Recursive Character Chunking",
        "cat": "Data Preparation",
        "d": 2,
        "def": "Text splitting algorithm that recursively splits by a hierarchical list of delimiters (paragraphs, line breaks, spaces) to preserve semantic coherence."
      },
      {
        "term": "Cross-Encoder Re-ranking",
        "cat": "RAG & Chains",
        "d": 2,
        "def": "Model that jointly evaluates the query and each candidate document, assigning a precise relevance score; used as a second stage after the bi-encoder."
      }
    ]
  };
})(window);
