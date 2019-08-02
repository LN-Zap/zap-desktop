/**
 * Webpack config for production builds
 */

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import mainConfig from './prod/main.config'
import workersConfig from './prod/workers.config'
import preloadConfig from './prod/preload.config'
import rendererConfig from './prod/renderer.config'

preloadConfig.plugins.unshift(
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!config.json'] })
)

export default [preloadConfig, workersConfig, mainConfig, rendererConfig]
