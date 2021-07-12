import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { DataRow } from 'components/UI'

describe('component.Form.DataRow', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<DataRow left="left contnet" right="right content" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
