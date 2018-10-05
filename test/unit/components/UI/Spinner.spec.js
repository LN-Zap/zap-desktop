import React from 'react'
import Spinner from 'components/UI/Spinner'
import renderer from 'react-test-renderer'

describe('component.UI.Spinner', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Spinner />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
