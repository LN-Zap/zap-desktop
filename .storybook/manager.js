import { addons } from '@storybook/addons'
import { themes } from '@storybook/theming'

addons.setConfig({
  brandTitle: 'Zap',
  brandUrl: 'https://ln-zap.github.io/zap-desktop',
  theme: themes.dark,
  hierarchySeparator: /\./,
})
