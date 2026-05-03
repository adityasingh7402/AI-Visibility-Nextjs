# 🚀 GEO Platform — AI Visibility SaaS

### Complete Feature & Product Overview

> **GEO = Generative Engine Optimization** — The first platform that optimizes brands for AI visibility, not just Google rankings.

---

## 🧭 What Is This Product?

GEO Platform is a **B2B SaaS tool** that helps marketing teams, SEO professionals, brand managers, and agencies answer one critical question:

> _"When a real user asks ChatGPT, Gemini, or Perplexity a question in my industry — does my brand get mentioned, and how positively?"_

It automates what marketing teams spend **25+ hours a week** doing manually: competitor research, page audits, AI visibility tracking, and content optimization. It goes beyond traditional SEO (ranking on Google) and enters the new frontier of **AI answer engine optimization**.

---

## 🎯 Who Is It For?

| User Type                          | Use Case                                                            |
| ---------------------------------- | ------------------------------------------------------------------- |
| **Marketing Teams**                | Track brand visibility across AI assistants, measure share-of-voice |
| **SEO Professionals**              | Adapt SEO strategies for the AI-first world                         |
| **Brand Managers**                 | Monitor how AI describes their brand vs competitors                 |
| **Agencies**                       | Run batch analyses for multiple clients simultaneously              |
| **Product Owners / SaaS Founders** | Understand if their product gets recommended by AI                  |

---

## 🏗️ Product Architecture (Three Parts)

The platform is built as three interconnected systems:

1. **Next.js Frontend** — The user-facing dashboard, analytics, and analysis tools
2. **Express.js Backend** — Secure API gateway, quota management, authentication, and orchestration
3. **Python AI Engine** — The core intelligence: 6 specialized AI agents running LangGraph pipelines

---

## 🌟 Core Features

### 1. 🔬 Full GEO Analysis (Generative Engine Optimization Audit)

The flagship feature. A user submits their brand URL and the platform runs a **17-dimension deep audit** that evaluates:

- **Crawling** — Extracts text, images, and structured JSON-LD data from the brand's website
- **AI Keyword Analysis** — Uses spaCy NLP to analyze keyword density and semantic coverage
- **Competitor Research** — Automatically discovers competitors and benchmarks the brand against them
- **Wikipedia & Authority Scoring** — Checks brand presence on Wikipedia, G2, Capterra, TrustRadius
- **LLM Visibility Testing** — Actually fires real queries at multiple AI assistants and records where and how the brand is mentioned
- **Image SEO Scoring** — Scores image alt-text and visual relevance using vision AI
- **Proprietary GEO Score** — Calculates a final 0–100 visibility score across all dimensions
- **Content Generation** — Auto-generates answer-first content, FAQ sections, and competitor battle cards

**Scan Modes:**

- `quick` — Fast, surface-level scan
- `full` — Standard complete scan
- `deep` — Most thorough, highest accuracy

**Analysis Types:**

- `full` — Complete 17-dimension GEO workflow
- `aeo_scan` — Focused 5-node AI visibility workflow
- `combined` — GEO + AEO together
- `geo_only` — Only GEO scoring
- `seo_only` — Only traditional SEO signals
- `marketing_only` — Marketing and brand voice focus

---

### 2. ⚡ AEO Scan (Answer Engine Optimization)

A faster, lighter version of the full audit focused specifically on how AI **answer engines** handle brand queries. It runs a focused 5-node pipeline instead of the full 17-dimension workflow. Ideal for quick health checks or frequent monitoring.

---

### 3. 🔍 Keyword Discovery

Automatically discovers which keywords and prompts actually get a brand mentioned by AI assistants.

- Runs 30–90 second analysis on the Python engine
- Supports **quick, standard, and deep** discovery modes
- Tests across multiple LLM providers simultaneously
- Results are **cached for 24 hours** to avoid redundant API calls and save costs
- Returns keywords ranked by their effectiveness at triggering brand mentions

---

### 4. ✅ Keyword Testing

Let users manually test **specific keywords** they already have. Runs those exact prompts against chosen AI models and reports:

- Whether the brand was mentioned
- Where it appeared in the response
- Sentiment of the mention
- Comparison against competitors

Runs in 15–45 seconds per test.

---

### 5. 🎯 Prompt Validation

A quick sanity-check tool (5–15 seconds): _"Will this prompt mention my brand?"_

Users paste a single prompt, select AI providers, and get an instant yes/no with reasoning. Perfect for marketers writing content briefs who want to validate their angle before investing.

---

### 6. 💬 Conversational Testing

Simulates **multi-turn conversations** with AI assistants to test how brand mentions appear in realistic dialogue flows — not just single-shot queries. This mirrors how real users interact with ChatGPT/Gemini (follow-up questions, context-building).

---

### 7. 🏭 Batch Analysis (Agency Mode)

Agencies and enterprise users can submit **up to 10 brands simultaneously** in a single API call. Each brand runs its own full keyword discovery pipeline and results are saved per-brand. Includes:

- Shared competitor lists across clients
- Per-client mode overrides
- Bulk result management

---

### 8. 📝 Content Lab (Content Validation & Enhancement)

A suite of content tools that check if existing content is **AI-citable (RAG-ready)**:

#### Content Validation

- Checks if content is structured in a way AI models can easily extract and cite
- Supports: `blog_post`, `landing_page`, `product_page`, `documentation`, `press_release`
- Runs in 5–15 seconds
- Returns a citability score and specific structural gaps

#### Live Content Test

- Actually sends the content to real AI models and checks if it gets cited
- Tests across ChatGPT, Gemini, and other selected providers
- Returns exact citation evidence and mention rates

#### Content Enhancement (AI Rewrite)

- Takes existing content and **rewrites/enhances** it for better RAG-citability
- Modes: `full` (complete rewrite), `targeted` (specific sections)
- Generates targeted improvements based on validation results

---

### 9. 🤖 Multi-Provider AI Testing

Users can choose **which AI assistants** to test their brand against. The platform currently supports:

| Provider            | Company       | Key Trait                              |
| ------------------- | ------------- | -------------------------------------- |
| **ChatGPT**         | OpenAI        | Wikipedia-heavy, Reddit influence      |
| **Google Gemini**   | Google        | YouTube access, Google ecosystem       |
| **Perplexity**      | Perplexity AI | Real-time web search, citation-focused |
| **Claude**          | Anthropic     | Structured content preference          |
| **Grok**            | xAI           | X/Twitter access, real-time info       |
| **NVIDIA NIM**      | NVIDIA        | Developer/technical community focus    |
| **DigitalOcean AI** | DigitalOcean  | Open-source model hosting              |
| **DeepSeek**        | DeepSeek      | Code and reasoning, Chinese language   |

Each provider has **multiple model options** users can select (e.g., GPT-4o, o1, o3 for ChatGPT; Gemini 2.5 Flash, Gemini 3 Flash for Gemini, etc.)

Users can also set **provider weights** to customize how much each AI's result influences the overall GEO Score.

---

### 10. 📊 Reports & History

All analyses are automatically saved. Users get:

- **Unified reports list** — All past GEO, AEO, keyword, and content analyses in one place
- **Report filtering** — Filter by type (geo/aeo/combined/keywords/content), variant, brand name
- **Sorting** — By date or by score
- **Letter grade system** — A/B/C/D/F grades computed from the 0–100 score
- **Full structured report** — Detailed breakdown with:
  - Scores per dimension
  - Provider-by-provider results
  - Competitor comparisons
  - Actionable recommendations
  - Executive summary
- **Markdown Export** — Download any report as a formatted `.md` file

---

### 11. 📈 Trend Tracking & Visibility Over Time

The dashboard shows a **Visibility Trend chart** built from historical analyses. Users can see:

- Whether their AI visibility is improving, stable, or declining
- Score evolution over time across all analyzed brands
- Overall trend direction: `improving` / `stable` / `declining`

---

### 12. 🏷️ Brand Management

Users can track multiple brands in their workspace:

- Add brands with category, region, and description metadata
- View the latest GEO score per brand on the dashboard
- Filter reports by brand
- Manage a portfolio of brands (competitor brands, client brands, etc.)

---

### 13. 🏢 Organization & Team Management

Multi-user workspace support:

- **Organization creation** during onboarding
- **Role-based access**: Owner, Manager, Analyst, Viewer
- **Team invitations** and member management
- Each organization has its own isolated data and quota

---

### 14. 📡 Real-Time Progress Streaming

Analysis jobs can take minutes. The platform uses **Server-Sent Events (SSE)** to stream real-time progress updates to the frontend. Users see live progress as the 6 AI agents work:

- Agent 1 crawling in progress...
- Agent 2 researching competitors...
- Agent 3 testing on ChatGPT...
- etc.

An **Active Analysis Banner** appears in the dashboard while a job is running, so users don't need to stay on the analysis page.

---

### 15. 🛡️ Security & Usage Controls

The platform has enterprise-grade safety mechanisms:

- **JWT Authentication** — All API endpoints require valid Supabase tokens
- **Rate Limiting** — 100 requests/minute for general endpoints; 5 requests/minute for expensive analysis endpoints
- **Quota System** — Users have an analysis quota tied to their subscription plan
- **Concurrent Pipeline Limits** — Prevents users from running too many heavy analyses simultaneously
- **Audit Logging** — Every major action (keyword discovery, analysis, content validation) is logged with user context
- **CORS Restrictions** — Only approved frontend origins can call the API

---

### 16. 🔔 Notification Center

In-app notifications so users are informed of:

- Completed analyses
- Failed jobs
- System updates or alerts

---

### 17. 🧠 The 6-Agent AI Pipeline

Under the hood, every analysis runs through 6 specialized AI agents orchestrated by **LangGraph**:

| Agent       | Name             | What It Does                                                                                                   |
| ----------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| **Agent 1** | Crawler          | Extracts text, images, JSON-LD from target URL; uses spaCy for NLP                                             |
| **Agent 2** | Researcher       | Web research via Tavily & Google Search; finds competitors, checks Wikipedia/G2                                |
| **Agent 3** | LLM Tester       | Fires real queries at user-selected frontier models using 8 distinct prompt styles, 5-run consistency strategy |
| **Agent 4** | Image Analyzer   | Scores image alt-text and relevance using Gemini Vision; Llama Vision fallback                                 |
| **Agent 5** | Optimizer        | Calculates the GEO Score; generates content, FAQs, battle cards, citation traces                               |
| **Agent 6** | Quality Verifier | Final safety net: checks Agent 5's output for contradictions/hallucinations; forces retry if needed            |

**LLM Routing Strategy (3 Tiers):**

- Internal reasoning: Groq (Llama 70B, 8B, Gemma) — sub-500ms via a 6-model fallback chain
- Customer-facing testing: User-selected frontier models (GPT-4o, Gemini, etc.)
- Vision tasks: Gemini 2.0 Flash Vision with Llama 3.2 Vision fallback

---

### 18. 🏭 Industry Profiles

The analysis can be tuned to different industry contexts:

- `saas` — Software-as-a-Service products
- `local_business` — Local service businesses
- `ecommerce` — Online retail
- `media_publisher` — Content/media brands

Industry profile shapes which prompts are used, which benchmarks are applied, and what recommendations are generated.

---

### 19. 🌍 Multi-Region & Multi-Language Support

- Analysis can be scoped to a **specific region** (global, US, UK, EU, APAC, etc.)
- Supports `country_code` for geo-targeted keyword discovery
- Primary language can be set (e.g., `en`, `es`, `fr`, `de`, `zh`)
- Several supported AI models have multilingual capabilities

---

### 20. 💾 Data Persistence & Crash Recovery

The backend has a sophisticated result-persistence system:

- Results are auto-saved to the database even if the user **closes their browser** during analysis
- Background polling ensures results are captured within 10 minutes of completion
- On server restart, an **orphan recovery process** backfills any results that were missed
- A dedicated `job_results` table acts as a temporary buffer between the Python engine and the reports table

---

## 📋 Dashboard Overview

The user dashboard provides at-a-glance metrics:

| Metric             | Description                             |
| ------------------ | --------------------------------------- |
| **Total Analyses** | All-time count of completed analyses    |
| **Latest Score**   | GEO score from the most recent analysis |
| **Average Score**  | Mean GEO score across all analyses      |
| **Best Score**     | Highest GEO score ever achieved         |

Plus:

- **Tracked Brands** — Grid of all monitored brands with their scores and maturity levels
- **Visibility Trend Chart** — Time-series chart of score progression
- **Recent Analyses** — Quick access to the 5 most recent analyses
- **Quick Actions** — One-click shortcuts to: AEO Scan, GEO Audit, Content Lab

---

## 🎓 Scoring & Maturity System

Analyses produce:

- A **GEO Score (0–100)** — the proprietary visibility score
- **Sub-scores** per dimension (e.g., mention rate, sentiment, position, authority)
- A **Letter Grade** (A=90+, B=80+, C=70+, D=60+, F=below 60)
- A **Maturity Level** label with a color-coded badge

---

## 🔄 Analysis Lifecycle

```
User submits brand URL + config
        ↓
Express.js validates input + checks quota
        ↓
Job submitted to Python async queue → returns job_id immediately
        ↓
Frontend streams live progress via SSE
        ↓
6 AI Agents run in sequence (LangGraph)
        ↓
Result saved to Supabase reports table
        ↓
User views detailed report with scores, recommendations, and competitor data
```

---

## 📥 Key Deliverables Per Analysis

When a full GEO analysis completes, the user receives:

- ✅ **Overall GEO Score** (0–100) with letter grade
- ✅ **Per-Provider Results** — mention rate, sentiment, average position for each AI model tested
- ✅ **Sub-Scores** across 17 dimensions with weights and evidence
- ✅ **Competitor Comparison** — how competitors scored vs your brand
- ✅ **Actionable Recommendations** — prioritized list of improvements
- ✅ **Executive Summary** — Plain-English summary of findings
- ✅ **AI-Generated Content** — Answer-first content, FAQ blocks, battle cards
- ✅ **Markdown Report** — Downloadable `.md` file with everything
- ✅ **Citation Source Traces** — Where exactly AI models are getting their information

---

## 🔧 Technical Reliability Features

| Feature              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| Circuit Breaker      | Prevents cascade failures when external AI APIs go down             |
| LLM Fallback Chain   | If primary model fails, automatically tries 5 alternatives          |
| 24h Caching          | Keyword discovery results cached to avoid duplicate API costs       |
| Retry Logic          | Automatic retry with backoff for transient failures                 |
| Quality Verification | Agent 6 forces Agent 5 to retry if output quality is too low        |
| Cost Tracking        | Internal tracking of LLM API costs per analysis                     |
| Consistency Strategy | Each keyword tested 5 times (multi-run) for statistical reliability |

---

_This document reflects the features implemented and in-progress across the three repositories: `ai-visibility-nextjs` (frontend), `Expressjs` (backend), and `AI-Visibility-Services` (Python AI engine)._
