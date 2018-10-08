import React from 'react'
import Modal from 'components/UI/Modal'
import renderer from 'react-test-renderer'

describe('component.UI.Modal', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Modal />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
