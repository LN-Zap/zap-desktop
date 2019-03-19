import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Card } from 'components/UI'

describe('component.UI.Card', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Card>content</Card>)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
