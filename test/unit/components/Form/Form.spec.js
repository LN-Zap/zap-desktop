import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Form } from 'components/Form'

describe('component.UI.Form', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Form />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
