'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Map, Coffee, FolderTree, Grid, Search, SortAsc, Network, ArrowRight, Lock, Zap } from 'lucide-react';

const SIMULATIONS = [
  {
    id: 'uber-delivery',
    icon: Map,
    color: 'text-brand-400',
    gradient: 'from-brand-500/15 to-transparent',
    glowColor: 'shadow-glow-green',
    tag: 'Graphs',
    title: 'Uber Delivery',
    desc: 'Navigate a city grid. Your riders are at different locations, packages need delivery. Use Dijkstra\'s algorithm to find optimal routes in real-time as traffic conditions update.',
    algorithm: 'Dijkstra / A*',
    difficulty: 'MEDIUM',
    xp: 200,
    status: 'available',
    concepts: ['Shortest Path', 'Priority Queue', 'Greedy'],
  },
  {
    id: 'starbucks-barista',
    icon: Coffee,
    color: 'text-orange-400',
    gradient: 'from-orange-500/15 to-transparent',
    glowColor: '',
    tag: 'Queue & Stack',
    title: 'Starbucks Barista',
    desc: 'Orders pour in from the app, drive-through, and counter. VIP customers jump ahead. Plates stack up. Manage your data structures before the morning rush overwhelms you.',
    algorithm: 'BFS / Priority Queue',
    difficulty: 'EASY',
    xp: 120,
    status: 'available',
    concepts: ['Queue', 'Stack', 'Priority Queue'],
  },
  {
    id: 'filesystem-explorer',
    icon: FolderTree,
    color: 'text-accent-cyan',
    gradient: 'from-cyan-500/15 to-transparent',
    glowColor: 'shadow-glow-cyan',
    tag: 'Trees',
    title: 'Filesystem Explorer',
    desc: 'You\'re building a file system. Drag and drop files into directories. The tree becomes unbalanced and slow. Perform AVL rotations to rebalance it and watch performance metrics update live.',
    algorithm: 'AVL Tree / BST',
    difficulty: 'HARD',
    xp: 350,
    status: 'available',
    concepts: ['BST', 'AVL Rotations', 'Tree Traversal'],
  },
  {
    id: 'maze-runner',
    icon: Grid,
    color: 'text-accent-purple',
    gradient: 'from-purple-500/15 to-transparent',
    glowColor: 'shadow-glow-purple',
    tag: 'Graphs',
    title: 'Maze Runner',
    desc: 'Your character is trapped in a procedurally generated maze. Choose BFS or DFS to find the exit. Watch the exploration frontier expand and see why one works better than the other.',
    algorithm: 'BFS / DFS',
    difficulty: 'EASY',
    xp: 100,
    status: 'available',
    concepts: ['BFS', 'DFS', 'Graph Traversal'],
  },
  {
    id: 'google-autocomplete',
    icon: Search,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/15 to-transparent',
    glowColor: '',
    tag: 'Tries',
    title: 'Google Autocomplete',
    desc: 'Build a search autocomplete system. Words are inserted into a Trie as users type. Watch the prefix tree grow and see how O(k) search time demolishes linear scan.',
    algorithm: 'Trie',
    difficulty: 'MEDIUM',
    xp: 180,
    status: 'coming-soon',
    concepts: ['Trie', 'Prefix Trees', 'String Search'],
  },
  {
    id: 'sorting-visualizer',
    icon: SortAsc,
    color: 'text-brand-300',
    gradient: 'from-brand-500/10 to-transparent',
    glowColor: '',
    tag: 'Sorting',
    title: 'Sorting Showdown',
    desc: 'Race sorting algorithms on the same dataset. Quick Sort, Merge Sort, Heap Sort, and Bubble Sort compete in real time. Bars animate with each comparison and swap.',
    algorithm: 'Multiple',
    difficulty: 'EASY',
    xp: 80,
    status: 'coming-soon',
    concepts: ['Sorting', 'Divide & Conquer', 'Recursion'],
  },
];

export function SimulationsClient() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-flex items-center gap-2 text-accent-cyan text-sm font-semibold mb-4 uppercase tracking-wider">
          <Zap size={14} /> Real-Life Simulations
        </div>
        <h1 className="font-display text-4xl font-extrabold text-white mb-3">
          Algorithms in action
        </h1>
        <p className="text-dark-400 text-lg max-w-2xl">
          Don&apos;t just solve problems — understand why algorithms work by watching them operate in real-world scenarios.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SIMULATIONS.map((sim, i) => (
          <motion.div key={sim.id}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className={`card h-full flex flex-col bg-gradient-to-br ${sim.gradient} border-dark-700 
              ${sim.status === 'coming-soon' ? 'opacity-60' : 'card-hover'} relative overflow-hidden`}>
              {sim.status === 'coming-soon' && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-dark-700 border border-dark-600 rounded-full px-2.5 py-1 text-xs text-dark-400">
                  <Lock size={10} /> Soon
                </div>
              )}

              <div className="p-6 flex-1">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-dark-900/50 rounded-2xl flex items-center justify-center shrink-0">
                    <sim.icon size={24} className={sim.color} />
                  </div>
                  <div>
                    <span className="tag text-xs mb-1 inline-block">{sim.tag}</span>
                    <h3 className="font-display font-bold text-lg text-white leading-tight">{sim.title}</h3>
                  </div>
                </div>

                <p className="text-dark-400 text-sm leading-relaxed mb-4">{sim.desc}</p>

                {/* Concepts */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {sim.concepts.map(c => (
                    <span key={c} className="tag text-xs">{c}</span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-xs text-dark-400">
                    <span className={sim.difficulty === 'EASY' ? 'badge-easy' : sim.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'}>
                      {sim.difficulty.charAt(0) + sim.difficulty.slice(1).toLowerCase()}
                    </span>
                    <span className="text-yellow-400 font-semibold">+{sim.xp} XP</span>
                  </div>
                  <span className="code-font text-xs text-dark-500">{sim.algorithm}</span>
                </div>

                {sim.status === 'available' ? (
                  <Link href={`/simulate/${sim.id}`}
                    className="btn-primary w-full justify-center text-sm py-2.5 gap-2">
                    Launch Simulation <ArrowRight size={15} />
                  </Link>
                ) : (
                  <button disabled className="btn-secondary w-full justify-center text-sm py-2.5 opacity-50 cursor-not-allowed">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
