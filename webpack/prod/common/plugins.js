import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const plugins = [
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'production',
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
    openAnalyzer: process.env.OPEN_ANALYZER === 'true',
  }),
]

export default plugins
