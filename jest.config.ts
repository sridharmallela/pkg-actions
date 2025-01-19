export default {
  preset: 'jest-preset-smallela',
  coveragePathIgnorePatterns: [
    'coverage',
    'dist',
    '.commitlintrc.ts',
    'jest.config.ts'
  ],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest']
  }
};
