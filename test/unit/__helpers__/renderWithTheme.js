import React from 'react'

import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'

import { dark } from 'themes'

export const renderWithTheme = component => {
  return renderer.create(<ThemeProvider theme={dark}>{component}</ThemeProvider>)
}
