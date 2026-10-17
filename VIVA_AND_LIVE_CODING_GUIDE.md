# SmartHire AI — Live Review, Viva & Technical Defense Guide

> **Candidate:** Sojib Ahmed  
> **Target Role:** Full Stack Developer  
> **Company:** NT Tech Innovation  
> **Evaluation Focus:** Live Demonstration, Architecture Defense & Live Coding (10 Marks) + Independence Policy  

---

## 1. The 2-Minute Architecture Pitch (Introduction)

When the review panel asks: *"Can you introduce your project and explain the problem you solved?"*, deliver this concise, structured overview:

> *"Good morning / afternoon. I built **SmartHire AI**, an intelligent talent acquisition and pipeline platform designed to resolve resume screening fatigue and recruiter bottlenecking in technical hiring.*
>
> *I structured the application into a **decoupled full-stack architecture**:*
> 1. * **Frontend (`frontend/`)**: Built with **Next.js 16 (Turbopack)** and **React 19**. It features a dark-mode glassmorphic design system, an interactive 7-stage Kanban pipeline board, candidate application portal, and real-time recruitment KPI analytics.*
> 2. * **Backend (`backend/`)**: Built with **Express.js**, **Mongoose**, and **MongoDB Atlas**. It handles authenticated CRUD operations, input sanitization via **Zod**, and stateless JWT sessions.*
> 3. * **Business Logic Engine**: Governed by a **7-stage recruitment state machine** that enforces operational discipline (`Applied` → `Under Review` → `AI Screened` → `Shortlisted` → `Interview Scheduled` → `Offered` / `Rejected`) and records an immutable audit history.*
> 4. * **AI Resume Screening**: Powered by **Google Gemini 3.8 Flash**, extracting deep technical competencies, missing skill gaps, and generating interview questions in real time, backed by an autonomous **offline heuristic NLP fallback** for 100% platform uptime.*
> 5. * **Testing**: Critical business logic and security schemas are protected by **11 automated unit tests** in Vitest, running in under 10ms.*
>
> *Everything is running live, and I would be delighted to demonstrate the core user workflows and dive into the code."*

---

## 2. Directory Structure & Architecture Map

When asked: *"Walk us through your code organization"*, explain the separation of concerns:

```
NT-TECH-INNOVATION/
│
├── frontend/                          # Client-Side Application (Next.js 16, Port 3000)
│   ├── src/
│   │   ├── app/                       # App Router Pages & Styles
│   │   │   ├── page.tsx               # Homepage: Job listings, search, filters, demo switcher
│   │   │   ├── jobs/[id]/page.tsx     # Dynamic Job Details & 1-click AI resume application
│   │   │   ├── pipeline/page.tsx      # Recruiter 7-column Kanban board with live stage updates
│   │   │   ├── my-applications/       # Candidate portal: Stage tracker & Gemini AI report
│   │   │   ├── analytics/page.tsx     # Recruitment KPI dashboard (conversion rates, funnel)
│   │   │   ├── docs/page.tsx          # In-app architecture & ERD specification
│   │   │   ├── login/ & register/     # Google OAuth 2.0 and credential authentication
│   │   │   └── globals.css            # Custom CSS tokens, glassmorphic styling, dark theme
│   │   ├── components/                # Modular UI: Navbar, JobCard, ApplicationModal, AIMatchModal
│   │   ├── context/                   # React State: AuthContext (sessions) & ToastContext (alerts)
│   │   └── lib/pipeline.ts            # Client pipeline types & state machine transitions
│   └── next.config.ts                 # API proxy rewrites: /api/* -> http://localhost:5000/api/*
│
├── backend/                           # Server-Side Application (Express.js, Port 5000)
│   ├── src/
│   │   ├── server.js                  # Express setup (CORS, Cookie Parser, route registration)
│   │   ├── models/                    # Mongoose Schemas (User.js, Job.js, Application.js)
│   │   ├── routes/                    # Modular Express routes (auth, jobs, applications, pipeline, ai)
│   │   ├── controllers/               # Controller logic executing business rules
│   │   ├── middlewares/               # JWT token verification & RBAC authorization
│   │   ├── lib/                       # Core modules: db.js, gemini.js, pipeline.js, validations.js, auth.js
│   │   └── __tests__/                 # Vitest automated unit test suite (11/11 passing)
│   ├── scripts/seed.cjs               # MongoDB Atlas database seeder
│   └── package.json
│
├── package.json                       # Root script orchestrator (concurrent runners)
├── README.md                          # 100-mark assessment documentation
└── VIVA_AND_LIVE_CODING_GUIDE.md      # Live review and technical defense guide
```

---

## 3. High-Frequency Technical Questions & Answers

### Q1: How did you design your database and ensure data integrity?
**Answer:**
> *"I used MongoDB Atlas with Mongoose ODM to model three core entities: `User`, `Job`, and `Application`.*
> * * **Relationships**: A Recruiter `User` has a 1-to-many relationship with `Job`. Each `Job` has a 1-to-many relationship with `Application`. Each `Application` references both `jobId` and `candidateId`.*
> * * **Data Integrity**: I enforced a **compound unique index** on `{ jobId: 1, candidateId: 1 }` in the `Application` schema. This prevents duplicate applications for the same position at the database engine level, avoiding race conditions.*
> * * **Audit Logging**: Every stage transition appends an immutable record into `stageHistory` with the timestamp, acting recruiter, and optional notes.*

---

### Q2: Explain your business logic workflow and state machine.
**Answer:**
> *"Recruitment pipelines require strict operational discipline. In `backend/src/lib/pipeline.js`, I implemented the `canTransitionStage(from, to)` state machine.*
> * * Candidates cannot skip stages arbitrarily—for example, moving directly from `APPLIED` to `OFFERED` is rejected with a 400 Bad Request.*
> * * Valid forward flow: `APPLIED` → `UNDER_REVIEW` → `AI_SCREENED` → `SHORTLISTED` → `INTERVIEW_SCHEDULED` → `OFFERED`.*
> * * Any active stage may transition to `REJECTED`. Reopening a rejected candidate back to `UNDER_REVIEW` is permitted for dispute resolution.*
> * * This logic is verified by 4 dedicated automated unit tests."*

---

### Q3: How does the AI resume evaluation work, and how do you handle downtime or hallucinations?
**Answer:**
> *"I integrated Google's **Gemini 3.8 Flash** model (`models/gemini-3.8-flash`) via their REST API:*
> 1. * **Prompt Engineering**: The prompt injects the candidate's resume, years of experience, and salary expectation against the target job requirements.*
> 2. * **Deterministic Schema**: I enforce structured output using `responseMimeType: 'application/json'` and low temperature (`0.2`) to prevent hallucinated formats.*
> 3. * **Outputs**: Returns a 0-100 numerical fit score, verified matched skills, missing skill gaps, qualitative evaluation summary, and 3-5 technical interview questions.*
> 4. * **Resilient Heuristic Fallback**: If an external network timeout or API rate limit occurs, the service seamlessly switches to an internal **NLP Heuristic Engine** (`runHeuristicEvaluation`), which performs skill keyword tokenization and experience scoring so the application never fails."*

---

### Q4: How is security, authentication, and authorization handled?
**Answer:**
> *"Security is applied at multiple levels:*
> 1. * **Password Security**: Passwords are salted and hashed using **Bcrypt** (10 salt rounds).*
> 2. * **Stateless Session Management**: Authenticated users receive a signed **JWT** stored in a secure, HTTP-only cookie, mitigating XSS token theft.*
> 3. * **OAuth 2.0**: Native Google OAuth 2.0 authorization code flow for secure single sign-on.*
> 4. * **Role-Based Access Control (RBAC)**: Distinct permissions for `CANDIDATE`, `RECRUITER`, and `ADMIN`. Recruiters can post jobs and update candidate stages; candidates can only view and manage their own submissions.*
> 5. * **Input Sanitization**: 100% of mutation payloads are validated using **Zod** schemas before processing."*

---

### Q5: How do the frontend and backend communicate?
**Answer:**
> *"The frontend runs on port 3000 (Next.js) and the backend runs on port 5000 (Express.js). In `frontend/next.config.ts`, I configured an **API rewrite proxy**:*
> ```typescript
> async rewrites() {
>   return [{ source: '/api/:path*', destination: 'http://localhost:5000/api/:path*' }];
> }
> ```
> *This eliminates browser Cross-Origin Resource Sharing (CORS) hurdles, allows transparent cookie forwarding, and lets the frontend make clean relative requests (`/api/jobs`, `/api/auth/me`)."*

---

## 4. Live Coding Challenges (Step-by-Step Recipes)

During the practical assessment, the interviewer may ask you to add a feature or modify logic. Here are exact recipes for common requests:

### Challenge 1: "Add a LinkedIn Profile URL field to the candidate application"

**Step 1 — Update Mongoose Model** (`backend/src/models/Application.js`):
Add the field to `ApplicationSchema`:
```javascript
linkedinUrl: { type: String, trim: true, default: '' },
```

**Step 2 — Update Zod Schema** (`backend/src/lib/validations.js`):
Add validation to `ApplyJobSchema`:
```javascript
linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
```

**Step 3 — Update Application Modal** (`frontend/src/components/ApplicationModal.tsx`):
Add state and input:
```tsx
const [linkedinUrl, setLinkedinUrl] = useState('');

// In JSX:
<input
  type="url"
  placeholder="https://linkedin.com/in/username"
  value={linkedinUrl}
  onChange={(e) => setLinkedinUrl(e.target.value)}
  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
/>
```
*Total execution time: ~90 seconds.*

---

### Challenge 2: "Add a new stage 'BACKGROUND_CHECK' to the recruitment pipeline"

**Step 1 — Update Backend State Machine** (`backend/src/lib/pipeline.js`):
Add `BACKGROUND_CHECK` to `PIPELINE_STAGES` and `ALLOWED_TRANSITIONS`:
```javascript
export const PIPELINE_STAGES = [
  'APPLIED',
  'UNDER_REVIEW',
  'AI_SCREENED',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'BACKGROUND_CHECK', // <-- Add here
  'OFFERED',
  'REJECTED',
];

export const ALLOWED_TRANSITIONS = {
  // ...
  INTERVIEW_SCHEDULED: ['BACKGROUND_CHECK', 'SHORTLISTED', 'REJECTED'],
  BACKGROUND_CHECK: ['OFFERED', 'REJECTED'],
  // ...
};
```

**Step 2 — Update Application Model** (`backend/src/models/Application.js`):
Add `BACKGROUND_CHECK` to the `pipelineStage` enum array.

**Step 3 — Update Frontend State Machine** (`frontend/src/lib/pipeline.ts`):
Mirror the type and transition map. The Kanban board will automatically render the new column!
*Total execution time: ~2 minutes.*

---

### Challenge 3: "Change candidate composite score weighting"

If asked to give more weight to experience over AI match:
Navigate to `backend/src/lib/pipeline.js` line ~66:
```javascript
// Original: AI 60%, Experience 25%, Salary Budget 15%
// const composite = Math.round(normalizedAi * 0.6 + expScore * 0.25 + salaryScore * 0.15);

// Adjusted: AI 40%, Experience 45%, Salary Budget 15%
const composite = Math.round(normalizedAi * 0.4 + expScore * 0.45 + salaryScore * 0.15);
```
Save and run `npm test` to verify.

---

## 5. Live Demonstration Sequence (Step-by-Step Flow)

Follow this 5-minute flow to showcase all 8 criteria of the assessment:

1. **Homepage & Filtering**:
   * Open [http://localhost:3000](http://localhost:3000).
   * Show live job listings loaded from MongoDB Atlas.
   * Demonstrate instant keyword search and employment type filters (Full-Time, Remote, Senior).

2. **Instant Reviewer Switcher**:
   * Click **"Candidate (Alex Rivera)"** in the top banner. Notice the navbar changes to show candidate links (*My Applications*, *Docs*).
   * Click on a job card (*"Senior Full Stack Engineer"*).

3. **Candidate Application with Real-Time AI Evaluation**:
   * Click **"Quick Apply with AI"**.
   * Click **"⚡ Autofill Senior Candidate Sample"**.
   * Click **"Submit & Run AI Screening"**.
   * Highlight the live progress state and the Gemini 3.8 Flash evaluation breakdown (fit score, matched competencies, skill gaps, interview questions).

4. **Candidate Status Tracking**:
   * Navigate to **/my-applications**.
   * Show the candidate's active application with live status badges and viewable AI assessment.

5. **Recruiter Pipeline Kanban Board**:
   * Click **"Recruiter (Sarah Jenkins)"** in the top banner.
   * Navigate to **/pipeline**.
   * Show the 7-stage Kanban columns with candidate cards, composite fit badges, and salary variance indicators.
   * Click **"Advance Stage"** (e.g., move candidate from `AI_SCREENED` to `SHORTLISTED`).
   * Show that illegal skips are disabled by the state machine.

6. **Recruitment Analytics Dashboard**:
   * Navigate to **/analytics**.
   * Show the conversion funnel, interview rates, offer rates, and salary budget distribution.

7. **System Architecture & ERD**:
   * Navigate to **/docs**.
   * Walk the interviewer through the interactive Architecture tab, Pipeline State Machine diagram, Database ERD, and API Reference.

8. **Automated Unit Tests**:
   * Open terminal and run:
     ```bash
     npm test
     ```
   * Show that all 11 unit tests pass in ~8ms.

---

## 6. Pre-Seeded Demo Credentials

| Role | Email | Password | Available Features |
| :--- | :--- | :--- | :--- |
| **Recruiter / Admin** | `admin@smarthire.com` | `admin123` | Pipeline Kanban, Post Jobs, Analytics Dashboard, Advance Candidates, AI Re-evaluations |
| **Candidate** | `candidate@smarthire.com` | `user123` | Job Search, 1-Click Apply, My Applications Tracker, AI Feedback |

*(Zero-friction 1-click persona switching is also available on the website header without typing!)*
