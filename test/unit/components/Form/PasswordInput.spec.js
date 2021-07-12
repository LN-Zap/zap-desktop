import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { PasswordInput } from 'components/Form'

describe('component.UI.PasswordInput', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<PasswordInput field="password" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
