import React from 'react'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { QRCode } from 'components/UI'
import { dark } from 'themes'

describe('component.UI.QRCode', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <ThemeProvider theme={dark}>
          <QRCode value="qwerty" />
        </ThemeProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
