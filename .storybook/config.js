import { addDecorator, configure, setAddon } from '@storybook/react'
import { withThemesProvider } from 'storybook-addon-styled-component-theme'
import { themes } from '@storybook/components'
import { withOptions } from '@storybook/addon-options'
import { setDefaults, withInfo } from '@storybook/addon-info'
import { withBackgrounds } from '@storybook/addon-backgrounds'
import { dark, light } from 'themes'
import chaptersAddon from 'react-storybook-addon-chapters'

// Info
// addDecorator(withInfo())
setDefaults({
  inline: true
})

// Chapters
setAddon(chaptersAddon)

// Options
addDecorator(
  withOptions({
    name: 'Zap Desktop',
    url: 'https://ln-zap.github.io/zap-desktop',
    theme: themes.dark,
    addonPanelInRight: true
  })
)

// Backgrounds
addDecorator(
  withBackgrounds([
    { name: 'dark', value: dark.colors.darkestBackground, default: true },
    { name: 'light', value: light.colors.darkestBackground }
  ])
)

// Themes.
const zapThemes = [dark, light]
console.log(zapThemes)
addDecorator(withThemesProvider(zapThemes))

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
