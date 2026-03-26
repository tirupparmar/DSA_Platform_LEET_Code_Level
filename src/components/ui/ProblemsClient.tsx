'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle2, Circle, Clock, Zap, ChevronRight } from 'lucide-react';

const PROBLEMS = [
  { id: '1', slug: 'two-sum', title: 'Two Sum', difficulty: 'EASY', category: 'Arrays', tags: ['array', 'hash-map'], acceptance: 49, solved: true },
  { id: '2', slug: 'best-time-to-buy-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'EASY', category: 'Arrays', tags: ['array', 'greedy'], acceptance: 54, solved: true },
  { id: '3', slug: 'contains-duplicate', title: 'Contains Duplicate', difficulty: 'EASY', category: 'Arrays', tags: ['array', 'hash-set'], acceptance: 61, solved: false },
  { id: '4', slug: 'valid-anagram', title: 'Valid Anagram', difficulty: 'EASY', category: 'Strings', tags: ['string', 'hash-map'], acceptance: 63, solved: false },
  { id: '5', slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'EASY', category: 'Stack', tags: ['stack', 'string'], acceptance: 40, solved: false },
  { id: '6', slug: 'longest-substring-without-repeating', title: 'Longest Substring Without Repeating Characters', difficulty: 'MEDIUM', category: 'Sliding Window', tags: ['string', 'hash-map', 'sliding-window'], acceptance: 33, solved: false },
  { id: '7', slug: 'three-sum', title: '3Sum', difficulty: 'MEDIUM', category: 'Two Pointers', tags: ['array', 'two-pointers', 'sorting'], acceptance: 32, solved: false },
  { id: '8', slug: 'binary-search', title: 'Binary Search', difficulty: 'EASY', category: 'Binary Search', tags: ['array', 'binary-search'], acceptance: 55, solved: true },
  { id: '9', slug: 'linked-list-cycle', title: 'Linked List Cycle', difficulty: 'EASY', category: 'Linked Lists', tags: ['linked-list', 'two-pointers'], acceptance: 45, solved: false },
  { id: '10', slug: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'EASY', category: 'Linked Lists', tags: ['linked-list', 'recursion'], acceptance: 73, solved: false },
  { id: '11', slug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', difficulty: 'EASY', category: 'Linked Lists', tags: ['linked-list', 'recursion'], acceptance: 62, solved: false },
  { id: '12', slug: 'maximum-depth-binary-tree', title: 'Maximum Depth of Binary Tree', difficulty: 'EASY', category: 'Trees', tags: ['tree', 'dfs', 'recursion'], acceptance: 73, solved: false },
  { id: '13', slug: 'number-of-islands', title: 'Number of Islands', difficulty: 'MEDIUM', category: 'Graphs', tags: ['graph', 'dfs', 'bfs', 'matrix'], acceptance: 57, solved: false },
  { id: '14', slug: 'clone-graph', title: 'Clone Graph', difficulty: 'MEDIUM', category: 'Graphs', tags: ['graph', 'dfs', 'bfs', 'hash-map'], acceptance: 53, solved: false },
  { id: '15', slug: 'course-schedule', title: 'Course Schedule', difficulty: 'MEDIUM', category: 'Graphs', tags: ['graph', 'topological-sort', 'dfs'], acceptance: 45, solved: false },
  { id: '16', slug: 'network-delay-time', title: 'Network Delay Time', difficulty: 'MEDIUM', category: 'Graphs', tags: ['graph', 'dijkstra', 'shortest-path'], acceptance: 52, solved: false, hasSimulation: true },
  { id: '17', slug: 'coin-change', title: 'Coin Change', difficulty: 'MEDIUM', category: 'Dynamic Programming', tags: ['dp', 'array', 'bfs'], acceptance: 41, solved: false },
  { id: '18', slug: 'longest-common-subsequence', title: 'Longest Common Subsequence', difficulty: 'MEDIUM', category: 'Dynamic Programming', tags: ['dp', 'string'], acceptance: 56, solved: false },
  { id: '19', slug: 'word-break', title: 'Word Break', difficulty: 'MEDIUM', category: 'Dynamic Programming', tags: ['dp', 'trie', 'string'], acceptance: 45, solved: false },
  { id: '20', slug: 'median-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'HARD', category: 'Binary Search', tags: ['array', 'binary-search', 'divide-conquer'], acceptance: 38, solved: false },
  { id: '21', slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'HARD', category: 'Two Pointers', tags: ['array', 'two-pointers', 'stack'], acceptance: 57, solved: false },
  { id: '22', slug: 'serialize-deserialize-binary-tree', title: 'Serialize and Deserialize Binary Tree', difficulty: 'HARD', category: 'Trees', tags: ['tree', 'dfs', 'bfs', 'design'], acceptance: 54, solved: false },
];

const CATEGORIES = ['All', 'Arrays', 'Strings', 'Stack', 'Sliding Window', 'Two Pointers', 'Binary Search', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];
const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD'];

function DiffBadge({ d }: { d: string }) {
  if (d === 'EASY') return <span className="badge-easy">Easy</span>;
  if (d === 'MEDIUM') return <span className="badge-medium">Medium</span>;
  return <span className="badge-hard">Hard</span>;
}

export function ProblemsClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => PROBLEMS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase()));
    const matchCat = category === 'All' || p.category === category;
    const matchDiff = difficulty === 'All' || p.difficulty === difficulty;
    const matchStatus = statusFilter === 'All' || (statusFilter === 'Solved' ? p.solved : !p.solved);
    return matchSearch && matchCat && matchDiff && matchStatus;
  }), [search, category, difficulty, statusFilter]);

  const solved = PROBLEMS.filter(p => p.solved).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-extrabold text-white mb-2">Problems</h1>
        <p className="text-dark-400">
          {solved}/{PROBLEMS.length} solved · Practice your way to the top
        </p>
        <div className="mt-4 h-2 bg-dark-800 rounded-full overflow-hidden w-full max-w-xs">
          <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all" style={{ width: `${(solved / PROBLEMS.length) * 100}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search problems or tags..."
            className="input pl-9 py-2 text-sm" />
        </div>

        {/* Difficulty */}
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
          className="input py-2 text-sm w-auto cursor-pointer">
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
        </select>

        {/* Status */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="input py-2 text-sm w-auto cursor-pointer">
          {['All', 'Solved', 'Unsolved'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              category === cat
                ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                : 'bg-dark-800 border-dark-700 text-dark-400 hover:border-dark-600 hover:text-dark-200'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700 bg-dark-900">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-dark-400 uppercase tracking-wider w-8">#</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-dark-400 uppercase tracking-wider">Difficulty</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Acceptance</th>
              <th className="w-10 px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem, i) => (
              <motion.tr key={problem.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors group">
                <td className="px-5 py-4">
                  {problem.solved
                    ? <CheckCircle2 size={16} className="text-brand-500" />
                    : <Circle size={16} className="text-dark-600" />}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <Link href={`/problems/${problem.slug}`}
                      className="font-medium text-dark-100 hover:text-brand-300 transition-colors text-sm">
                      {problem.title}
                    </Link>
                    {(problem as any).hasSimulation && (
                      <span className="flex items-center gap-1 text-xs bg-accent-cyan/10 text-accent-cyan border border-cyan-500/20 px-1.5 py-0.5 rounded-md">
                        <Zap size={10} /> Sim
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {problem.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag text-xs py-0">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-dark-400 text-sm">{problem.category}</span>
                </td>
                <td className="px-5 py-4">
                  <DiffBadge d={problem.difficulty} />
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-dark-400 text-sm">{problem.acceptance}%</span>
                </td>
                <td className="px-5 py-4">
                  <ChevronRight size={16} className="text-dark-600 group-hover:text-dark-300 transition-colors" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-500">
            <Search size={32} className="mx-auto mb-3 opacity-30" />
            No problems match your filters
          </div>
        )}
      </div>

      <div className="mt-4 text-dark-500 text-sm text-right">
        Showing {filtered.length} of {PROBLEMS.length} problems
      </div>
    </div>
  );
}
