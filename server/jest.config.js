module.exports = {

  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  verbose: true,
  testTimeout: 30000,
  // Temporarily disable coverage thresholds
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
