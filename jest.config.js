module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.(js|ts)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};