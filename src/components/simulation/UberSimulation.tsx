'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, StepForward, Info, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

// City graph nodes (x, y are percentage-based for responsive layout)
const NODES: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 10, y: 50, label: 'HQ' },
  B: { x: 28, y: 20, label: 'Airport' },
  C: { x: 28, y: 75, label: 'Mall' },
  D: { x: 50, y: 40, label: 'Station' },
  E: { x: 50, y: 80, label: 'Hotel' },
  F: { x: 72, y: 15, label: 'Uni' },
  G: { x: 72, y: 60, label: 'Park' },
  H: { x: 90, y: 40, label: 'Dest' },
};

const EDGES: { from: string; to: string; weight: number }[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'B', to: 'F', weight: 10 },
  { from: 'C', to: 'D', weight: 3 },
  { from: 'C', to: 'E', weight: 8 },
  { from: 'D', to: 'F', weight: 4 },
  { from: 'D', to: 'G', weight: 6 },
  { from: 'E', to: 'G', weight: 1 },
  { from: 'F', to: 'H', weight: 3 },
  { from: 'G', to: 'H', weight: 5 },
];

type DijkstraStep = {
  current: string;
  visited: Set<string>;
  dist: Record<string, number>;
  prev: Record<string, string | null>;
  queue: { node: string; d: number }[];
  relaxedEdge?: { from: string; to: string };
  description: string;
};

function runDijkstra(start: string, end: string): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();

  for (const node of Object.keys(NODES)) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[start] = 0;

  const pq = [{ node: start, d: 0 }];

  steps.push({
    current: start,
    visited: new Set(),
    dist: { ...dist },
    prev: { ...prev },
    queue: [...pq],
    description: `Initialize: Set dist[${start}] = 0, all others = ∞. Add ${start} to priority queue.`,
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { node: u } = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    const neighbors = EDGES.filter(e => e.from === u || e.to === u)
      .map(e => ({ node: e.from === u ? e.to : e.from, weight: e.weight }));

    for (const { node: v, weight: w } of neighbors) {
      if (visited.has(v)) continue;
      const newDist = dist[u] + w;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        prev[v] = u;
        pq.push({ node: v, d: newDist });

        steps.push({
          current: u,
          visited: new Set(visited),
          dist: { ...dist },
          prev: { ...prev },
          queue: pq.map(x => ({ ...x })),
          relaxedEdge: { from: u, to: v },
          description: `Relax edge ${u}→${v}: dist[${v}] updated to ${newDist} (${dist[u]} + ${w})`,
        });
      }
    }

    steps.push({
      current: u,
      visited: new Set(visited),
      dist: { ...dist },
      prev: { ...prev },
      queue: pq.map(x => ({ ...x })),
      description: `Visit node ${u} (${NODES[u].label}). Mark as explored. Current dist: ${dist[u] === Infinity ? '∞' : dist[u]}`,
    });
  }

  return steps;
}

function getShortestPath(prev: Record<string, string | null>, end: string): string[] {
  const path: string[] = [];
  let cur: string | null = end;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return path;
}

export function UberSimulation() {
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [start] = useState('A');
  const [end] = useState('H');
  const [svgSize, setSvgSize] = useState({ w: 800, h: 420 });
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const s = runDijkstra(start, end);
    setSteps(s);
    setStepIndex(0);
  }, [start, end]);

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) setSvgSize({ w: rect.width, h: Math.min(rect.width * 0.5, 420) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, speed, steps.length]);

  const reset = () => { setStepIndex(0); setPlaying(false); };

  const currentStep = steps[stepIndex];
  const finalStep = steps[steps.length - 1];
  const shortestPath = finalStep ? getShortestPath(finalStep.prev, end) : [];
  const isFinished = stepIndex === steps.length - 1;
  const showPath = isFinished && shortestPath.length > 1;

  const nodeX = (id: string) => (NODES[id].x / 100) * svgSize.w;
  const nodeY = (id: string) => (NODES[id].y / 100) * svgSize.h;

  const getEdgeColor = (from: string, to: string) => {
    if (!currentStep) return '#334155';
    if (showPath) {
      const inPath = shortestPath.some((n, i) => (n === from && shortestPath[i+1] === to) || (n === to && shortestPath[i+1] === from));
      if (inPath) return '#22c55e';
    }
    if (currentStep.relaxedEdge?.from === from && currentStep.relaxedEdge?.to === to) return '#06b6d4';
    if (currentStep.relaxedEdge?.from === to && currentStep.relaxedEdge?.to === from) return '#06b6d4';
    return '#334155';
  };

  const getNodeColor = (id: string) => {
    if (!currentStep) return '#1e293b';
    if (id === start) return '#166534';
    if (id === end) return '#1d4ed8';
    if (showPath && shortestPath.includes(id)) return '#14532d';
    if (id === currentStep.current) return '#065f46';
    if (currentStep.visited.has(id)) return '#1e3a5f';
    return '#1e293b';
  };

  const getNodeTextColor = (id: string) => {
    if (!currentStep) return '#94a3b8';
    if (id === currentStep.current) return '#22c55e';
    if (currentStep.visited.has(id)) return '#60a5fa';
    return '#94a3b8';
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Main simulation area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-dark-900 border-b border-dark-700">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-6 h-6 rounded-md bg-brand-500/20 flex items-center justify-center">
              <Zap size={13} className="text-brand-400" />
            </div>
            <span className="font-display font-bold text-white text-sm">Uber Delivery</span>
            <span className="tag text-xs">Dijkstra</span>
          </div>

          <div className="h-5 w-px bg-dark-700" />

          {/* Controls */}
          <button onClick={reset} className="btn-ghost text-xs py-1.5 px-2.5 gap-1">
            <RotateCcw size={13} /> Reset
          </button>
          <button onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} className="btn-ghost text-xs py-1.5 px-2.5" disabled={stepIndex === 0}>
            ← Prev
          </button>
          <button onClick={() => setPlaying(!playing)} className={`btn-primary text-xs py-1.5 px-4 gap-1.5 ${isFinished ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isFinished}>
            {playing ? <Pause size={13} /> : <Play size={13} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} className="btn-ghost text-xs py-1.5 px-2.5 gap-1" disabled={isFinished}>
            <StepForward size={13} /> Step
          </button>

          <div className="h-5 w-px bg-dark-700" />

          <div className="flex items-center gap-2 text-xs">
            <span className="text-dark-400">Speed:</span>
            <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
              className="bg-dark-800 border border-dark-700 text-dark-300 text-xs py-1 px-2 rounded-lg">
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={200}>5x</option>
            </select>
          </div>

          <div className="ml-auto text-dark-500 text-xs code-font">
            Step {stepIndex + 1} / {steps.length}
          </div>
        </div>

        {/* SVG canvas */}
        <div className="flex-1 sim-canvas overflow-hidden relative" ref={svgRef as any}>
          <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}>
            {/* Edges */}
            {EDGES.map((edge, i) => {
              const x1 = nodeX(edge.from), y1 = nodeY(edge.from);
              const x2 = nodeX(edge.to), y2 = nodeY(edge.to);
              const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
              const color = getEdgeColor(edge.from, edge.to);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth={color === '#22c55e' ? 3 : color === '#06b6d4' ? 2.5 : 1.5}
                    strokeOpacity={color === '#334155' ? 0.4 : 1}
                    className={color === '#06b6d4' ? 'edge-active' : ''}
                  />
                  <rect x={mx - 12} y={my - 10} width={24} height={18} rx={4}
                    fill="#0f172a" stroke={color} strokeWidth={0.5} strokeOpacity={0.6} />
                  <text x={mx} y={my + 4} textAnchor="middle" fontSize={10}
                    fill={color === '#334155' ? '#475569' : color} fontFamily="JetBrains Mono">
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {Object.entries(NODES).map(([id, { label }]) => {
              const x = nodeX(id), y = nodeY(id);
              const dist = currentStep?.dist[id];
              const distLabel = dist === Infinity ? '∞' : String(dist ?? '∞');
              const isActive = id === currentStep?.current;
              return (
                <g key={id} className={isActive ? 'node-highlight' : ''}>
                  {/* Glow for active */}
                  {isActive && <circle cx={x} cy={y} r={26} fill="#22c55e" fillOpacity={0.08} />}

                  <circle cx={x} cy={y} r={20}
                    fill={getNodeColor(id)}
                    stroke={isActive ? '#22c55e' : currentStep?.visited.has(id) ? '#3b82f6' : '#334155'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />

                  {/* Node ID */}
                  <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize={13} fontWeight="bold" fill={getNodeTextColor(id)} fontFamily="JetBrains Mono">
                    {id}
                  </text>

                  {/* Label below */}
                  <text x={x} y={y + 30} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="Plus Jakarta Sans">
                    {label}
                  </text>

                  {/* Distance badge */}
                  <g>
                    <rect x={x - 12} y={y - 35} width={24} height={16} rx={4} fill="#0f172a" stroke="#334155" strokeWidth={0.8} />
                    <text x={x} y={y - 24} textAnchor="middle" fontSize={9} fontFamily="JetBrains Mono"
                      fill={distLabel === '∞' ? '#475569' : '#22c55e'}>
                      {distLabel}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-3 text-xs space-y-1.5">
            {[
              { color: 'bg-brand-500', label: 'Start (HQ)' },
              { color: 'bg-blue-600', label: 'Destination' },
              { color: 'bg-teal-700', label: 'Current node' },
              { color: 'bg-blue-900', label: 'Visited' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-dark-400">{label}</span>
              </div>
            ))}
          </div>

          {/* Finished overlay */}
          {showPath && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl px-5 py-3 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-brand-400" />
                <div className="text-sm">
                  <span className="text-white font-semibold">Shortest path found!</span>
                  <span className="text-dark-400 ml-2 code-font">
                    {shortestPath.join(' → ')} = {finalStep?.dist[end]} units
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Step description */}
        <div className="px-5 py-3 bg-dark-900 border-t border-dark-700">
          <AnimatePresence mode="wait">
            <motion.div key={stepIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <Info size={15} className="text-accent-cyan shrink-0 mt-0.5" />
              <p className="text-dark-300 text-sm code-font">{currentStep?.description ?? 'Press Play to start the simulation'}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right sidebar: priority queue state */}
      <div className="w-64 bg-dark-900 border-l border-dark-700 flex flex-col">
        <div className="p-4 border-b border-dark-700">
          <h3 className="font-display font-bold text-white text-sm mb-1">Priority Queue</h3>
          <p className="text-dark-500 text-xs">Min-heap ordered by distance</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {currentStep?.queue.length === 0 && (
            <div className="text-dark-600 text-xs text-center py-4">Queue empty</div>
          )}
          {currentStep?.queue
            .sort((a, b) => a.d - b.d)
            .map((item, i) => (
              <motion.div key={`${item.node}-${item.d}`} layout
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  i === 0 ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-dark-800'
                }`}>
                <span className="code-font text-sm text-dark-200 font-bold">{item.node}</span>
                <span className="text-xs text-dark-400">{NODES[item.node]?.label}</span>
                <span className={`code-font text-sm font-bold ${i === 0 ? 'text-brand-400' : 'text-dark-300'}`}>{item.d}</span>
              </motion.div>
            ))}
        </div>

        {/* Distance table */}
        <div className="border-t border-dark-700 p-3">
          <h4 className="text-dark-400 text-xs font-semibold mb-2 uppercase tracking-wider">Distance Table</h4>
          <div className="space-y-1">
            {Object.entries(NODES).map(([id]) => (
              <div key={id} className="flex items-center justify-between text-xs">
                <span className="code-font text-dark-300 font-bold">{id}</span>
                <span className="text-dark-500 text-xs">{NODES[id].label}</span>
                <span className={`code-font font-bold ${
                  currentStep?.dist[id] === Infinity ? 'text-dark-600' :
                  currentStep?.visited.has(id) ? 'text-blue-400' : 'text-brand-300'
                }`}>
                  {currentStep?.dist[id] === Infinity ? '∞' : currentStep?.dist[id] ?? '∞'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
