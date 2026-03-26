<div align="center">
  <h1>⚡ AlgoSim</h1>
  <p><strong>Master DSA with Real-Life Simulations</strong></p>
  <p>The LeetCode alternative that puts algorithms inside Uber maps, coffee queues, and filesystems.</p>
  
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</div>

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/yourusername/algosim.git
cd algosim

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# 4. Set up database
npx prisma db push
node scripts/seed.js

# 5. Run
npm run dev
```

Open http://localhost:3000 · Demo: `demo@algosim.dev` / `demo123`

## 📖 Full Documentation

See [`docs/README.md`](./docs/README.md) for:
- Complete architecture overview
- All environment variables
- Free hosting guide (deploy for $0)
- API reference
- Feature roadmap

## ✨ Features

- **Monaco Editor** — VS Code-grade editor for Python, JS, Java, C++, Go
- **Real Simulations** — Dijkstra on Uber maps, Queue as Starbucks barista, AVL as filesystem
- **Judge0 Execution** — Multi-language sandboxed code runner
- **Auth** — GitHub, Google, email via NextAuth
- **Dashboard** — Activity heatmap, progress tracking, XP system
- **Leaderboard** — Global rankings

## 🌐 Deploy Free

| Service | Purpose | Free Tier |
|---|---|---|
| Vercel | Hosting | Unlimited |
| Neon | PostgreSQL | 0.5 GB |
| Upstash | Redis | 10k cmds/day |
| Railway | Judge0 | $5 credit |

## 📄 License

MIT © AlgoSim Contributors
