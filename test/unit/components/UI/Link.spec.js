import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Link } from 'components/UI'

describe('component.UI.Link', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(<Link>Link text</Link>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
