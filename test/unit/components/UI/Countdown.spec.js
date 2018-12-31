import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Countdown } from 'components/UI'

describe('component.UI.Countdown', () => {
  it('should render correctly with default props', () => {
    const wrapper = shallow(<Countdown date={new Date(0)} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
