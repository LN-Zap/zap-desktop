import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Countdown } from 'components/UI'

describe('component.UI.Countdown', () => {
  it('should render correctly with default props', () => {
    const wrapper = shallow(<Countdown date={new Date(Date.UTC('2009-01-03T18:15:05+00:00'))} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
