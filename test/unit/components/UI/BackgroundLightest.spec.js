import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { BackgroundSecondary } from 'components/UI'

describe('component.UI.BackgroundSecondary', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<BackgroundSecondary />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
