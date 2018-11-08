import React from 'react'
import renderer from 'react-test-renderer'
import { BackgroundPrimary } from 'components/UI'

describe('component.UI.BackgroundPrimary', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundPrimary />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
