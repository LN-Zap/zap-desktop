import React from 'react'
import renderer from 'react-test-renderer'
import { Bar } from 'components/UI'

describe('component.UI.Bar', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Bar />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
