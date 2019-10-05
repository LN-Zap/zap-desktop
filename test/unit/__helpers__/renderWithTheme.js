import React from 'react'
import { ThemeProvider } from 'styled-components'
import renderer from 'react-test-renderer'
import { dark } from 'themes'

export const renderWithTheme = component => {
  return renderer.create(<ThemeProvider theme={dark}>{component}</ThemeProvider>)
}
