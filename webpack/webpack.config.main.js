/**
 * Webpack config for development builds.
 */

import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import preloadConfig from './dev/preload.config'
import mainConfig from './dev/main.config'
import workersConfig from './dev/workers.config'

preloadConfig.plugins.unshift(
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!config.json', '!preload.js'] })
)

export default [preloadConfig, workersConfig, mainConfig]
