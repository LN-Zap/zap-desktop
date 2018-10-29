import { addDecorator, configure, setAddon } from '@storybook/react'
import { withThemesProvider } from 'storybook-addon-styled-component-theme'
import { themes } from '@storybook/components'
import { withOptions } from '@storybook/addon-options'
import { setDefaults, withInfo } from '@storybook/addon-info'
import { withConsole } from '@storybook/addon-console'
import { linkTo } from '@storybook/addon-links'
import { setIntlConfig, withIntl } from 'storybook-addon-intl'
import chaptersAddon from 'react-storybook-addon-chapters'
import StoryRouter from 'storybook-react-router'
import { dark, light } from 'themes'
import { getDefaultLocale, locales } from 'lib/i18n'
import React from 'react'
import GlobalStyle from 'components/UI/GlobalStyle'

// Register supported locales.
import '../app/lib/i18n/locale'

// Get translations.
import translations from '../app/lib/i18n/translation'

// Set intl configuration
setIntlConfig({
  locales: locales,
  defaultLocale: getDefaultLocale(),
  getMessages: locale => translations[locale]
})

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

// Intl
addDecorator(withIntl)

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
