import React from 'react'
import renderer from 'react-test-renderer'
import { Page } from 'components/UI'

describe('component.UI.Page', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Page />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
