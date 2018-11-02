import React from 'react'
import renderer from 'react-test-renderer'
import { Form } from 'components/UI'

describe('component.UI.Form', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Form />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
