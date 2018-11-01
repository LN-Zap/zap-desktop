import React from 'react'
import renderer from 'react-test-renderer'
import { BackgroundDark } from 'components/UI'

describe('component.UI.BackgroundDark', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundDark />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
