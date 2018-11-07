import React from 'react'
import renderer from 'react-test-renderer'
import { BackgroundTertiary } from 'components/UI'

describe('component.UI.BackgroundTertiary', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<BackgroundTertiary />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
