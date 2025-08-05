export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/client/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@assets/(.*)$': '<rootDir>/attached_assets/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/client/src/**/*.(test|spec).(ts|tsx|js)',
    '<rootDir>/server/**/__tests__/**/*.(ts|js)',
    '<rootDir>/server/**/*.(test|spec).(ts|js)',
    '<rootDir>/shared/**/__tests__/**/*.(ts|js)',
    '<rootDir>/shared/**/*.(test|spec).(ts|js)',
  ],
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    'server/**/*.{ts,js}',
    'shared/**/*.{ts,js}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!client/src/main.tsx',
    '!server/index.ts',
    '!baheka-tech-production-package/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 10000,
};