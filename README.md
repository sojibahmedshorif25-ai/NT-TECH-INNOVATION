# SmartHire AI — Intelligent Recruitment & Pipeline Platform

[![Tests](https://img.shields.io/badge/Vitest-11%20Passed-success.svg)](https://github.com/sojibahmedshorif25-ai/NT-TECH-INNOVATION)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016%20Turbopack-blue.svg)](https://nextjs.org)
[![Backend](https://img.shields.io/badge/Backend-Express.js%20REST%20API-lightgrey.svg)](https://expressjs.com)
[![Database](https://img.shields.io/badge/MongoDB-Atlas%20Live-green.svg)](https://mongodb.com)
[![AI Engine](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-orange.svg)](https://aistudio.google.com)
[![Architecture](https://img.shields.io/badge/Architecture-Separated%20Frontend%20%26%20Backend-purple.svg)](https://github.com/sojibahmedshorif25-ai/NT-TECH-INNOVATION)

> **Full Stack Developer Practical Assessment Submission**  
> **Candidate:** Sojib Ahmed  
> **Repository:** [https://github.com/sojibahmedshorif25-ai/NT-TECH-INNOVATION](https://github.com/sojibahmedshorif25-ai/NT-TECH-INNOVATION)  
> **Architecture Pattern:** Decoupled Modular Monorepo (`frontend/` + `backend/`)

---

## 1. Executive Summary & Problem Solving (10 Marks)

### The Real-World Problem
Modern technical recruiting suffers from **manual resume screening fatigue**, inconsistent evaluation standards, and broken candidate communication. Hiring managers spend hundreds of hours manually comparing resumes against job requirements, leading to high latency, human bias, and candidate drop-off.

### The Solution: SmartHire AI
**SmartHire AI** is an autonomous, full-stack recruitment platform designed to streamline the entire hiring lifecycle:
1. **Candidate Experience**: Job seekers browse active tech positions, submit their profile with 1-click sample templates, and receive instant, objective semantic AI evaluations with skill-gap breakdowns.
2. **Recruiter Intelligence**: Hiring managers manage applicants across an interactive Kanban board governed by a strict multi-stage state machine (`APPLIED` → `UNDER_REVIEW` → `AI_SCREENED` → `SHORTLISTED` → `INTERVIEW_SCHEDULED` → `OFFERED` / `REJECTED`).
3. **AI Resume Screening**: Powered by **Google Gemini 3.8 Flash**, extracting deep semantic skills, identifying gaps, and calculating composite fit ratings in real time.
4. **Hiring Analytics**: Live visibility into candidate conversion rates, average time-in-stage, compensation expectations vs allocated budgets, and qualification distribution.
5. **Decoupled Architecture**: Strictly organized into independent `frontend/` (Next.js 16 + React 19) and `backend/` (Express.js + MongoDB Atlas) services for maximum modularity and scalability.

---

## 2. System Architecture & Folder Separation

```
NT-TECH-INNOVATION/
├── frontend/                      # Client-Side Application (Next.js 16, Port 3000)
│   ├── src/
│   │   ├── app/                   # App Router Pages & Styles
│   │   │   ├── page.tsx           # Job Search & Filtering Homepage
│   │   │   ├── jobs/[id]/page.tsx # Detailed Job Description & Direct Application
│   │   │   ├── pipeline/page.tsx  # 7-Stage Recruiter Kanban Board
│   │   │   ├── my-applications/   # Candidate Application Tracker
│   │   │   ├── analytics/page.tsx # Recruitment KPI Dashboard
│   │   │   ├── docs/page.tsx      # System Architecture & API Documentation
│   │   │   ├── login/page.tsx     # OAuth & Credentials Login
│   │   │   ├── register/page.tsx  # Account Registration
│   │   │   └── globals.css        # Glassmorphic Design System
│   │   ├── components/            # Reusable UI (Navbar, JobCard, AIMatchModal, etc.)
│   │   ├── context/               # AuthContext & ToastContext
│   │   └── lib/                   # Client-side State Machine & Types
│   ├── next.config.ts             # Proxy Rewrites: /api/* -> http://localhost:5000/api/*
│   └── package.json
│
├── backend/                       # Server-Side Application (Express.js, Port 5000)
│   ├── src/
│   │   ├── server.js              # Express entry point (CORS, Cookie Parser, Routes)
│   │   ├── models/                # Mongoose Schemas (User, Job, Application)
│   │   ├── routes/                # Express Routers (auth, jobs, applications, pipeline, ai, analytics)
│   │   ├── controllers/           # Modular route controllers & business logic
│   │   ├── middlewares/           # JWT Authentication & RBAC protection
│   │   ├── lib/                   # db.js, gemini.js, pipeline.js, validations.js, auth.js
│   │   └── __tests__/             # Automated Vitest unit test suite (11/11 tests passing)
│   ├── scripts/                   # Database seeder (seed.cjs)
│   └── package.json
│
├── package.json                   # Root orchestrator (concurrent dev runners)
├── README.md                      # Complete system documentation
└── VIVA_AND_LIVE_CODING_GUIDE.md  # Interview preparation & live-coding defense guide
```

```mermaid
graph TD
    User([User Browser])
    
    subgraph Frontend [Frontend - Port 3000]
        NextApp[Next.js 16 App Router]
        KanbanUI[Recruiter Kanban Board]
        CandidateUI[Candidate Portal]
        AnalyticsUI[KPI Funnel Dashboard]
    end

    subgraph Backend [Backend - Port 5000]
        ExpressServer[Express.js Server]
        AuthRoute["/api/auth (JWT & Google OAuth)"]
        JobsRoute["/api/jobs (CRUD & Filters)"]
        AppRoute["/api/applications (Screening)"]
        PipelineRoute["/api/pipeline (State Machine)"]
        AiRoute["/api/ai/evaluate (Gemini Engine)"]
        AnalyticsRoute["/api/analytics (KPI Math)"]
        
        StateMachine[Pipeline State Machine Engine]
        ZodValidator[Zod Schema Validation]
    end

    subgraph Persistence [Cloud & External Services]
        MongoAtlas[(MongoDB Atlas Database)]
        GeminiAPI[Google Gemini 3.8 Flash API]
        GoogleOAuth[Google OAuth 2.0 Identity]
    end

    User --> NextApp
    NextApp --> ExpressServer
    ExpressServer --> StateMachine
    ExpressServer --> ZodValidator
    ExpressServer --> MongoAtlas
    ExpressServer --> GeminiAPI
    ExpressServer --> GoogleOAuth
```

---

## 3. Core Implementation Details (100 Marks Rubric)

### A. Frontend & User Experience (15 Marks)
* **Design System**: Hand-crafted modern dark-mode aesthetic with custom CSS variables, glassmorphic card containers (`backdrop-filter: blur(16px)`), and curated gradient accents (`#6366f1` to `#a855f7`).
* **Loading & Skeleton States**: Smooth animated shimmering skeletons while fetching job listings, applications, and analytics metrics.
* **Success & Error Notification System**: Global floating Toast notification provider supporting `success`, `error`, `warning`, and `info` alerts with auto-dismiss timers.
* **Responsive Layout**: Designed for mobile and desktop screens with dynamic drawers and responsive CSS grid.
* **1-Click Reviewer Switcher**: Navbar presets allowing instant zero-click toggling between **Recruiter (Sarah Jenkins)** and **Candidate (Alex Rivera)** personas.

### B. Backend APIs & CRUD (20 Marks)
* Standalone Express.js REST API on port 5000:
  * `POST /api/auth/register` — Validates input via Zod, hashes password with Bcrypt, returns JWT.
  * `POST /api/auth/login` — Authenticates credentials, sets secure HTTP-only session cookie.
  * `GET /api/auth/me` & `DELETE /api/auth/me` — Session check and logout.
  * `GET /api/auth/google` & `GET /api/auth/callback/google` — Google OAuth 2.0 flow.
  * `GET /api/jobs` — Multi-facet search (title, department, skills) and filters (type, experience level).
  * `POST /api/jobs` — Protected endpoint for recruiters/admins to publish new job vacancies.
  * `GET /api/jobs/:id` & `PUT /api/jobs/:id` & `DELETE /api/jobs/:id` — Full CRUD operations.
  * `POST /api/applications` — Submits candidate application and automatically triggers Gemini AI evaluation.
  * `GET /api/applications` — Role-scoped (candidates see their own, recruiters see applicants for their jobs).
  * `PATCH /api/pipeline` — Updates candidate pipeline stage with state-machine validation and audit history.
  * `POST /api/ai/evaluate` — On-demand re-evaluation of resumes using Gemini 3.8 Flash.
  * `GET /api/analytics` — Computes recruitment conversion rates, salary variances, and stage distributions.

### C. Business Logic & Calculations (20 Marks)
1. **Pipeline State Machine**:
   * Enforces legal hiring workflows through `canTransitionStage(from, to)`.
   * Candidates cannot jump illegally (e.g., `APPLIED` straight to `OFFERED` without passing through screening and interview stages).
   * Maintains an audit trail (`stageHistory`) logging timestamps, recruiter ID, and transition notes.
2. **Candidate Composite Fit Index**:
   * Algorithmic multi-factor candidate scoring:
     $$\text{Composite Fit} = (\text{AI Score} \times 0.60) + (\text{Experience Match} \times 0.25) + (\text{Budget Fit} \times 0.15)$$
   * Categorizes candidates into actionable tiers: `Top Tier` ($\ge 85$), `Strong Match` ($\ge 70$), `Potential Fit` ($\ge 50$), and `High Risk` ($< 50$).

### D. AI & Machine Learning Integration (15 Marks)
* **Model**: Google Gemini 3.8 Flash (`models/gemini-3.8-flash`).
* **Semantic Analysis**: Analyzes resume content against job title, seniority, and required technical competencies.
* **Structured Output**: Strictly parsed JSON returning:
  * `score` (0-100 numerical fit score)
  * `matchedSkills` (verified competencies)
  * `missingSkills` (skill gaps)
  * `summary` (concise recruiter assessment)
  * `interviewQuestions` (3-5 targeted technical questions)
* **Resilient Heuristic Fallback**: An internal NLP engine provides graceful degradation if external AI quotas or offline states occur.

### E. Authentication, Security & Data Persistence (10 Marks)
* **Authentication**: Password hashing with Bcrypt + stateless JWT signed sessions in HTTP-only cookies.
* **Google OAuth 2.0**: Native authorization code flow.
* **Role-Based Access Control (RBAC)**: Clear role boundaries: `CANDIDATE`, `RECRUITER`, and `ADMIN`.
* **Database & Integrity**: MongoDB Atlas multi-shard replicaSet with compound unique index `{ jobId: 1, candidateId: 1 }` preventing duplicate applications.

---

## 4. Automated Testing & Code Quality (10 Marks)

The backend includes a comprehensive unit testing suite using **Vitest** verifying critical business logic and security schemas:

```bash
npm test
```

### Test Suite Coverage (11/11 Passing):
* `canTransitionStage`: Validates legal forward transitions (`APPLIED` $\rightarrow$ `UNDER_REVIEW`, `SHORTLISTED` $\rightarrow$ `INTERVIEW_SCHEDULED`, etc.).
* `canTransitionStage`: Verifies illegal stage skips (e.g. `APPLIED` directly to `OFFERED` is strictly rejected).
* `canTransitionStage`: Rejection audit and reconsideration workflows.
* `calculateCandidateFitIndex`: Top Tier candidate rating calculations with experience and budget parameters.
* `calculateCandidateFitIndex`: High Risk candidate penalties for seniority deficits.
* `computePipelineAnalytics`: Stage counts and conversion percentage aggregations.
* `runHeuristicEvaluation`: NLP skill extraction and gap detection.
* `RegisterSchema`: Rejection of invalid email formats.
* `RegisterSchema`: Enforcing 6-character password security.
* `ApplyJobSchema`: Validation of application input requirements.

---

## 5. Quick Start & Execution Guide

### Prerequisites
* **Node.js**: v20+ or v24+
* **npm**: v10+ or v11+
* **Git**

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sojibahmedshorif25-ai/NT-TECH-INNOVATION.git
   cd NT-TECH-INNOVATION
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   Create `.env` in `backend/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://sojibahmedshorif25_db_user:sFNxVUNWptvibS1e@cluster0.bmhttkc.mongodb.net/smarthire?retryWrites=true&w=majority
   JWT_SECRET=smarthire_super_secret_jwt_key_2026_secure
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_CLIENT_ID=53349518913-km2kfqhv467aq1d2o62l7hj8g3okcvvt.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:3000
   ```

4. **Seed Database:**
   ```bash
   npm run seed
   ```

5. **Run Unit Tests:**
   ```bash
   npm test
   ```

6. **Start Frontend & Backend Concurrently:**
   ```bash
   npm run dev
   ```
   * **Frontend Application**: [http://localhost:3000](http://localhost:3000)
   * **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 6. Demo Credentials for Reviewers

| Role | Email | Password | Pre-seeded Features |
| :--- | :--- | :--- | :--- |
| **Recruiter / Admin** | `admin@smarthire.com` | `admin123` | Pipeline Kanban, Post Job, Analytics Funnel, Advance Candidates, AI Re-evaluations |
| **Candidate** | `candidate@smarthire.com` | `user123` | 1-Click Apply, Track Stage in My Applications, Review Gemini Fit Feedback |

*(Note: Reviewers can also use the **"⚡ Instant Review Mode"** buttons at the top of the homepage or navbar for zero-friction 1-click login!)*

---

## 7. Author
* **Developer:** Sojib Ahmed  
* **Assessment:** NT Tech Innovation Full Stack Developer Practical Assessment  
* **Submission Date:** October 2026
