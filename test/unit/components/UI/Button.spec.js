import React from 'react'
import renderer from 'react-test-renderer'
import { Button } from 'components/UI'

describe('component.UI.Button', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Button />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
