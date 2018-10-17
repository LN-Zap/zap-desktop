import { addDecorator, configure, setAddon } from '@storybook/react'
import { withThemesProvider } from 'storybook-addon-styled-component-theme'
import { themes } from '@storybook/components'
import { withOptions } from '@storybook/addon-options'
import { setDefaults, withInfo } from '@storybook/addon-info'
import { withConsole } from '@storybook/addon-console'
import { linkTo } from '@storybook/addon-links'
import chaptersAddon from 'react-storybook-addon-chapters'
import StoryRouter from 'storybook-react-router'
import { dark, light } from 'themes'

import React from 'react'
import GlobalStyle from 'components/UI/GlobalStyle'

// Info
addDecorator(
  withInfo({
    styles: {
      button: {
        base: {
          background: dark.colors.lightningOrange
        }
      }
    }
  })
)

// Router
addDecorator(StoryRouter({}))

// Chapters
setAddon(chaptersAddon)

// Console.
addDecorator((storyFn, context) => withConsole()(storyFn)(context))

// Options
addDecorator(
  withOptions({
    name: 'Zap Desktop',
    url: 'https://ln-zap.github.io/zap-desktop',
    theme: themes.dark,
    hierarchySeparator: /\./
  })
)

// Zap Global style.
addDecorator(story => (
  <React.Fragment>
    <GlobalStyle />
    {story()}
  </React.Fragment>
))

// Zap Themes.
const zapThemes = [dark, light]
addDecorator(withThemesProvider(zapThemes))

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
