export default {
  preset: 'jest-preset-smallela',
  coveragePathIgnorePatterns: [
    '.commitlintrc.ts',
    'coverage',
    'jest.config.ts',
    'index.mjs'
  ],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest']
  }
};
