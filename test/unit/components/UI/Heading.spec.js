import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import { Heading } from 'components/UI'

describe('component.UI.Heading', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<Heading>Heading here</Heading>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('Heading.{h1|h2|h3|h4|h5|h6}', () => {
    it(`should render a heading of the correct level`, () => {
      for (var i = 1; i <= 6; i++) {
        const Element = Heading[`h${i}`]
        const wrapper = mount(<Element>Heading here</Element>)
        expect(wrapper.find(`h${i}`)).toHaveLength(1)
      }
    })
  })
})
