module.exports = {
  babelrcRoots: [
    // Keep the root as a root
    '.',

    // Also consider renderer as "root" and load it's .babelrc files.
    './renderer/*',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        include: ['proposal-object-rest-spread', 'transform-classes', 'transform-destructuring'],
      },
    ],
    '@babel/preset-flow',
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    'babel-plugin-styled-components',
    [
      'react-intl-auto',
      {
        removePrefix: 'renderer/',
        filebase: false,
      },
    ],
  ],
  env: {
    production: {
      plugins: [
        '@babel/transform-react-constant-elements',
        '@babel/transform-react-inline-elements',
        'transform-react-remove-prop-types',
        'transform-react-pure-class-to-function',
      ],
    },
  },
}
