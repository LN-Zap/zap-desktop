import React from 'react'
import { Button } from 'components/UI'
import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'

describe('component.UI.Button', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Button>Click Me</Button>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
