import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayButtons } from 'components/Pay'

describe('component.Form.PayButtons', () => {
  it('should render correctly with default props', () => {
    const wrapper = shallow(<PayButtons />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
