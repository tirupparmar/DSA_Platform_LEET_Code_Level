'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Code2, GitBranch } from 'lucide-react';

const codeSnippet = `def dijkstra(graph, start):
    dist = {node: float('inf') 
            for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, u = heappop(pq)
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heappush(pq, (dist[v], v))
    
    return dist  # ✓ Accepted`;

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-brand-400 text-sm font-semibold">Now with Real-Life Simulations</span>
            </motion.div>

            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] mb-6">
              <span className="text-white">Master</span>{' '}
              <span className="gradient-text">DSA</span>
              <br />
              <span className="text-white">the way</span>{' '}
              <span className="text-dark-300">it</span>
              <br />
              <span className="text-white">actually</span>{' '}
              <span className="text-brand-400">works.</span>
            </h1>

            <p className="text-dark-300 text-lg leading-relaxed mb-8 max-w-xl">
              Stop memorizing patterns. <strong className="text-white">AlgoSim</strong> puts algorithms inside real-world simulations — navigate a delivery map with Dijkstra, manage coffee queues with BFS, balance trees like a filesystem.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/problems" className="btn-primary text-base px-6 py-3 gap-2.5 group">
                Start Practicing
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/simulate" className="btn-secondary text-base px-6 py-3 gap-2.5 group">
                <Play size={16} className="text-brand-400 group-hover:scale-110 transition-transform" />
                Watch Simulation
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { value: '500+', label: 'Problems' },
                { value: '12', label: 'Simulations' },
                { value: 'Free', label: 'Forever' },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-display font-bold text-xl text-brand-400">{value}</span>
                  <span className="text-dark-400">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Code card + sim preview */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative">
            {/* Editor card */}
            <div className="card overflow-hidden shadow-card-hover">
              {/* Editor titlebar */}
              <div className="bg-dark-900 border-b border-dark-700 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 flex gap-1">
                  {['Python', 'JavaScript', 'Java'].map((lang, i) => (
                    <div key={lang} className={`px-3 py-0.5 rounded-t text-xs font-mono ${i === 0 ? 'bg-dark-800 text-dark-200 border-t border-x border-dark-600' : 'text-dark-500'}`}>
                      {lang}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                  <span className="text-brand-400 font-mono">Running...</span>
                </div>
              </div>

              {/* Code */}
              <div className="bg-dark-900 p-5">
                <pre className="code-font text-sm leading-6 overflow-x-auto">
                  {codeSnippet.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="text-dark-600 select-none w-8 text-right mr-4 shrink-0">{i + 1}</span>
                      <span className={`${line.includes('def ') ? 'text-accent-purple' : line.includes('#') ? 'text-dark-400 italic' : line.includes('✓') ? 'text-brand-400' : 'text-dark-200'}`}>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Test results */}
              <div className="bg-dark-800 border-t border-dark-700 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Zap size={14} className="text-brand-400" />
                  <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Test Results</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Test 1', 'Test 2', 'Test 3'].map((t, i) => (
                    <div key={t} className="flex items-center gap-1.5 bg-dark-900 rounded-lg px-3 py-2">
                      <span className="text-brand-400 text-xs">✓</span>
                      <span className="text-dark-300 text-xs">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-brand-400 font-semibold">✓ All tests passed</span>
                  <span className="text-dark-400">Runtime: 87ms · Memory: 18.2MB</span>
                </div>
              </div>
            </div>

            {/* Floating sim badge */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 card p-4 flex items-center gap-3 shadow-glow-cyan">
              <div className="w-10 h-10 bg-accent-cyan/15 rounded-xl flex items-center justify-center">
                <GitBranch size={20} className="text-accent-cyan" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Simulation Mode</div>
                <div className="text-xs text-dark-400">Uber Delivery • Dijkstra</div>
              </div>
            </motion.div>

            {/* Floating XP badge */}
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-4 -right-4 card px-4 py-3 flex items-center gap-2 shadow-glow-green">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-xs text-dark-400">XP Earned</div>
                <div className="text-sm font-bold text-brand-400">+250 XP</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
