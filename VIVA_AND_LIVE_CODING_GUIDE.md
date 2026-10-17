# SmartHire AI — Live Review, Viva & Coding Defense Guide

> **Prepared for:** Sojib Ahmed  
> **Position:** Full Stack Developer  
> **Company:** NT Tech Innovation  
> **Assessment Focus:** Live Demonstration & Technical Review (10 Marks) + Independence Policy  

---

## ১. ইন্টারভিউ শুরু করার ২ মিনিটের ভূমিকা (2-Minute Elevator Pitch)

### বাংলায় যেভাবে বলবেন:
> *"আসসালামু আলাইকুম। আমি **SmartHire AI** তৈরি করেছি, যা টেকনিক্যাল রিক্রুটমেন্ট প্রক্রিয়ায় রেজ্যুমি স্ক্রিনিং ফেটিগ এবং অযাচিত সময়ক্ষেপণ দূর করার একটি পূর্ণাঙ্গ ফুল-স্ট্যাক প্ল্যাটফর্ম।  
> সিস্টেমটি সম্পূর্ণভাবে **ডিকাপলড ফ্রন্টএন্ড এবং ব্যাকএন্ড আর্কিটেকচারে (`frontend/` ও `backend/`)** বিভক্ত:
> 
> ১. **ফ্রন্টএন্ড (`frontend/` - Next.js 16, React 19, TypeScript):** পোর্ট ৩০০০-এ রান করে। এতে রয়েছে আধুনিক ডার্ক গ্লাসফরমিক ডিজাইন সিস্টেম, লাইভ জব সার্চ ও ফিল্টারিং, রিক্রুটারের জন্য ৭-ধাপের ইন্টারেক্টিভ কানবান বোর্ড, ক্যান্ডিডেট ট্র্যাকিং পোর্টাল এবং রিক্রুটমেন্ট কেপিআই অ্যানালিটিক্স।  
> ২. **ব্যাকএন্ড (`backend/` - Express.js REST API, Port 5000):** এতে রয়েছে সিকিউর JWT ও Google OAuth ২.০ অথেন্টিকেশন, MongoDB Atlas ডেটাবেস উইথ ইউনিক কম্পাউন্ড ইনডেক্সিং, Zod ইনপুট ভ্যালিডেশন এবং **Google Gemini 3.8 Flash** চালিত রিয়েল-টাইম রেজ্যুমি স্ক্রিনিং ইঞ্জিন।  
> ৩. **বিজনেস লজিক ও সেফটি:** পাইপলাইনে অবৈধ জাম্প রোধে রয়েছে একটি স্ট্রিক্ট স্টেট মেশিন (`Applied` → `Under Review` → `AI Screened` → `Shortlisted` → `Interviewing` → `Offered`) এবং কম্পোজিট ক্যান্ডিডেট ফিট স্কোর অ্যালগরিদম।  
> ৪. সিস্টেমের ক্রিটিক্যাল বিজনেস লজিকের জন্য **১১টি অটোমেটেড ইউনিট টেস্ট** শতভাগ পাস করা অবস্থায় রয়েছে।"*

---

## ২. ফাইল ও ফোল্ডার স্ট্রাকচার (Where is What?)

ইন্টারভিউয়ার যদি বলে: *"আপনার প্রজেক্টের আর্কিটেকচার দেখান"*, আপনি সরাসরি এভাবে ব্যাখ্যা করবেন:

### ক. `frontend/` ফোল্ডার (Next.js 16 Client & UI Layer - Port 3000)
* **`frontend/src/app/`**:
  * `page.tsx`: জব সার্চ, ফিল্টারিং এবং ১-ক্লিক পারসোনা সুইচিং ল্যান্ডিং পেজ।
  * `jobs/[id]/page.tsx`: ডেডিকেটেড জব ডিটেইলস ও সরাসরি AI রেজ্যুমি সাবমিশন মোডাল।
  * `pipeline/page.tsx`: রিক্রুটারদের জন্য ৭-কলামের কানবান বোর্ড যেখানে ক্যান্ডিডেটদের স্টেজ চেঞ্জ করা যায়।
  * `my-applications/page.tsx`: ক্যান্ডিডেটের লাইভ অ্যাপ্লিকেশন স্ট্যাটাস ট্র্যাকার ও AI ফিডব্যাক।
  * `analytics/page.tsx`: রিক্রুটমেন্ট কেপিআই, স্টেজ ডিস্ট্রিবিউশন ও ফানেল মেট্রিক্স।
  * `docs/page.tsx`: ইন-অ্যাপ ৫-ট্যাব আর্কিটেকচার, স্টেট মেশিন ও ERD ডায়াগ্রাম।
  * `login/page.tsx` & `register/page.tsx`: Google OAuth 2.0 বাটন ও ক্রেডেনশিয়াল ফর্ম।
* **`frontend/src/components/`**:
  * `Navbar.tsx`, `JobCard.tsx`, `ApplicationModal.tsx`, `AIMatchModal.tsx`, `Footer.tsx`।
* **`frontend/src/context/`**:
  * `AuthContext.tsx`: ক্লায়েন্ট-সাইড সেশন স্টেট ও ডেমো অ্যাকাউন্ট সুইচিং।
  * `ToastContext.tsx`: গ্লোবাল ফ্লোটিং নোটিফিকেশন সিস্টেম।
* **`frontend/next.config.ts`**:
  * এপিআই প্রক্সি রিরাইট: ফ্রন্টএন্ড থেকে আসা `/api/*` রিকোয়েস্ট ব্যাকএন্ড `http://localhost:5000/api/*`-এ পাঠায় (CORS সমস্যা দূর করে)।

---

### খ. `backend/` ফোল্ডার (Express.js REST API Layer - Port 5000)
* **`backend/src/server.js`**:
  * Express সার্ভার এন্ট্রি পয়েন্ট। CORS, Cookie Parser এবং এপিআই রাউট মাউন্টিং।
* **`backend/src/models/` (Mongoose Schemas)**:
  * `User.js`: ইউজার মডেল (`CANDIDATE`, `RECRUITER`, `ADMIN`), পাসওয়ার্ড হ্যাশ।
  * `Job.js`: জব পোস্টিং, ডিপার্টমেন্ট, স্যালারি রেঞ্জ, স্কিলস অ্যারে।
  * `Application.js`: চাকরির আবেদন, AI ম্যাচ স্কোর, মিসিং স্কিলস এবং `stageHistory` অডিট লগ। এতে `{ jobId: 1, candidateId: 1 }` কম্পাউন্ড ইউনিক ইনডেক্স সেট করা আছে।
* **`backend/src/routes/`**:
  * `auth.js`: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/google`, `/api/auth/callback/google`।
  * `jobs.js`: `/api/jobs` (CRUD ও সার্চ ফিল্টার)।
  * `applications.js`: `/api/applications` (আবেদন সাবমিশন ও রিট্রিভ্যাল)।
  * `pipeline.js`: `/api/pipeline` (ক্যান্ডিডেট স্টেজ ট্রানজিশন)।
  * `ai.js`: `/api/ai/evaluate` (অন-ডিমান্ড Gemini 3.8 Flash ইভ্যালুয়েশন)।
  * `analytics.js`: `/api/analytics` (কেপিআই ম্যাট্রিক্স)।
* **`backend/src/lib/`**:
  * `db.js`: MongoDB Atlas ডাইরেক্ট রেপ্লিকাসেট কানেকশন।
  * `gemini.js`: Google Gemini 3.8 Flash ইন্টিগ্রেশন এবং অফলাইন হিউরিস্টিক এনএলপি ইঞ্জিন।
  * `pipeline.js`: স্টেট মেশিন ভ্যালিডেশন ও ক্যান্ডিডেট কম্পোজিট ফিট স্কোর ফর্মুলা।
  * `validations.js`: Zod স্কিমা দিয়ে ইনপুট স্যানিটাইজেশন।
  * `auth.js`: Bcrypt পাসওয়ার্ড হ্যাশিং এবং JWT টোকেন সাইনিং।
* **`backend/src/__tests__/`**:
  * `pipeline.test.js`: Vitest দিয়ে তৈরি ১১টি অটোমেটেড ইউনিট টেস্ট।
* **`backend/scripts/seed.cjs`**:
  * ডেমো ডেটা সিডার (রিক্রুটার ও ক্যান্ডিডেট অ্যাকাউন্ট সহ)।

---

### গ. রুট ডিরেক্টরি (`/`)
* **`package.json`**:
  * `npm run dev`: `concurrently` দিয়ে ব্যাকএন্ড (5000) এবং ফ্রন্টএন্ড (3000) একসাথে চালু করে।
  * `npm test`: ব্যাকএন্ডের ১১টি ইউনিট টেস্ট রান করে।
  * `npm run seed`: ব্যাকএন্ডের ডেটাবেস সিডার রান করে।

---

## ৩. লাইভ কোডিং চ্যালেঞ্জের জন্য দ্রুত সমাধান ট্রিকস (Live Coding Hacks)

ইন্টারভিউয়ার যদি লাইভ কোডিং করতে বলে:

### সিনারিও ১: "ক্যান্ডিডেট মডেলে LinkedIn প্রোফাইল লিংক ফিল্ড যোগ করুন"
১. `backend/src/models/Application.js` ফাইলে যান:
   ```javascript
   linkedinUrl: { type: String, default: '' },
   ```
২. `backend/src/lib/validations.js` এ `ApplyJobSchema`-তে যোগ করুন:
   ```javascript
   linkedinUrl: z.string().url().optional().or(z.literal('')),
   ```
৩. `frontend/src/components/ApplicationModal.tsx` ফাইলে ইনপুট ফিল্ডটি যুক্ত করুন।

### সিনারিও ২: "পাইপলাইনে একটি নতুন স্টেজ 'BACKGROUND_CHECK' যোগ করুন"
১. `backend/src/models/Application.js` এবং `backend/src/lib/pipeline.js`-এ `PIPELINE_STAGES` অ্যারেতে `'BACKGROUND_CHECK'` যুক্ত করুন।
২. `ALLOWED_TRANSITIONS` ম্যাপে ডিফাইন করুন:
   ```javascript
   INTERVIEW_SCHEDULED: ['BACKGROUND_CHECK', 'OFFERED', 'REJECTED'],
   BACKGROUND_CHECK: ['OFFERED', 'REJECTED'],
   ```
৩. ফ্রন্টএন্ডের `frontend/src/lib/pipeline.ts` ও কানবান বোর্ডে কলামটি অটোমেটিক রেন্ডার হয়ে যাবে!

---

## ৪. সম্ভাব্য টেকনিক্যাল প্রশ্ন ও সেরা উত্তর (Technical Q&A)

### প্রশ্ন ১: আপনি কীভাবে ডেটাবেসে ডেটা ইন্টিগ্রিটি নিশ্চিত করেছেন?
**উত্তর:**
> *"আমরা Mongoose এবং MongoDB Atlas ব্যবহার করেছি। ডেটা ইন্টিগ্রিটির জন্য `Application` কালেকশনে `{ jobId: 1, candidateId: 1 }` কম্পাউন্ড ইউনিক ইনডেক্স সেট করা হয়েছে। এর ফলে একজন প্রার্থী একই জবে দ্বিতীয়বার ডুপ্লিকেট আবেদন করতে পারে না। এছাড়া ডিলিট অপারেশনের ক্ষেত্রে ক্যাসকেডিং হ্যান্ডেল করা হয়।"*

### প্রশ্ন ২: আপনার বিজনেস লজিক স্টেট মেশিন কীভাবে কাজ করে?
**উত্তর:**
> *"রিক্রুটমেন্ট প্রক্রিয়ায় হিউম্যান এরর কমাতে `backend/src/lib/pipeline.js` ফাইলে `canTransitionStage(from, to)` ফাংশন দিয়ে একটি স্টেট মেশিন তৈরি করা হয়েছে। একজন ক্যান্ডিডেট কখনো `APPLIED` থেকে সরাসরি `OFFERED` স্টেজে যেতে পারবে না; তাকে অবশ্যই স্ক্রিনিং ও ইন্টারভিউ স্টেজের মধ্য দিয়ে যেতে হবে। প্রতিটি ট্রানজিশনের সময় টাইমস্ট্যাম্প, রিক্রুটারের আইডি এবং ট্রানজিশন নোট সহ একটি অডিট ট্রেইল `stageHistory` অ্যারেতে সেভ করা হয়।"*

### প্রশ্ন ৩: এআই ইভ্যালুয়েশন কীভাবে কাজ করে এবং API ডাউন থাকলে কী হবে?
**উত্তর:**
> *"আমরা Google-এর লেটেস্ট **Gemini 3.8 Flash** মডেল ব্যবহার করেছি। ক্যান্ডিডেটের রেজ্যুমি এবং জবের রিকোয়ারমেন্টের উপর ভিত্তি করে এআই ০-১০০ স্কোর, ভেরিফাইড স্কিল এবং মিসিং স্কিল প্রদান করে। যদি ব্যবহারকারীর নেটওয়ার্ক বা জেমিনি এপিআই রেট লিমিট শেষ হয়ে যায়, তবে সিস্টেম ক্র্যাশ না করে আমাদের নিজস্ব **Heuristic NLP Engine** ফলব্যাক হিসেবে কাজ করে রেজ্যুমি স্কিল স্ক্রিনিং সম্পন্ন করে।"*

### প্রশ্ন ৪: ফ্রন্টএন্ড এবং ব্যাকএন্ড কীভাবে যোগাযোগ করছে?
**উত্তর:**
> *"ফ্রন্টএন্ড Next.js পোর্ট ৩০০০-এ এবং ব্যাকএন্ড Express.js পোর্ট ৫০০০-এ চলে। `frontend/next.config.ts`-এ এপিআই রিরাইট কনফিগার করা রয়েছে, যার ফলে ফ্রন্টএন্ডের সব `/api/*` কল অটোমেটিক ব্যাকএন্ডে ফরোয়ার্ড হয়। এতে কোনো ব্রাউজার CORS ঝামেলা থাকে না এবং ব্রাউজার কুকিজ ও সেশন নিরাপদে আদান-প্রদান হয়।"*

---

## ৫. ডেমো অ্যাকাউন্ট ক্রেডেনশিয়াল

| ভূমিকা | ইমেইল | পাসওয়ার্ড |
| :--- | :--- | :--- |
| **রিক্রুটার / এডমিন** | `admin@smarthire.com` | `admin123` |
| **ক্যান্ডিডেট** | `candidate@smarthire.com` | `user123` |

*(ওয়েবসাইটের হেডারে থাকা **"⚡ Instant Review Mode"** বাটনে ক্লিক করে কোনো টাইপিং ছাড়াই এক ক্লিকে ডেমো মোডে লগইন করা যায়!)*
