require('@babel/register')
const baseConfig = require('../webpack/webpack.config.base')

module.exports = ({ config }) => ({
  ...config,
  resolve: {
    ...config.resolve,
    ...baseConfig.default.resolve,
  },
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      ...baseConfig.default.module.rules,
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        enforce: 'pre',
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
    module: 'empty',
  },
})
