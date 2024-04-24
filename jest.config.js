const path = require('path')

module.exports = {
  rootDir: path.join(__dirname),
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest'
  },
  setupFiles: [
    "jest-canvas-mock",
    "./setupEnzyme.ts"
  ],
  testEnvironment: "jsdom",
  coverageReporters: [
    "json-summary",
    "text",
    "lcov"
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  testMatch: [path.join(__dirname, 'tests/**/*.(spec|test).ts?(x)')],
};
