import React from 'react'
import BackgroundLight from 'components/UI/BackgroundLight'
import renderer from 'react-test-renderer'

describe('component.UI.BackgroundLight', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundLight />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
