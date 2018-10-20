import React from 'react'
import renderer from 'react-test-renderer'
import { BackgroundLight } from 'components/UI'

describe('component.UI.BackgroundLight', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundLight />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
