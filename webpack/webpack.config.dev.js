/**
 * Webpack config for development builds.
 */

import CleanWebpackPlugin from 'clean-webpack-plugin'

import mainConfig from './dev/main.config'
import preloadConfig from './dev/preload.config'
import rendererConfig from './dev/renderer.config'

mainConfig.plugins.unshift(
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!config.json'] })
)

export default [mainConfig, preloadConfig, rendererConfig]
