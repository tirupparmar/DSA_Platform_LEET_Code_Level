'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Target, Code2, Trophy, ArrowRight, TrendingUp, Zap, CheckCircle2, Clock } from 'lucide-react';

// Generate a fake contribution heatmap
function generateHeatmap() {
  const weeks = 20;
  const days = 7;
  return Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => Math.floor(Math.random() * 5))
  );
}

const heatmapData = generateHeatmap();
const intensityClass = (v: number) => {
  if (v === 0) return 'bg-dark-800';
  if (v === 1) return 'bg-brand-900/60';
  if (v === 2) return 'bg-brand-700/70';
  if (v === 3) return 'bg-brand-600';
  return 'bg-brand-400';
};

const RECENT_ACTIVITY = [
  { title: 'Two Sum', status: 'ACCEPTED', language: 'Python', time: '2h ago', difficulty: 'EASY' },
  { title: 'Binary Search', status: 'ACCEPTED', language: 'JavaScript', time: '1d ago', difficulty: 'EASY' },
  { title: 'Three Sum', status: 'WRONG_ANSWER', language: 'Python', time: '2d ago', difficulty: 'MEDIUM' },
  { title: 'Longest Substring', status: 'ACCEPTED', language: 'Java', time: '3d ago', difficulty: 'MEDIUM' },
];

const RECOMMENDED = [
  { slug: 'valid-anagram', title: 'Valid Anagram', difficulty: 'EASY', category: 'Strings', reason: 'Similar to Two Sum' },
  { slug: 'contains-duplicate', title: 'Contains Duplicate', difficulty: 'EASY', category: 'Arrays', reason: 'Builds on hash maps' },
  { slug: 'number-of-islands', title: 'Number of Islands', difficulty: 'MEDIUM', category: 'Graphs', reason: 'Next in your path' },
];

export function DashboardClient() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'Coder';

  const stats = [
    { icon: Code2, label: 'Solved', value: '3', sub: 'of 500', color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { icon: Flame, label: 'Streak', value: '4', sub: 'days', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: Trophy, label: 'XP', value: '750', sub: 'points', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Target, label: 'Rank', value: '#1.2k', sub: 'global', color: 'text-accent-cyan', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-extrabold text-white mb-1">
          Welcome back, <span className="gradient-text">{name}!</span> 👋
        </h1>
        <p className="text-dark-400">You&apos;re on a 4-day streak. Keep it going!</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={22} className={s.color} />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">{s.value}</div>
              <div className="text-dark-400 text-xs">{s.label} <span className="text-dark-600">· {s.sub}</span></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-400" /> Activity
            </h2>
            <span className="text-dark-500 text-sm">Last 20 weeks</span>
          </div>
          {/* Heatmap grid */}
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((day, di) => (
                  <div key={di} title={`${day} submissions`}
                    className={`w-3 h-3 rounded-sm ${intensityClass(day)} cursor-pointer hover:ring-1 hover:ring-brand-500/50 transition-all`} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-dark-500">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(v => <div key={v} className={`w-2.5 h-2.5 rounded-sm ${intensityClass(v)}`} />)}
            <span>More</span>
          </div>
        </motion.div>

        {/* Progress by category */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="card p-5">
          <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-accent-cyan" /> Topic Progress
          </h2>
          <div className="space-y-4">
            {[
              { topic: 'Arrays', solved: 3, total: 12 },
              { topic: 'Graphs', solved: 0, total: 15 },
              { topic: 'Trees', solved: 0, total: 10 },
              { topic: 'DP', solved: 0, total: 18 },
              { topic: 'Strings', solved: 0, total: 8 },
            ].map(({ topic, solved, total }) => (
              <div key={topic}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-dark-300 font-medium">{topic}</span>
                  <span className="text-dark-500">{solved}/{total}</span>
                </div>
                <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all"
                    style={{ width: `${(solved / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent submissions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-dark-400" /> Recent Submissions
            </h2>
            <Link href="/problems" className="text-brand-400 hover:text-brand-300 text-sm transition-colors flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-dark-800 last:border-0">
                {a.status === 'ACCEPTED'
                  ? <CheckCircle2 size={15} className="text-brand-500 shrink-0" />
                  : <div className="w-3.5 h-3.5 rounded-full border-2 border-red-500/60 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <div className="text-dark-200 text-sm font-medium truncate">{a.title}</div>
                  <div className="text-dark-500 text-xs">{a.language} · {a.time}</div>
                </div>
                <span className={`text-xs font-semibold ${a.status === 'ACCEPTED' ? 'text-brand-400' : 'text-red-400'}`}>
                  {a.status === 'ACCEPTED' ? 'AC' : 'WA'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended problems */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white flex items-center gap-2">
              <Target size={18} className="text-accent-purple" /> Recommended
            </h2>
          </div>
          <div className="space-y-3">
            {RECOMMENDED.map((p, i) => (
              <Link key={i} href={`/problems/${p.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="text-dark-200 text-sm font-medium group-hover:text-white transition-colors truncate">{p.title}</div>
                  <div className="text-dark-500 text-xs mt-0.5">{p.reason}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs ${p.difficulty === 'EASY' ? 'badge-easy' : p.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'}`}>
                    {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}
                  </span>
                  <ArrowRight size={14} className="text-dark-600 group-hover:text-dark-300 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          <Link href="/problems" className="btn-secondary w-full justify-center mt-4 text-sm py-2.5">
            Browse All Problems
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
