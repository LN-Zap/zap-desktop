import React from 'react'
import renderer from 'react-test-renderer'
import { Text } from 'components/UI'

describe('component.UI.Text', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Text />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
