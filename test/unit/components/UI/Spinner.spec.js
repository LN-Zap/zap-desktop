import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Spinner } from 'components/UI'

describe('component.UI.Spinner', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Spinner />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
