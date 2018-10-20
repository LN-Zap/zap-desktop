import React from 'react'
import renderer from 'react-test-renderer'
import { Modal } from 'components/UI'

describe('component.UI.Modal', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Modal />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
