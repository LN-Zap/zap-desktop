import React from 'react'
import renderer from 'react-test-renderer'
import { Panel } from 'components/UI'

describe('component.UI.Panel', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <Panel>
          <Panel.Header>Header here</Panel.Header>
          <Panel.Body>Body here</Panel.Body>
          <Panel.Footer>Footer here</Panel.Footer>
        </Panel>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
