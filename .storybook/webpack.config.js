require('@babel/register')

const fs = require('fs')
const path = require('path')
const baseConfig = require('../webpack/webpack.config.base')
const merge = require('webpack-merge')
const config = require('config')
const rootDir = path.join(__dirname, '..')

module.exports = merge.smart(baseConfig, {
  default: {
    module: {
      rules: [
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
  },
})
