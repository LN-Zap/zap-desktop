import React from 'react'
import renderer from 'react-test-renderer'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Sidebar } from 'components/UI'

configure({ adapter: new Adapter() })

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
