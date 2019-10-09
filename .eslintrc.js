var path = require('path')

const downgraded = [
  'array-callback-return',
  'class-methods-use-this',
  'consistent-return',
  'default-case',
  'eqeqeq',
  'getter-return',
  'global-require',
  'new-cap',
  'no-async-promise-executor',
  'no-await-in-loop',
  'no-lonely-if',
  'no-multi-str',
  'no-nested-ternary',
  'no-plusplus',
  'no-prototype-builtins',
  'no-restricted-globals',
  'no-restricted-syntax',
  'no-return-assign',
  'no-return-await',
  'no-self-compare',
  'no-shadow',
  'no-underscore-dangle',
  'no-unused-expressions',
  'no-use-before-define',
  'prefer-const',
]

module.exports = {
  extends: '@ln-zap',
  rules: downgraded.reduce((acc, next) => {
    acc[next] = 'warn'
    return acc
  }, {}),
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
