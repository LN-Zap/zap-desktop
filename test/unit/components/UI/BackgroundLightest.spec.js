import React from 'react'
import BackgroundLightest from 'components/UI/BackgroundLightest'
import renderer from 'react-test-renderer'

describe('component.UI.BackgroundLightest', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundLightest />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
