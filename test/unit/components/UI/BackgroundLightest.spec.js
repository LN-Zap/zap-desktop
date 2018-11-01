import React from 'react'
import renderer from 'react-test-renderer'
import { BackgroundLightest } from 'components/UI'

describe('component.UI.BackgroundLightest', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundLightest />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
