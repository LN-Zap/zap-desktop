import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Text } from 'components/UI'

describe('component.UI.Text', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Text />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
