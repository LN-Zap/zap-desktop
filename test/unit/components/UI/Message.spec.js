import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Message } from 'components/UI'

describe('component.UI.Message', () => {
  it('should render correctly with default props', () => {
    const wrapper = renderWithTheme(<Message>A message</Message>).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
