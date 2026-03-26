'use client';

import { motion } from 'framer-motion';
import { Zap, Globe, Brain, Code2, Trophy, Users, GitBranch, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
    title: 'Real-Life Simulations',
    desc: 'Solve DSA problems inside living, breathing scenarios. Use Dijkstra on an Uber map, manage a Starbucks queue, or balance a filesystem tree.',
  },
  {
    icon: Code2,
    color: 'text-accent-cyan',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'VS Code-grade Editor',
    desc: 'Monaco Editor with IntelliSense, syntax highlighting, and autocomplete for Python, JavaScript, Java, C++, and Go.',
  },
  {
    icon: Brain,
    color: 'text-accent-purple',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'AI-Powered Hints',
    desc: 'Stuck? Get contextual hints powered by Gemini AI that guide your thinking without spoiling the solution.',
  },
  {
    icon: Globe,
    color: 'text-accent-orange',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Multi-Language Execution',
    desc: 'Run code in 10+ languages securely via Judge0 sandboxes. Instant feedback with test cases and edge cases built-in.',
  },
  {
    icon: Trophy,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    title: 'XP & Leaderboards',
    desc: 'Earn XP, level up, maintain streaks, and compete on global and friend leaderboards with weekly challenges.',
  },
  {
    icon: Users,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10 border-brand-500/20',
    title: 'Live Lecture Sync',
    desc: 'Teachers can push simulation states to all students in real-time via WebSockets. Built for classrooms.',
  },
  {
    icon: GitBranch,
    color: 'text-accent-cyan',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Structured Roadmap',
    desc: 'Follow curated learning paths: Arrays → Two Pointers → Sliding Window → DP, with prerequisites tracked.',
  },
  {
    icon: BarChart3,
    color: 'text-accent-purple',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Performance Analytics',
    desc: 'Track runtime percentiles, memory usage, submission history, and weak topic analysis in your dashboard.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-semibold mb-4 uppercase tracking-wider">
            <span className="w-8 h-px bg-brand-500" /> Features <span className="w-8 h-px bg-brand-500" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Everything you need to{' '}
            <span className="gradient-text">ace your interviews</span>
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Built by engineers who failed their first 10 interviews. Designed to build real intuition, not just memorize patterns.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => (
            <motion.div key={feat.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="card card-hover p-6 group cursor-default">
              <div className={`w-11 h-11 rounded-xl border ${feat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feat.icon size={20} className={feat.color} />
              </div>
              <h3 className="font-display font-bold text-white mb-2 text-[0.95rem]">{feat.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
