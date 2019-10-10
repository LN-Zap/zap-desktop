var path = require('path')

const downgraded = [
  'array-callback-return',
  'class-methods-use-this',
  'consistent-return',
  'eqeqeq',
  'getter-return',
  'no-async-promise-executor',
  'no-await-in-loop',
  'no-nested-ternary',
  'no-prototype-builtins',
  'no-restricted-globals',
  'no-restricted-syntax',
  'no-return-assign',
  'no-self-compare',
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
