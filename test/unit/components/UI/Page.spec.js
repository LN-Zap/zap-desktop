import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Page } from 'components/UI'

describe('component.UI.Page', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Page />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
