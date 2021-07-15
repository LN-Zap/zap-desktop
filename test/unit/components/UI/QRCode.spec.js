import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { QRCode } from 'components/UI'

describe('component.UI.QRCode', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<QRCode value="qwerty" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
