import React from 'react'
import { addParameters, addDecorator, configure, setAddon } from '@storybook/react'
import { withThemes } from 'storybook-styled-components'
import { withTheme } from 'styled-components'
import chaptersAddon, { setDefaults } from 'react-storybook-addon-chapters'
import { withKnobs } from '@storybook/addon-knobs'
import { linkTo } from '@storybook/addon-links'
import { setIntlConfig, withIntl } from 'storybook-addon-intl'
import StoryRouter from 'storybook-react-router'
import { dark, light } from 'themes'
import { getDefaultLocale, locales } from '@zap/i18n'
import { BackgroundPrimary, GlobalStyle } from 'components/UI'
import '@storybook/addon-console'

// Get translations.
import translations from '@zap/i18n/translation'

const BackgroundPrimaryWithTheme = withTheme(({ theme, ...rest }) => (
  <BackgroundPrimary
    className={theme.name}
    height="100vh"
    p={3}
    sx={{
      overflowY: 'auto !important',
    }}
    {...rest}
  />
))

// Set intl configuration
setIntlConfig({
  locales,
  defaultLocale: getDefaultLocale(),
  getMessages: locale => translations[locale],
})

// Intl
addDecorator(withIntl)

// Router
addDecorator(StoryRouter({}))

// Knobs
addDecorator(withKnobs)

// Zap Global style.
addDecorator(story => (
  <>
    <GlobalStyle />
    <BackgroundPrimaryWithTheme>{story()}</BackgroundPrimaryWithTheme>
  </>
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
    allowPropTablesToggling: true,
  },
})
