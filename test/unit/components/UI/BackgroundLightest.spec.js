import React from 'react'
import renderer from 'react-test-renderer'
import { BackgroundSecondary } from 'components/UI'

describe('component.UI.BackgroundSecondary', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundSecondary />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
