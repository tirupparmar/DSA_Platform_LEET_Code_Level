// =====================================
// AlgoSim — Shared TypeScript Types
// =====================================

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'go';
export type SubmissionStatus = 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT' | 'MEMORY_LIMIT' | 'RUNTIME_ERROR' | 'COMPILE_ERROR' | 'PENDING';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  starterCode: Record<Language, string>;
  testCases: TestCase[];
  hints?: string[];
  hasSimulation?: boolean;
  acceptance?: number;
}

export interface TestCase {
  input: string;
  expected: string;
  hidden?: boolean;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  got?: string;
}

export interface ExecutionResult {
  status: SubmissionStatus;
  testResults?: TestResult[];
  runtime?: number;   // ms
  memory?: number;    // KB
  stdout?: string;
  stderr?: string;
  type: 'run' | 'submit';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  totalSolved: number;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: Language;
  status: SubmissionStatus;
  runtime?: number;
  memory?: number;
  createdAt: string;
}

export interface SimNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface SimEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

export interface SimulationState {
  nodes: SimNode[];
  edges: SimEdge[];
  visited: string[];
  current?: string;
  path?: string[];
  distances?: Record<string, number>;
  queue?: { node: string; priority: number }[];
  step: number;
  finished: boolean;
}

export interface SimScenario {
  id: string;
  title: string;
  description: string;
  algorithm: string;
  difficulty: Difficulty;
  xp: number;
  concepts: string[];
  tag: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  country?: string;
  solved: number;
  xp: number;
  streak: number;
}

export interface UserProgress {
  problemId: string;
  status: 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED';
  attempts: number;
  bestRuntime?: number;
  solvedAt?: string;
}
