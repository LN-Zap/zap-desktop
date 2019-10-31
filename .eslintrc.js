var path = require('path')

const downgraded = [
  'class-methods-use-this',
  'consistent-return',
  'max-classes-per-file',
  'no-async-promise-executor',
  'no-await-in-loop',
  'no-shadow',
  'no-underscore-dangle',
  'no-use-before-define',
]

module.exports = {
  extends: '@ln-zap',
  rules: downgraded.reduce(
    (acc, next) => {
      acc[next] = 'warn'
      return acc
    },
    {
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-restricted-syntax': 'off',
      'jest/no-mocks-import': 'off',
    }
  ),
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
    node: {
      moduleDirectory: ['renderer', 'node_modules'],
    },
    webpack: {
      config: path.resolve(__dirname, 'webpack', 'webpack.config.eslint.js'),
    },
  },
}
