// scripts/seed.js
// Run: node scripts/seed.js
// Seeds the database with sample problems and a demo user

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const SAMPLE_PROBLEMS = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    description: `## Problem\n\nGiven an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\n## Examples\n\n\`\`\`\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\`\`\`\n\n## Constraints\n\n- \`2 <= nums.length <= 10⁴\`\n- Only one valid answer exists.`,
    difficulty: 'EASY',
    category: 'Arrays',
    tags: ['array', 'hash-map'],
    starterCode: {
      python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    pass\n',
      javascript: 'var twoSum = function(nums, target) {\n    \n};\n',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}\n',
    },
    testCases: [
      { input: '[2,7,11,15]\n9', expected: '[0,1]', hidden: false },
      { input: '[3,2,4]\n6', expected: '[1,2]', hidden: false },
      { input: '[3,3]\n6', expected: '[0,1]', hidden: true },
    ],
    hints: [
      'Try using a hash map to store values you\'ve seen.',
      'For each element, check if target - element exists in the map.',
      'The hash map gives O(1) lookup, making this O(n) overall.',
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    description: `## Problem\n\nGiven an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.\n\n## Examples\n\n\`\`\`\nInput: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4\n\`\`\`\n\n## Constraints\n\n- You must write an algorithm with \`O(log n)\` runtime complexity.`,
    difficulty: 'EASY',
    category: 'Binary Search',
    tags: ['array', 'binary-search'],
    starterCode: {
      python: 'def search(nums: list[int], target: int) -> int:\n    pass\n',
      javascript: 'var search = function(nums, target) {\n    \n};\n',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}\n',
    },
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', expected: '4', hidden: false },
      { input: '[-1,0,3,5,9,12]\n2', expected: '-1', hidden: false },
    ],
    hints: [
      'Keep track of left and right pointers.',
      'The middle element is (left + right) // 2.',
      'If target < mid, search left half. If target > mid, search right half.',
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@algosim.dev' },
    update: {},
    create: {
      email: 'demo@algosim.dev',
      name: 'Demo User',
      username: 'demo',
      passwordHash,
      xp: 750,
      level: 3,
      streak: 4,
      totalSolved: 3,
    },
  });
  console.log(`✅ Demo user: ${demoUser.email}`);

  // Create problems
  for (const problem of SAMPLE_PROBLEMS) {
    const p = await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: {},
      create: problem,
    });
    console.log(`✅ Problem: ${p.title}`);
  }

  console.log('\n✨ Seeding complete!');
  console.log('Demo login: demo@algosim.dev / demo123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
