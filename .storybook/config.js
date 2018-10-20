import React from 'react'
import { addDecorator, configure, setAddon } from '@storybook/react'
import { withThemes } from 'storybook-styled-components'
import { themes } from '@storybook/components'
import { withOptions } from '@storybook/addon-options'
import { withInfo } from '@storybook/addon-info'
import chaptersAddon, { setDefaults } from 'react-storybook-addon-chapters'
import { withConsole } from '@storybook/addon-console'
import { withKnobs } from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links'
import { setIntlConfig, withIntl } from 'storybook-addon-intl'
import StoryRouter from 'storybook-react-router'
import { dark, light } from 'themes'
import { getDefaultLocale, locales } from 'lib/i18n'
import { BackgroundDark GlobalStyle } from 'components/UI'

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

// Console.
addDecorator((storyFn, context) => withConsole()(storyFn)(context))

// Knobs
addDecorator(withKnobs)

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
    <BackgroundDark p={3} css={{ height: '100vh', 'overflow-y': 'scroll !important' }}>
      {story()}
    </BackgroundDark>
  </React.Fragment>
))

// Zap Themes.
addDecorator(withThemes({ Dark: dark, Light: light }))

// Chapters
setAddon(chaptersAddon)
setDefaults({
  sectionOptions: {
    showSource: false,
    allowSourceToggling: false,
    showPropTables: false,
    allowPropTablesToggling: true
  }
})

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
