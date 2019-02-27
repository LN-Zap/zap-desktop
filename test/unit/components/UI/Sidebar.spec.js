import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { Sidebar } from 'components/UI'

describe('component.UI.Sidebar', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Sidebar />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('Sidenbar.{small|medium|large}', () => {
    it(`should render a sidebar of the correct size`, () => {
      const sizes = ['small', 'medium', 'large']
      sizes.forEach(size => {
        const Element = Sidebar[size]
        const wrapper = mount(<Element />)
        expect(wrapper.find(Sidebar[size])).toHaveLength(1)
      })
    })
  })
})
