'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Flame, TrendingUp } from 'lucide-react';

const USERS = [
  { rank: 1, name: 'Arjun Sharma', country: '🇮🇳', solved: 312, xp: 48500, streak: 89, badge: '🏆' },
  { rank: 2, name: 'Wei Zhang', country: '🇨🇳', solved: 298, xp: 45200, streak: 62, badge: '🥈' },
  { rank: 3, name: 'Sofia Martinez', country: '🇧🇷', solved: 285, xp: 43100, streak: 44, badge: '🥉' },
  { rank: 4, name: 'Rahul Verma', country: '🇮🇳', solved: 271, xp: 40800, streak: 31, badge: null },
  { rank: 5, name: 'Lena Müller', country: '🇩🇪', solved: 259, xp: 38600, streak: 27, badge: null },
  { rank: 6, name: 'Kai Yamamoto', country: '🇯🇵', solved: 241, xp: 36200, streak: 22, badge: null },
  { rank: 7, name: 'Priya Patel', country: '🇮🇳', solved: 228, xp: 34100, streak: 18, badge: null },
  { rank: 8, name: 'Carlos Silva', country: '🇵🇹', solved: 214, xp: 32000, streak: 15, badge: null },
  { rank: 9, name: 'Emma Johnson', country: '🇺🇸', solved: 198, xp: 29700, streak: 12, badge: null },
  { rank: 10, name: 'Ahmed Hassan', country: '🇪🇬', solved: 187, xp: 28100, streak: 9, badge: null },
];

export function LeaderboardClient() {
  const [tab, setTab] = useState<'global' | 'weekly'>('global');

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
            <Trophy size={32} className="text-yellow-400" /> Leaderboard
          </h1>
          <p className="text-dark-400">Top coders ranked by XP and problems solved</p>
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1">
          {(['global', 'weekly'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-dark-200'
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[USERS[1], USERS[0], USERS[2]].map((user, i) => {
          const heights = ['h-28', 'h-36', 'h-24'];
          const colors = ['text-gray-300', 'text-yellow-400', 'text-orange-400'];
          const podiumColors = ['bg-gray-500/20 border-gray-500/30', 'bg-yellow-500/20 border-yellow-500/30', 'bg-orange-500/20 border-orange-500/30'];
          return (
            <motion.div key={user.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`card ${podiumColors[i]} p-5 text-center flex flex-col items-center justify-end ${heights[i]}`}>
              <div className="text-2xl mb-1">{user.badge ?? `#${user.rank}`}</div>
              <div className="font-display font-bold text-white text-sm">{user.name.split(' ')[0]}</div>
              <div className={`font-bold text-xs ${colors[i]}`}>{user.xp.toLocaleString()} XP</div>
              <div className="text-dark-500 text-xs">{user.solved} solved</div>
            </motion.div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700 bg-dark-900">
              <th className="text-left px-5 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider w-16">Rank</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Solved</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Streak</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">XP</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user, i) => (
              <motion.tr key={user.rank}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`border-b border-dark-800 hover:bg-dark-800/40 transition-colors ${user.rank <= 3 ? 'bg-dark-800/20' : ''}`}>
                <td className="px-5 py-4">
                  {user.rank <= 3
                    ? <span className="text-lg">{user.badge}</span>
                    : <span className="text-dark-400 font-mono text-sm">#{user.rank}</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-sm font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-dark-100 text-sm">{user.name}</div>
                      <div className="text-dark-500 text-xs">{user.country}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-dark-300 text-sm font-mono">{user.solved}</span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="flex items-center gap-1 text-orange-400 text-sm">
                    <Flame size={13} /> {user.streak}d
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-brand-400 font-bold text-sm">{user.xp.toLocaleString()}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
