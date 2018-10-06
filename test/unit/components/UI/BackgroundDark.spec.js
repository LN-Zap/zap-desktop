import React from 'react'
import BackgroundDark from 'components/UI/BackgroundDark'
import renderer from 'react-test-renderer'

describe('component.UI.BackgroundDark', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundDark />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
