import { NextRequest, NextResponse } from 'next/server';

// Judge0 language IDs
const LANGUAGE_IDS: Record<string, number> = {
  python: 71,       // Python 3
  javascript: 63,   // Node.js
  java: 62,         // Java
  cpp: 54,          // C++17
  go: 60,           // Go
};

const TEST_CASES: Record<string, { input: string; expected: string }[]> = {
  'two-sum': [
    { input: '[2,7,11,15]\n9', expected: '[0,1]' },
    { input: '[3,2,4]\n6', expected: '[1,2]' },
    { input: '[3,3]\n6', expected: '[0,1]' },
  ],
  'binary-search': [
    { input: '[-1,0,3,5,9,12]\n9', expected: '4' },
    { input: '[-1,0,3,5,9,12]\n2', expected: '-1' },
  ],
};

// Wrap user code with test harness
function wrapCode(code: string, language: string, problemSlug: string, testInput: string): string {
  if (language === 'python') {
    return `${code}

import sys, json

def run_tests():
    input_data = """${testInput}""".strip().split('\\n')
    # Problem-specific parsing would go here
    print("__ALGOSIM_OUTPUT__")
    
run_tests()
`;
  }
  return code;
}

async function executeWithJudge0(code: string, languageId: number, stdin: string = '') {
  const judge0Url = process.env.JUDGE0_API_URL ?? 'https://judge0-ce.p.rapidapi.com';
  const apiKey = process.env.JUDGE0_API_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey;
    headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
  }

  // Submit
  const submitRes = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin,
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
  });

  if (!submitRes.ok) {
    throw new Error(`Judge0 error: ${submitRes.status}`);
  }

  return await submitRes.json();
}

// Mock execution for development (when no Judge0 key)
function mockExecute(code: string, language: string, problemSlug: string) {
  // Simulate a result for demo purposes
  const hasHashMap = code.includes('{}') || code.includes('hash') || code.includes('dict') || code.includes('Map');
  
  if (code.trim().endsWith('pass') || code.trim() === '') {
    return {
      status: 'WRONG_ANSWER',
      testResults: [
        { passed: false, input: '[2,7,11,15], target=9', expected: '[0,1]', got: 'None' },
      ],
      runtime: null, memory: null,
    };
  }

  return {
    status: 'ACCEPTED',
    testResults: [
      { passed: true, input: '[2,7,11,15], target=9', expected: '[0,1]' },
      { passed: true, input: '[3,2,4], target=6', expected: '[1,2]' },
      { passed: true, input: '[3,3], target=6', expected: '[0,1]' },
    ],
    runtime: Math.floor(Math.random() * 50) + 30,
    memory: Math.floor(Math.random() * 5000) + 14000,
    stdout: '',
  };
}

export async function POST(req: NextRequest) {
  try {
    const { code, language, problemSlug, type } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    // Use mock in development if no Judge0 key
    if (!process.env.JUDGE0_API_KEY && process.env.NODE_ENV === 'development') {
      const result = mockExecute(code, language, problemSlug);
      return NextResponse.json(result);
    }

    // Real execution with Judge0
    const testCases = TEST_CASES[problemSlug] ?? [];
    const isSubmit = type === 'submit';
    const casesToRun = isSubmit ? testCases : testCases.slice(0, 2);

    const results = await Promise.all(
      casesToRun.map(tc => executeWithJudge0(code, languageId, tc.input))
    );

    const testResults = results.map((r, i) => {
      const actual = (r.stdout ?? '').trim();
      const expected = casesToRun[i].expected.trim();
      return {
        passed: actual === expected,
        input: casesToRun[i].input,
        expected,
        got: actual,
      };
    });

    const allPassed = testResults.every(r => r.passed);
    const firstFailed = results.find(r => r.status?.id > 3);

    let status = 'WRONG_ANSWER';
    if (allPassed) status = 'ACCEPTED';
    else if (firstFailed?.status?.id === 5) status = 'TIME_LIMIT';
    else if (firstFailed?.stderr) status = 'RUNTIME_ERROR';

    return NextResponse.json({
      status,
      testResults,
      runtime: results[0]?.time ? Math.round(results[0].time * 1000) : null,
      memory: results[0]?.memory ?? null,
      stdout: results[0]?.stdout ?? '',
      stderr: results[0]?.stderr ?? '',
    });

  } catch (err: any) {
    console.error('Execution error:', err);
    return NextResponse.json({ error: 'Execution failed', details: err.message }, { status: 500 });
  }
}
