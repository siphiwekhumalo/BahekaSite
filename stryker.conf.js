export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true,
  },
  mutate: [
    'client/src/**/*.{ts,tsx}',
    'server/**/*.{ts,js}',
    'shared/**/*.{ts,js}',
    '!**/*.{spec,test}.{ts,tsx,js}',
    '!**/*test*',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!client/src/main.tsx',
    '!server/index.ts',
    '!**/*.d.ts',
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  timeoutMS: 60000,
  maxConcurrentTestRunners: 4,
  plugins: [
    '@stryker-mutator/jest-runner',
    '@stryker-mutator/typescript-checker',
  ],
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  dashboard: {
    reportType: 'full',
  },
};