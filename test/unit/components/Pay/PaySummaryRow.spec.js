import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { PaySummaryRow } from 'components/Pay'

describe('component.Form.PaySummaryRow', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<PaySummaryRow left="left contnet" right="right content" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
