import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { BackgroundPrimary } from 'components/UI'

describe('component.UI.BackgroundPrimary', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<BackgroundPrimary />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
