import React from 'react'

import { renderWithTheme } from '@zap/test/unit/__helpers__/renderWithTheme'
import { Panel } from 'components/UI'

describe('component.UI.Panel', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <Panel>
        <Panel.Header>Header here</Panel.Header>
        <Panel.Body>Body here</Panel.Body>
        <Panel.Footer>Footer here</Panel.Footer>
      </Panel>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
