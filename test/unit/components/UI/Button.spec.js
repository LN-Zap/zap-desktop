import React from 'react'
import Button from 'components/UI/Button'
import renderer from 'react-test-renderer'

describe('component.UI.Button', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Button />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
