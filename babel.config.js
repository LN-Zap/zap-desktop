module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 8,
          browsers: 'electron 2.0'
        },
        useBuiltIns: 'usage'
      }
    ],
    '@babel/preset-flow',
    '@babel/react'
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-classes',
    '@babel/plugin-transform-destructuring',
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
