module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-flow', '@babel/react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    'babel-plugin-styled-components',
    [
      'react-intl-auto',
      {
        removePrefix: 'app/',
        filebase: false
      }
    ]
  ],
  env: {
    production: {
      presets: ['react-optimize']
    }
  }
}
