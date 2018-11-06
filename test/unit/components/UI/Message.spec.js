import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Message } from 'components/UI'

describe('component.UI.Message', () => {
  it('should render correctly with default props', () => {
    const wrapper = shallow(<Message>A message</Message>)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
