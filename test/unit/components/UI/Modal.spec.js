import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Modal } from 'components/UI'

describe('component.UI.Modal', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Modal />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
