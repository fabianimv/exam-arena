# ⚡ Cloud & SRE Exam Arena

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=flat-square&logo=github)](https://fabianimv.github.io/exam-arena/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Questions](https://img.shields.io/badge/Questions-902%20Scenarios-orange?style=flat-square)](#included-exam-tracks)
[![Visuals](https://img.shields.io/badge/SVG%20Visuals-617%20Unique-blue?style=flat-square)](#included-exam-tracks)
[![i18n](https://img.shields.io/badge/i18n-ES%20%7C%20EN-purple?style=flat-square)](#automatic-bilingual-localization-es--en)
[![Cloud Sync](https://img.shields.io/badge/Cloud%20Sync-Supabase-3ECF8E?style=flat-square&logo=supabase)](#cloud-sync-setup-supabase-free-tier)
[![Powered by study-tracker](https://img.shields.io/badge/Tracking-%40fabianimv%2Fstudy--tracker-blueviolet?style=flat-square)](https://github.com/fabianimv/study-tracker)

> **Unified Multi-Provider Cloud & SRE Incident Simulator** featuring real production scenarios, deep per-option diagnostic feedback, automatic bilingual support (`ES` / `EN`), and zero-conflict cross-device cloud synchronization powered by Supabase and [`@fabianimv/study-tracker`](https://github.com/fabianimv/study-tracker).

---

## 🌟 Key Features

### 🎯 Multi-Provider Exam & SRE Incident Simulator
Unifies 13 AI, Data, Cloud Native, IaC, streaming, and SRE certification tracks into a single, high-performance, zero-build web application — ordered from newest/featured to traditional:
- **Anthropic Claude Certifications** (`CCAR-F` Architect, `CCDV-F` Developer, `CCAO-F` Associate)
- **Databricks** (Generative AI Engineer Associate & Data Engineer Associate)
- **NVIDIA** (Generative AI LLMs `NCA-GENL`)
- **CNCF & HashiCorp** (Kubernetes `KCNA` & Terraform Associate `003`)
- **SRE & Production Engineering Incidents** (Real on-call outage response scenarios)
- **Apache Kafka & Confluent Platform (CCDAK / CCAAK)** (Event-driven architecture, KRaft, EOS, Connect & Kafka Streams)
- **Google Cloud Generative AI Leader**
- **Microsoft Azure Administrator (AZ-104)**
- **AWS Solutions Architect Associate (SAA-C03)**

### 💡 Deep Diagnostic Feedback (`why` per option)
Built around **active recall** and deliberate practice principles. Standard simulators only tell you which option is correct; Exam Arena explains:
- **Why your chosen option is incorrect:** Pinpoints why a distractor exacerbates an outage, violates cloud limits, causes data corruption, or fails the technical constraint.
- **Why the correct answer is the optimal choice:** Concrete architectural justification, command flags, or operational procedures.
- **Selective retries:** Review missed scenarios immediately or launch targeted sessions filtering for **unanswered questions** or **previously missed questions**.

### 🌐 Automatic Bilingual Localization (`ES` / `EN`)
Seamless internationalization powered by [`assets/js/i18n.js`](assets/js/i18n.js):
- **Smart browser detection:** Automatically detects `navigator.languages` / `navigator.language` on first load.
- **1-Click toggle:** Switch between Spanish and English instantly with state preserved in `localStorage`.
- **Dynamic translation engine with caching:** UI strings and question scenarios feature on-the-fly cached translation (`exam-arena-tr-en-v1`), ensuring zero latency after first retrieval and graceful offline fallbacks.

### 🔄 Idempotent Cross-Device Cloud Sync (Supabase + `@fabianimv/study-tracker`)
Study seamlessly across desktop, tablet, and mobile browsers:
- **Offline-First:** All answers and study sessions are stored instantly in browser `localStorage`.
- **Atomic PostgreSQL RPC (`supabase/schema.sql`):** Sync merges data bi-directionally keyed by user email. Sessions are deduplicated by `id`, and question responses are merged as a mathematical set union over `session|question|at`.
- **Zero Race Conditions:** Desktop and mobile progress never overwrite or duplicate each other, even when studying offline on multiple devices simultaneously.

### ⌨️ Modern UI & Keyboard-First UX
- **Theme toggle:** Sleek dark and light themes with high-contrast typography (`Inter` & `JetBrains Mono`).
- **Dynamic provider accents:** Fluid visual transitions matching provider brands (SRE red, GCP blue, Azure sky, AWS orange).
- **Full keyboard navigation:** Select answers with <kbd>A</kbd>–<kbd>F</kbd> or <kbd>1</kbd>–<kbd>6</kbd>, confirm with <kbd>Enter</kbd>, and advance with <kbd>Enter</kbd> / <kbd>→</kbd>.
- **Study guides & interactive glossaries:** Domain summaries with expandable topic accordions and real-time category filtering.

---

## 📚 Included Exam Tracks

| Provider / Track | ID (`appId`) | Scenarios | Unique SVGs | Highlights |
| :--- | :--- | :---: | :---: | :--- |
| 🏛️ **Anthropic · Claude Architect (CCAR-F)** *(Featured)* | `claude-architect` | **55** | **44** | Agentic orchestration, Claude Agent SDK, Claude Code, MCP, structured JSON & context reliability. |
| ⚡ **Anthropic · Claude Developer (CCDV-F)** *(Featured)* | `claude-developer` | **53** | **48** | Messages API, SSE streaming, Prompt Caching, Batches API, tool use, MCP & evals. |
| ✨ **Anthropic · Claude Associate (CCAO-F)** *(Featured)* | `claude-associate` | **55** | **35** | Claude Projects, Artifacts, AUP/PII governance, Human-in-the-Loop, rubrics & prompt chaining. |
| 🧱 **Databricks · GenAI Engineer** *(Featured)* | `databricks-genai` | **50** | **42** | Mosaic AI Vector Search, RAG, Model Serving, AI Gateway, MLflow Evaluation & Unity Catalog. |
| 🧱 **Databricks · Data Engineer** *(Featured)* | `databricks-de` | **50** | **43** | Lakehouse, Medallion Architecture, Delta Lake, Auto Loader, DLT, Workflows & Unity Catalog. |
| 🟩 **NVIDIA · GenAI LLMs (NCA-GENL)** *(Featured)* | `nvidia-genl` | **45** | **38** | Transformers, FlashAttention, LoRA/QLoRA, NeMo, NIM, TensorRT-LLM & PagedAttention. |
| ☸️ **CNCF · Kubernetes (KCNA)** | `k8s-kcna` | **50** | **42** | Control Plane, Pods, Services, NetworkPolicy, Gateway API, Observability & GitOps. |
| 🟪 **HashiCorp · Terraform (003)** | `terraform-003` | **50** | **42** | IaC, HCL, State & Locking, `moved`/`import`, `for_each` vs `count`, Modules & HCP Terraform. |
| 🚨 **SRE & Production Engineering** | `sre-incidents` | **60** | **49** | Incident Command, K8s traffic, Kafka, Prometheus/Thanos, DRP, DNS, TLS & GitOps drift. |
| 📡 **Apache Kafka & Confluent** | `kafka-confluent` | **60** | **49** | KRaft, ISR/replication, Producer/Consumer tuning, EOS, Schema Registry, Connect & Streams. |
| ☁️ **Google Cloud GenAI Leader** | `gcp-genai-leader` | **200** | **94** | LLM fundamentals, Vertex AI, Gemini, Model Garden, fine-tuning, RAG & AI governance. |
| 🔷 **Microsoft Azure (AZ-104)** | `az-104` | **130** | **55** | Entra ID, governance, storage redundancy, ARM/Bicep, compute, VNets & Azure Monitor. |
| 🟧 **AWS Solutions Architect (SAA-C03)** | `aws-saa-c03` | **44** | **36** | Well-Architected Framework: secure, resilient, high-performing & cost-optimized architectures. |
| **Total Arena Scenarios** | — | **902** | **617** | **13 certification tracks with ad-hoc SVG diagrams & per-option rationales** |

---

## ☁️ Cloud Sync Setup (Supabase Free Tier)

You can sync your study history across devices for free using Supabase in under 2 minutes:

```
┌───────────────────────┐         HTTPS RPC          ┌──────────────────────────┐
│   Exam Arena Client   │ ◄────────────────────────► │    Supabase PostgreSQL   │
│  (GitHub Pages / PWA) │   sync_exam_progress()     │  (exam_arena_progress)   │
└───────────────────────┘                            └──────────────────────────┘
```

### Step 1: Create a Free Supabase Project
1. Sign up or log in at [supabase.com](https://supabase.com/).
2. Click **New Project**, choose an organization, set a project name (e.g., `exam-arena`), choose a database password, and click **Create new project**.

### Step 2: Execute `supabase/schema.sql`
1. In your Supabase project dashboard, navigate to the **SQL Editor** on the left sidebar.
2. Click **New query**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run** (<kbd>Ctrl</kbd>+<kbd>Enter</kbd> / <kbd>Cmd</kbd>+<kbd>Enter</kbd>).
3. This creates:
   - The `exam_arena_progress` table secured by Row Level Security (RLS).
   - The idempotent PostgreSQL function `sync_exam_progress(p_email, p_client_data)`.
   - Granular public `anon` policies allowing serverless client execution.

### Step 3: Connect via the App UI
1. In Supabase, go to **Project Settings** → **API** and copy:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **Project API Keys** → `anon` `public` key (`eyJ...`)
2. Open [Exam Arena](https://fabianimv.github.io/exam-arena/) in your browser.
3. Click the **☁️ Sync** button in the header.
4. Enter your email, paste your Supabase URL and Anon Key, and click **Guardar y sincronizar ahora** (or **Save & Sync Now**).
5. All 4 exam tracks will immediately sync bidirectionally!

> [!TIP]
> If you are hosting your own fork on GitHub Pages, you can also hardcode your URL and anon key into `DEFAULT_SUPABASE_URL` and `DEFAULT_SUPABASE_ANON_KEY` inside [`assets/js/cloud-sync.js`](assets/js/cloud-sync.js) so users only need to type their email to sync.

---

## 🏗️ Project Architecture

Exam Arena is designed as a zero-dependency, zero-build client application that can be deployed to any static host (GitHub Pages, Cloudflare Pages, S3, or Nginx).

```
exam-arena/
├── index.html               # Main single-page application shell
├── LICENSE                  # MIT License
├── README.md                # Project documentation
├── CONTRIBUTING.md          # Guide for adding new providers & questions
├── assets/
│   ├── css/
│   │   └── styles.css       # Unified design system, themes, and responsive layout
│   └── js/
│       ├── app.js           # Core router, test engine, active recall UI, and state
│       ├── i18n.js          # Bilingual dictionary, auto-detection, and translation cache
│       └── cloud-sync.js    # Supabase REST client, modal UI, and localStorage synchronization
├── data/
│   ├── sre/exam.js          # SRE Incident Simulator data (60 scenarios + why rationale)
│   ├── kafka/exam.js        # Apache Kafka & Confluent data (60 scenarios + why rationale)
│   ├── gcp/exam.js          # GCP GenAI Leader data (200 questions + why rationale)
│   ├── azure/exam.js        # Azure AZ-104 data (130 questions + why rationale)
│   └── aws/exam.js          # AWS SAA-C03 data (44 questions + why rationale)
└── supabase/
    └── schema.sql           # Production-ready PostgreSQL RLS table & idempotent RPC function
```

---

## ➕ Adding a New Provider or Exam

Adding a new certification track or incident simulator requires zero build tooling. Simply add your provider definition to `data/<provider>/exam.js`:

```js
window.EXAMS = window.EXAMS || {};
window.EXAMS['my-exam'] = {
  id: 'my-exam',
  appId: 'my-exam',
  provider: 'Provider Name',
  badge: 'Short Badge',
  icon: '⚡',
  color: '#0078d4',
  title: 'Full Certification Title',
  subtitle: 'Target skills and domains summary',
  passingScore: 70,
  domains: { 1: 'Domain 1 Name (50 %)', 2: 'Domain 2 Name (50 %)' },
  shortDomains: { 1: 'Domain 1', 2: 'Domain 2' },
  topics: [
    { id: 't-1-1', d: 1, title: 'Topic Overview', html: '<p>Study guide content...</p>' }
  ],
  questions: [
    {
      id: 'q-01',
      d: 1,
      t: 'Scenario Sub-topic',
      q: 'Scenario prompt text describing the situation...',
      o: [
        'Incorrect option A',
        'Correct option B',
        'Incorrect option C',
        'Incorrect option D'
      ],
      a: 1, // Index of correct option (or array of indices for multi-select)
      e: 'Detailed explanation of why Option B solves the scenario.'
    }
  ],
  why: {
    'q-01': [
      'Why option A is wrong (e.g., causes unexpected downtime).',
      null, // Correct option
      'Why option C is wrong (e.g., exceeds budget requirements).',
      'Why option D is wrong (e.g., lacks high availability).'
    ]
  },
  glossary: [
    { term: 'Key Term', cat: 'Category', d: 1, def: 'Technical definition.', tip: 'Exam hint.' }
  ]
};
```

Register the script in `index.html` and add its ID to `EXAM_ORDER` in `assets/js/app.js` and `EXAM_IDS` in `assets/js/cloud-sync.js`. For full guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🚀 Local Development

Exam Arena requires no `npm install` or compilation step. Clone and serve with any local HTTP server:

```bash
# Clone the repository
git clone https://github.com/fabianimv/exam-arena.git
cd exam-arena

# Start a local server (Python 3)
python3 -m http.server 8080

# Or using Node.js / npx
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright © 2026 FabianIMV.
