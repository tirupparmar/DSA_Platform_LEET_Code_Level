# AlgoSim — Complete Project Documentation

> Next-generation DSA learning platform with real-world algorithm simulations.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Setup & Installation](#5-setup--installation)
6. [Environment Variables](#6-environment-variables)
7. [Database Schema](#7-database-schema)
8. [API Reference](#8-api-reference)
9. [Free Hosting Guide (Go Live)](#9-free-hosting-guide-go-live)
10. [Feature Roadmap](#10-feature-roadmap)
11. [Contributing](#11-contributing)

---

## 1. Project Overview

**AlgoSim** is a full-stack DSA learning portal that combines:

- **LeetCode-style** problem practice with a Monaco code editor
- **InterviewBit-style** structured learning roadmaps
- **Unique Simulation Mode** — solving DSA problems inside real-world scenarios

### Core Philosophy

Most platforms teach *what* algorithms do. AlgoSim teaches *why* they work by putting them inside living simulations — users run Dijkstra on an Uber delivery map, manage queues as a Starbucks barista, and balance trees as a filesystem.

### Key Features

| Feature | Description |
|---|---|
| Monaco Editor | VS Code-grade editor with IntelliSense for Python, JS, Java, C++, Go |
| Real-life Simulations | 6+ animated scenarios: Uber Delivery, Starbucks Queue, Filesystem Tree |
| Multi-language Execution | Judge0 sandbox integration (50+ languages) |
| AI Hints | Gemini-powered contextual hints without spoilers |
| XP & Streaks | Gamified progression with leaderboards |
| Live Lecture Sync | WebSocket-based teacher→student simulation push |
| Auth | GitHub/Google OAuth + email/password via NextAuth |
| Dashboard | Activity heatmap, topic progress, submission history |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js 14)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Monaco    │  │  Simulation  │  │   Dashboard    │  │
│  │   Editor    │  │   Canvas     │  │   Analytics    │  │
│  │  (React)    │  │  (SVG/WASM)  │  │  (Recharts)    │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│               Next.js API Routes (/api/*)                │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │  /execute    │  │  /auth/*   │  │  /problems/*    │  │
│  │  (Judge0)    │  │ (NextAuth) │  │  (Prisma ORM)   │  │
│  └──────┬───────┘  └─────┬──────┘  └────────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
┌─────────────────┐  ┌─────────────┐  ┌──────────────────┐
│  Judge0 CE      │  │  NextAuth   │  │  PostgreSQL       │
│  (Docker/Cloud) │  │  (JWT/OAuth)│  │  (Neon/Supabase)  │
└─────────────────┘  └─────────────┘  └──────────────────┘
                                              ▲
                                              │
                                       ┌──────┴───────┐
                                       │    Redis      │
                                       │  (Upstash)    │
                                       └──────────────┘
```

### Data Flow: Code Submission

```
User writes code → Monaco Editor
  → POST /api/execute { code, language, problemSlug }
    → Build Judge0 payload
    → POST judge0/submissions?wait=true
      → Run in Docker sandbox (5s timeout, 128MB RAM)
      → Return { stdout, stderr, status, runtime, memory }
    → Compare output vs expected test cases
    → Return structured result
  → Update UI (TestResults component)
  → Save submission to PostgreSQL (if authenticated)
  → Award XP if accepted
```

### WebSocket Architecture (Lecture Sync)

```
Teacher's Browser          Socket.io Server         Student Browsers
      │                          │                        │
      │── emit('push-sim') ─────▶│── broadcast('sim') ──▶│
      │   { state, step }        │   to room:lectureId    │── update canvas
      │                          │                        │
```

---

## 3. Tech Stack

### Frontend

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 14.x | Full-stack React framework (App Router) |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 11.x | Animations (simulation canvas, page transitions) |
| Monaco Editor | 4.x | VS Code-grade code editor |
| Zustand | 4.x | Lightweight state management |
| TanStack Query | 5.x | Server state, caching, background refetch |

### Backend

| Tool | Version | Purpose |
|---|---|---|
| Next.js API Routes | 14.x | REST API (serverless-compatible) |
| NextAuth.js | 4.x | Authentication (GitHub, Google, Credentials) |
| Prisma | 5.x | Type-safe ORM for PostgreSQL |
| bcryptjs | 2.x | Password hashing |

### Code Execution

| Tool | Purpose |
|---|---|
| Judge0 CE | Open-source multi-language sandbox (50+ languages) |
| Docker | Isolated execution containers |
| Pyodide (WASM) | In-browser Python execution (no server needed) |

### Database & Caching

| Tool | Free Tier | Purpose |
|---|---|---|
| PostgreSQL (Neon) | 0.5 GB, unlimited API calls | Primary database |
| Redis (Upstash) | 10,000 commands/day | Session cache, leaderboard, rate limiting |

### Free Hosting

| Service | What it hosts | Free Limit |
|---|---|---|
| Vercel | Next.js app | 100 GB bandwidth, unlimited deploys |
| Neon | PostgreSQL | 0.5 GB storage |
| Upstash | Redis | 10k cmds/day |
| Railway | Judge0 CE | $5 credit/month |
| GitHub Actions | CI/CD | 2000 min/month |

---

## 4. Project Structure

```
algosim/
├── prisma/
│   └── schema.prisma              # Database models
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── execute/route.ts   # Code execution endpoint
│   │   │   ├── problems/route.ts
│   │   │   └── users/register/route.ts
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── problems/
│   │   │   ├── page.tsx           # Problem list
│   │   │   └── [slug]/page.tsx    # Problem workspace
│   │   ├── simulate/
│   │   │   ├── page.tsx           # Simulation gallery
│   │   │   └── [id]/page.tsx      # Individual simulation
│   │   ├── dashboard/page.tsx
│   │   └── leaderboard/page.tsx
│   ├── components/
│   │   ├── editor/
│   │   │   ├── ProblemWorkspace.tsx  # Split-panel editor
│   │   │   ├── ProblemDescription.tsx
│   │   │   └── TestResults.tsx
│   │   ├── simulation/
│   │   │   ├── UberSimulation.tsx    # Dijkstra city map
│   │   │   ├── StarbucksSimulation.tsx
│   │   │   ├── FilesystemSimulation.tsx
│   │   │   └── SimulationsClient.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Providers.tsx
│   │   └── ui/
│   │       ├── HeroSection.tsx
│   │       ├── FeaturesSection.tsx
│   │       ├── SimPreviewSection.tsx
│   │       ├── StatsSection.tsx
│   │       ├── CTASection.tsx
│   │       ├── ProblemsClient.tsx
│   │       ├── DashboardClient.tsx
│   │       └── LeaderboardClient.tsx
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── redis.ts               # Redis client
│   │   └── utils.ts               # Shared utilities
│   ├── hooks/
│   │   ├── useSubmission.ts
│   │   └── useSimulation.ts
│   ├── types/
│   │   └── index.ts               # Shared TypeScript types
│   └── styles/
│       └── globals.css
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. Setup & Installation

### Prerequisites

- Node.js 18+ (`node --version`)
- npm 9+ or pnpm
- Git
- PostgreSQL (local or cloud — Neon recommended)

### Step 1: Clone & Install

```bash
git clone https://github.com/yourusername/algosim.git
cd algosim
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate
- `NEXTAUTH_URL` — `http://localhost:3000` for dev

### Step 3: Set Up Database

```bash
# Push schema to your database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio

# (Optional) Seed with sample problems
node scripts/seed.js
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@algosim.dev` / `demo123`

---

## 6. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Random 32-byte secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | App URL (`http://localhost:3000` in dev) |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth app secret |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth secret |
| `JUDGE0_API_URL` | Optional | Judge0 instance URL |
| `JUDGE0_API_KEY` | Optional | RapidAPI key (for hosted Judge0) |
| `REDIS_URL` | Optional | Redis connection (Upstash format) |
| `GEMINI_API_KEY` | Optional | Google Gemini for AI hints |

### Getting Free OAuth Credentials

**GitHub:**
1. Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

**Google:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials → Create OAuth 2.0 Client
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

---

## 7. Database Schema

### Core Tables

**users** — Platform users
```sql
id            CUID PRIMARY KEY
email         VARCHAR UNIQUE NOT NULL
name          VARCHAR
username      VARCHAR UNIQUE
avatar        VARCHAR
passwordHash  VARCHAR
provider      VARCHAR DEFAULT 'credentials'
totalSolved   INT DEFAULT 0
streak        INT DEFAULT 0
xp            INT DEFAULT 0
level         INT DEFAULT 1
createdAt     TIMESTAMP
```

**problems** — DSA problems
```sql
id            CUID PRIMARY KEY
slug          VARCHAR UNIQUE NOT NULL
title         VARCHAR NOT NULL
description   TEXT NOT NULL
difficulty    ENUM(EASY, MEDIUM, HARD)
category      VARCHAR
tags          VARCHAR[]
starterCode   JSONB   -- { python, javascript, java, cpp }
testCases     JSONB   -- [{ input, expected, hidden }]
solution      TEXT
hints         VARCHAR[]
```

**submissions** — Code submissions
```sql
id            CUID PRIMARY KEY
userId        FK → users
problemId     FK → problems
code          TEXT
language      ENUM(PYTHON, JAVASCRIPT, JAVA, CPP, GO)
status        ENUM(ACCEPTED, WRONG_ANSWER, TIME_LIMIT, ...)
runtime       INT (ms)
memory        INT (KB)
passedTests   INT
totalTests    INT
createdAt     TIMESTAMP
```

**sim_scenarios** — Simulation configurations
```sql
id            CUID PRIMARY KEY
problemId     FK → problems (UNIQUE)
type          ENUM(GRAPH_SHORTEST_PATH, QUEUE_SIMULATION, ...)
title         VARCHAR
config        JSONB  -- nodes, edges, scenario params
```

**sim_save_states** — User simulation progress
```sql
id            CUID PRIMARY KEY
userId        FK → users
scenarioId    FK → sim_scenarios
state         JSONB  -- full simulation state snapshot
step          INT
completed     BOOLEAN
```

---

## 8. API Reference

### POST `/api/execute`

Execute code against test cases.

**Request:**
```json
{
  "code": "def twoSum(nums, target): ...",
  "language": "python",
  "problemSlug": "two-sum",
  "type": "run"
}
```

**Response:**
```json
{
  "status": "ACCEPTED",
  "testResults": [
    { "passed": true, "input": "[2,7,11,15], 9", "expected": "[0,1]" }
  ],
  "runtime": 87,
  "memory": 14200,
  "stdout": "",
  "stderr": ""
}
```

**Status values:** `ACCEPTED`, `WRONG_ANSWER`, `RUNTIME_ERROR`, `COMPILE_ERROR`, `TIME_LIMIT`

### POST `/api/users/register`

Register a new user.

**Request:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secure123" }
```

**Response:** `{ "id": "...", "email": "...", "name": "..." }`

### GET/POST `/api/auth/[...nextauth]`

Standard NextAuth endpoints. Handles OAuth callbacks, session management, JWT tokens.

### GET `/api/problems`

Returns paginated problem list.

**Query params:** `?page=1&limit=20&difficulty=EASY&category=Arrays`

---

## 9. Free Hosting Guide (Go Live)

This section walks you through deploying AlgoSim **completely free** with production-grade infrastructure.

### Step 1: Database — Neon (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → Create account → New Project
2. Copy the **Connection String** (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
3. Set as `DATABASE_URL` in your environment

```bash
# After setting DATABASE_URL, push your schema:
npx prisma db push
```

**Free tier:** 0.5 GB storage, branching, 3 projects

### Step 2: Redis — Upstash (Free)

1. Go to [upstash.com](https://upstash.com) → Create account → Create Database
2. Choose region closest to your Vercel deployment
3. Copy the **Redis URL** (starts with `rediss://`)
4. Set as `REDIS_URL`

**Free tier:** 10,000 commands/day, 256 MB

### Step 3: Code Execution — Judge0 on Railway

**Option A: RapidAPI (easiest, limited free tier)**
1. Go to [rapidapi.com](https://rapidapi.com) → Search "Judge0 CE"
2. Subscribe to free plan (50 requests/day)
3. Set `JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com` and `JUDGE0_API_KEY=your_key`

**Option B: Self-host on Railway (recommended for production)**
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Deploy [judge0/judge0](https://github.com/judge0/judge0) using their docker-compose
3. Railway gives $5/month free credit — enough for Judge0 at low traffic
4. Set `JUDGE0_API_URL=https://your-judge0.railway.app`

### Step 4: Deploy — Vercel (Free)

Vercel is the best host for Next.js (made by the same team).

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from your project root)
vercel

# Set production environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... add all your env vars

# Deploy to production
vercel --prod
```

**Or use the Vercel dashboard:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add environment variables in Settings → Environment Variables
4. Every push to `main` auto-deploys

**Free tier:** 100 GB bandwidth, unlimited serverless functions, custom domains

### Step 5: Domain (Optional, Free)

- **Vercel** gives you `your-project.vercel.app` free
- **Freenom** for free `.tk`/`.ml` domains (limited)
- **Cloudflare** for cheap domains ($8/year for `.dev`)

### Step 6: OAuth for Production

Update your OAuth callback URLs to use your production domain:

**GitHub:** `https://your-app.vercel.app/api/auth/callback/github`
**Google:** `https://your-app.vercel.app/api/auth/callback/google`

Also update `NEXTAUTH_URL=https://your-app.vercel.app`

### Complete Free Stack Summary

```
Your App (algosim.vercel.app)     FREE
  └─ Vercel (Next.js hosting)     FREE — 100GB bandwidth
  └─ Neon (PostgreSQL)            FREE — 0.5GB
  └─ Upstash (Redis)              FREE — 10k cmds/day
  └─ Judge0 on Railway            FREE — $5 credit/month
  └─ GitHub (source control)      FREE
  └─ GitHub Actions (CI/CD)       FREE — 2000 min/month
────────────────────────────────────────────
Total monthly cost:                $0
```

---

## 10. Feature Roadmap

### v1.0 (Current — MVP)
- [x] Landing page with hero, features, simulation previews
- [x] Problem list with filters (difficulty, category, tags, status)
- [x] Monaco editor with multi-language support
- [x] Code execution via Judge0
- [x] Auth (GitHub, Google, email/password)
- [x] Dashboard with heatmap, progress, recommendations
- [x] Uber Delivery simulation (Dijkstra)
- [x] Leaderboard

### v1.1 (Next Sprint)
- [ ] Starbucks Barista simulation (Queue/Stack)
- [ ] Filesystem Explorer simulation (AVL Tree)
- [ ] Maze Runner simulation (BFS/DFS)
- [ ] Problem submission history per user (DB-connected)
- [ ] XP system actually saving to DB
- [ ] Streak calculation

### v1.2 (Growth)
- [ ] AI hints via Gemini API
- [ ] Google Autocomplete simulation (Trie)
- [ ] Sorting Showdown simulation
- [ ] Live Lecture Sync via Socket.io
- [ ] Discussion forum per problem
- [ ] Weekly challenges

### v2.0 (Scale)
- [ ] Company-tagged problems (Google, Amazon, Meta, etc.)
- [ ] Mock interview mode (timed, webcam optional)
- [ ] Team/classroom mode
- [ ] Mobile app (React Native)
- [ ] Problem submissions by community

---

## 11. Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/maze-simulation`
3. Commit with conventional commits: `git commit -m "feat: add maze runner BFS simulation"`
4. Push and open a PR

### Adding a New Simulation

1. Create component in `src/components/simulation/YourSimulation.tsx`
2. Add route in `src/app/simulate/[id]/page.tsx`
3. Add card in `SimulationsClient.tsx`
4. Add `SimScenario` record in the database

### Adding a New Problem

1. Add to the `PROBLEMS` array in `ProblemsClient.tsx` (for now)
2. Add starter code in `ProblemWorkspace.tsx` under `STARTER_CODE`
3. Add test cases in `/api/execute/route.ts` under `TEST_CASES`
4. (Later) Use Prisma to insert into the `problems` table

---

## Quick Reference: Key Commands

```bash
# Development
npm run dev                    # Start dev server on :3000
npm run build                  # Build for production
npm run lint                   # Lint with ESLint

# Database
npx prisma db push             # Push schema (no migrations)
npx prisma migrate dev         # Create and run migration
npx prisma studio              # Open visual DB browser
npx prisma generate            # Regenerate Prisma client

# Deployment
vercel                         # Deploy to preview
vercel --prod                  # Deploy to production
vercel env pull .env.local     # Pull prod env vars locally

# Environment
openssl rand -base64 32        # Generate NEXTAUTH_SECRET
```

---

*Built with ❤️ using Next.js, Tailwind CSS, Framer Motion, Monaco Editor, and Judge0.*
