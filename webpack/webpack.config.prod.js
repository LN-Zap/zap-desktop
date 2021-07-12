/**
 * Webpack config for production builds
 */

import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import mainConfig from './prod/main.config'
import preloadConfig from './prod/preload.config'
import rendererConfig from './prod/renderer.config'
import workersConfig from './prod/workers.config'

preloadConfig.plugins.unshift(
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!config.json'] })
)

export default [preloadConfig, workersConfig, mainConfig, rendererConfig]
