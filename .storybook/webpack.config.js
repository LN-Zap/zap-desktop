require('@babel/register')
const baseConfig = require('../webpack/webpack.config.base')
const path = require('path')

const createResolveConfig = config => {
  const resolveConfig = {
    ...config.resolve,
    ...baseConfig.default.resolve,
  }
  resolveConfig.alias['react-redux'] = path.resolve(__dirname, './patchedReactRedux')
  return resolveConfig
}

module.exports = ({ config }) => ({
  ...config,
  resolve: createResolveConfig(config),

  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      ...baseConfig.default.module.rules,
      {
        test: /\.stories\.jsx?$/,
        loaders: [require.resolve('@storybook/source-loader')],
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
