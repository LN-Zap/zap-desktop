import React from 'react'
import renderer from 'react-test-renderer'
import { Spinner } from 'components/UI'

describe('component.UI.Spinner', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Spinner />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
