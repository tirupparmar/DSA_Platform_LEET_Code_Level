'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Lightbulb, ChevronDown, Loader2, CheckCircle2, XCircle, Clock, MemoryStick, Zap, BookOpen, History, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProblemDescription } from './ProblemDescription';
import { TestResults } from './TestResults';

// Dynamic import to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false, loading: () => (
  <div className="flex-1 flex items-center justify-center bg-dark-900">
    <Loader2 size={24} className="text-brand-500 animate-spin" />
  </div>
)});

const STARTER_CODE: Record<string, Record<string, string>> = {
  'two-sum': {
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    """
    # Your solution here
    pass
`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your solution here
};
`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{};
    }
}
`,
  },
  default: {
    python: `# Write your solution here\n\ndef solution():\n    pass\n`,
    javascript: `// Write your solution here\n\nfunction solution() {\n    \n}\n`,
    java: `class Solution {\n    public void solve() {\n        // Your solution here\n    }\n}\n`,
  }
};

const LANGUAGES = [
  { id: 'python', label: 'Python 3', monacoId: 'python' },
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript' },
  { id: 'java', label: 'Java', monacoId: 'java' },
  { id: 'cpp', label: 'C++', monacoId: 'cpp' },
];

const PROBLEM_DATA: Record<string, any> = {
  'two-sum': {
    id: '1', title: 'Two Sum', difficulty: 'EASY', category: 'Arrays', tags: ['array', 'hash-map'],
    description: `## Problem\n\nGiven an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n## Examples\n\n**Example 1:**\n\`\`\`\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\`\`\`\n\n**Example 2:**\n\`\`\`\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\`\`\`\n\n## Constraints\n\n- \`2 <= nums.length <= 10⁴\`\n- \`-10⁹ <= nums[i] <= 10⁹\`\n- \`-10⁹ <= target <= 10⁹\`\n- Only one valid answer exists.\n\n> **Follow-up:** Can you come up with an algorithm that is less than O(n²) time complexity?`,
    hints: ['Try using a hash map to store values you\'ve seen.', 'For each element, check if target - element exists in the map.', 'The hash map gives O(1) lookup, making this O(n) overall.'],
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0,1]' },
    ],
  },
};

export function ProblemWorkspace({ slug }: { slug: string }) {
  const problem = PROBLEM_DATA[slug] || { ...PROBLEM_DATA['two-sum'], title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(STARTER_CODE[slug]?.[language] ?? STARTER_CODE.default[language]);
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'submissions'>('description');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'output'>('testcases');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [leftWidth, setLeftWidth] = useState(40);
  const dragging = useRef(false);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(STARTER_CODE[slug]?.[lang] ?? STARTER_CODE.default[lang]);
  };

  const handleRun = useCallback(async () => {
    setRunning(true);
    setBottomTab('output');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problemSlug: slug, type: 'run' }),
      });
      const data = await res.json();
      setResults({ ...data, type: 'run' });
    } catch {
      toast.error('Execution failed. Please try again.');
    } finally {
      setRunning(false);
    }
  }, [code, language, slug]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setBottomTab('output');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problemSlug: slug, type: 'submit' }),
      });
      const data = await res.json();
      setResults({ ...data, type: 'submit' });
      if (data.status === 'ACCEPTED') toast.success('🎉 Accepted!');
      else if (data.status === 'WRONG_ANSWER') toast.error('Wrong Answer');
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [code, language, slug]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const startX = e.clientX;
    const startWidth = leftWidth;
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const pct = startWidth + ((ev.clientX - startX) / window.innerWidth) * 100;
      setLeftWidth(Math.max(25, Math.min(70, pct)));
    };
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left panel: problem description */}
      <div className="flex flex-col overflow-hidden bg-dark-900 border-r border-dark-700" style={{ width: `${leftWidth}%` }}>
        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 pb-0 border-b border-dark-700 bg-dark-900">
          {[
            { id: 'description', label: 'Description', icon: BookOpen },
            { id: 'hints', label: 'Hints', icon: Lightbulb },
            { id: 'submissions', label: 'Submissions', icon: History },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === id ? 'text-brand-400 border-brand-500' : 'text-dark-400 border-transparent hover:text-dark-200'
              }`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'description' && <ProblemDescription problem={problem} />}
          {activeTab === 'hints' && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-white mb-4">Hints</h3>
              {problem.hints?.map((hint: string, i: number) => (
                <div key={i} className="card p-4">
                  <button onClick={() => setShowHint(prev => (hintIndex === i ? !prev : true) || ((setHintIndex(i)), true))}
                    className="flex items-center justify-between w-full text-left">
                    <span className="text-dark-300 text-sm font-medium">Hint {i + 1}</span>
                    <ChevronDown size={15} className={`text-dark-500 transition-transform ${showHint && hintIndex === i ? 'rotate-180' : ''}`} />
                  </button>
                  {showHint && hintIndex === i && (
                    <p className="mt-3 text-dark-300 text-sm leading-relaxed border-t border-dark-700 pt-3">{hint}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {activeTab === 'submissions' && (
            <div className="text-center py-12 text-dark-500">
              <History size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No submissions yet. Submit your code to see results here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resize handle */}
      <div className="w-1 bg-dark-700 hover:bg-brand-500/50 cursor-col-resize transition-colors flex-shrink-0 relative group"
        onMouseDown={handleMouseDown}>
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Right panel: editor + output */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ width: `${100 - leftWidth}%` }}>
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900 border-b border-dark-700 shrink-0">
          <div className="flex items-center gap-2">
            <select value={language} onChange={e => handleLanguageChange(e.target.value)}
              className="bg-dark-800 border border-dark-600 text-dark-200 text-xs font-medium py-1.5 px-3 rounded-lg cursor-pointer focus:outline-none focus:border-brand-500">
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCode(STARTER_CODE[slug]?.[language] ?? STARTER_CODE.default[language])}
              className="btn-ghost text-xs py-1.5 px-3 gap-1.5">
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={handleRun} disabled={running || submitting}
              className="btn-secondary text-xs py-1.5 px-4 gap-1.5 disabled:opacity-50">
              {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              Run
            </button>
            <button onClick={handleSubmit} disabled={running || submitting}
              className="btn-primary text-xs py-1.5 px-4 gap-1.5 disabled:opacity-50">
              {submitting ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
              Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 overflow-hidden bg-dark-900">
          <MonacoEditor
            height="100%"
            language={LANGUAGES.find(l => l.id === language)?.monacoId ?? 'python'}
            value={code}
            onChange={val => setCode(val ?? '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              tabSize: 4,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              bracketPairColorization: { enabled: true },
              suggest: { showKeywords: true },
            }}
          />
        </div>

        {/* Bottom panel: test cases / output */}
        <div className="h-52 flex flex-col border-t border-dark-700 bg-dark-900 shrink-0">
          <div className="flex items-center gap-1 px-4 pt-2 border-b border-dark-700">
            {[
              { id: 'testcases', label: 'Test Cases' },
              { id: 'output', label: 'Output' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setBottomTab(id as any)}
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-all -mb-px ${
                  bottomTab === id ? 'text-brand-400 border-brand-500' : 'text-dark-400 border-transparent hover:text-dark-200'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {bottomTab === 'testcases' && (
              <div className="space-y-2">
                {problem.testCases?.map((tc: any, i: number) => (
                  <div key={i} className="bg-dark-800 rounded-lg p-3 text-xs">
                    <div className="text-dark-400 mb-1">Case {i + 1}</div>
                    <div className="flex gap-4">
                      <div><span className="text-dark-500">Input:</span> <span className="code-font text-brand-300">{tc.input}</span></div>
                      <div><span className="text-dark-500">Expected:</span> <span className="code-font text-accent-cyan">{tc.expected}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {bottomTab === 'output' && <TestResults results={results} running={running || submitting} />}
          </div>
        </div>
      </div>
    </div>
  );
}
