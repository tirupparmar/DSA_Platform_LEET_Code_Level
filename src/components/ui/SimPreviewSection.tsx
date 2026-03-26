'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Map, Coffee, FolderTree } from 'lucide-react';

const scenarios = [
  {
    icon: Map,
    color: 'text-brand-400',
    gradient: 'from-brand-500/20 to-brand-500/5',
    tag: 'Graphs',
    title: 'Uber Delivery',
    desc: 'Use Dijkstra\'s algorithm to find the shortest delivery routes on a live city map. Riders move, traffic updates — your algorithm adapts.',
    algo: 'Dijkstra / A*',
    difficulty: 'Medium',
  },
  {
    icon: Coffee,
    color: 'text-accent-orange',
    gradient: 'from-orange-500/20 to-orange-500/5',
    tag: 'Queues & Stacks',
    title: 'Starbucks Barista',
    desc: 'Orders pour in, plates stack up, priority customers jump the queue. Manage your data structures or the coffee shop falls apart.',
    algo: 'BFS / Priority Queue',
    difficulty: 'Easy',
  },
  {
    icon: FolderTree,
    color: 'text-accent-cyan',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    tag: 'Trees',
    title: 'Filesystem Explorer',
    desc: 'Navigate a real directory structure. Drag & drop nodes to balance an AVL tree. Watch rotations happen live as you rebalance.',
    algo: 'AVL / BST',
    difficulty: 'Hard',
  },
];

export function SimPreviewSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/30 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-accent-cyan text-sm font-semibold mb-4 uppercase tracking-wider">
              <span className="w-8 h-px bg-accent-cyan" /> Simulations <span className="w-8 h-px bg-accent-cyan" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white">
              Algorithms in the{' '}
              <span className="text-accent-cyan">real world</span>
            </h2>
          </div>
          <Link href="/simulate" className="btn-secondary shrink-0 gap-2">
            View All Simulations <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {scenarios.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group">
              <Link href={`/simulate/${s.title.toLowerCase().replace(' ', '-')}`}>
                <div className={`card card-hover p-6 bg-gradient-to-br ${s.gradient} border-dark-700 h-full`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-dark-900/50 rounded-2xl flex items-center justify-center">
                      <s.icon size={24} className={s.color} />
                    </div>
                    <div className="flex gap-2">
                      <span className="tag">{s.tag}</span>
                      <span className={`text-xs font-semibold py-0.5 px-2.5 rounded-full 
                        ${s.difficulty === 'Easy' ? 'badge-easy' : s.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                        {s.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-dark-400 text-sm leading-relaxed mb-5">{s.desc}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-dark-500 text-xs">Algorithm:</span>
                      <span className="code-font text-xs text-brand-400">{s.algo}</span>
                    </div>
                    <span className="text-dark-400 group-hover:text-white transition-colors">
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
