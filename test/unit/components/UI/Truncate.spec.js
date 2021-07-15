import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Truncate } from 'components/Util'

describe('component.UI.Truncate', () => {
  it('should truncate text to 12 chars by default', () => {
    const tree = renderWithTheme(
      <Truncate text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should truncate test to a specific length when the maxlen parm is provided', () => {
    const tree = renderWithTheme(
      <Truncate maxlen={30} text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
