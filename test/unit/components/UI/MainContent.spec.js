import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { MainContent } from 'components/UI'

describe('component.UI.MainContent', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<MainContent />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
