import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Bar } from 'components/UI'

describe('component.UI.Bar', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Bar />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
