import React from 'react'
import Page from 'components/UI/Page'
import renderer from 'react-test-renderer'

describe('component.UI.Page', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Page />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
