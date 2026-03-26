'use client';

import { CheckCircle2, XCircle, Clock, Database, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TestResults({ results, running }: { results: any; running: boolean }) {
  if (running) return (
    <div className="flex items-center gap-3 text-dark-400 text-sm">
      <Loader2 size={16} className="animate-spin text-brand-500" />
      <span>Executing your code...</span>
    </div>
  );

  if (!results) return (
    <div className="text-dark-500 text-sm">Run your code to see output here.</div>
  );

  const isAccepted = results.status === 'ACCEPTED';
  const isWrong = results.status === 'WRONG_ANSWER';
  const isError = ['RUNTIME_ERROR', 'COMPILE_ERROR', 'TIME_LIMIT'].includes(results.status);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={results.status} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
        {/* Status banner */}
        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg mb-3 text-sm font-semibold ${
          isAccepted ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20' :
          isError ? 'bg-red-500/15 text-red-300 border border-red-500/20' :
          'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20'
        }`}>
          {isAccepted ? <CheckCircle2 size={16} /> : isError ? <AlertTriangle size={16} /> : <XCircle size={16} />}
          {results.status?.replace(/_/g, ' ')}

          {isAccepted && results.type === 'submit' && (
            <span className="ml-auto flex items-center gap-3 text-xs font-normal text-dark-300">
              <span className="flex items-center gap-1"><Clock size={12} /> {results.runtime}ms</span>
              <span className="flex items-center gap-1"><Database size={12} /> {results.memory}KB</span>
            </span>
          )}
        </div>

        {/* Test case results */}
        {results.testResults && (
          <div className="space-y-2">
            {results.testResults.map((tc: any, i: number) => (
              <div key={i} className={`rounded-lg px-3 py-2.5 text-xs border ${
                tc.passed ? 'bg-brand-500/5 border-brand-500/15' : 'bg-red-500/5 border-red-500/15'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {tc.passed ? <CheckCircle2 size={13} className="text-brand-400" /> : <XCircle size={13} className="text-red-400" />}
                  <span className={tc.passed ? 'text-brand-300' : 'text-red-300'}>
                    Test {i + 1} — {tc.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                {!tc.passed && (
                  <div className="pl-5 space-y-0.5 text-dark-400">
                    <div><span className="text-dark-500">Input:</span> <span className="code-font text-dark-300">{tc.input}</span></div>
                    <div><span className="text-dark-500">Expected:</span> <span className="code-font text-brand-300">{tc.expected}</span></div>
                    <div><span className="text-dark-500">Got:</span> <span className="code-font text-red-300">{tc.got}</span></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stderr / error output */}
        {(results.stderr || results.error) && (
          <div className="mt-3 bg-red-500/5 border border-red-500/15 rounded-lg p-3">
            <div className="text-red-400 text-xs font-semibold mb-1.5">Error Output</div>
            <pre className="code-font text-xs text-red-300 whitespace-pre-wrap">{results.stderr || results.error}</pre>
          </div>
        )}

        {/* Stdout */}
        {results.stdout && (
          <div className="mt-3 bg-dark-800 border border-dark-700 rounded-lg p-3">
            <div className="text-dark-400 text-xs font-semibold mb-1.5">Stdout</div>
            <pre className="code-font text-xs text-dark-200 whitespace-pre-wrap">{results.stdout}</pre>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
