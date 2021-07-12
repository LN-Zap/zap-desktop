import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { BackgroundTertiary } from 'components/UI'

describe('component.UI.BackgroundTertiary', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<BackgroundTertiary />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
