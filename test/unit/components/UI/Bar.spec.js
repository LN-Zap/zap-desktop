import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { dark } from 'themes'
import { Bar } from 'components/UI'

describe('component.UI.Bar', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <Bar />
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
