import React from 'react'
import Bar from 'components/UI/Bar'
import renderer from 'react-test-renderer'

describe('component.UI.Bar', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Bar />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
