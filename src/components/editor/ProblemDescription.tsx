'use client';

import { CheckCircle2, XCircle, Clock, Database, Loader2, AlertTriangle } from 'lucide-react';

interface Problem {
  title: string;
  difficulty: string;
  category: string;
  tags: string[];
  description: string;
}

export function ProblemDescription({ problem }: { problem: Problem }) {
  return (
    <div>
      {/* Problem header */}
      <div className="mb-5 pb-5 border-b border-dark-700">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-semibold py-0.5 px-2.5 rounded-full ${
            problem.difficulty === 'EASY' ? 'badge-easy' :
            problem.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'
          }`}>
            {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
          </span>
          <span className="tag">{problem.category}</span>
        </div>
        <h1 className="font-display text-xl font-bold text-white mb-2">{problem.title}</h1>
        <div className="flex gap-1.5 flex-wrap">
          {problem.tags?.map((tag: string) => (
            <span key={tag} className="tag text-xs">{tag}</span>
          ))}
        </div>
      </div>

      {/* Description (rendered as simple markdown-ish) */}
      <div className="prose-dark text-sm" dangerouslySetInnerHTML={{
        __html: problem.description
          .replace(/## (.+)/g, '<h2>$1</h2>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/`(.+?)`/g, '<code>$1</code>')
          .replace(/```\n?([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/^/, '<p>').replace(/$/, '</p>')
      }} />
    </div>
  );
}
