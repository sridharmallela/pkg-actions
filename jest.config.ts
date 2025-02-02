export default {
  preset: 'jest-preset-ngs',
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
