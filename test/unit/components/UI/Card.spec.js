import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Card } from 'components/UI'

describe('component.UI.Card', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Card>content</Card>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
