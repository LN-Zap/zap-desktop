import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Button } from 'components/UI'

describe('component.UI.Button', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Button>Click Me</Button>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
