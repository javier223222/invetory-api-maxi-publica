module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/infrastructure/web/express/server.ts',
    '!src/infrastructure/database/seed.ts',
  ],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000,
};
