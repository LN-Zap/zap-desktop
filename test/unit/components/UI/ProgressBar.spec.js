import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { ProgressBar } from 'components/UI'

describe('component.UI.ProgressBar', () => {
  it('should render correctly (default)', () => {
    const wrapper = shallow(<ProgressBar />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly (50%)', () => {
    const wrapper = shallow(<ProgressBar progress={0.5} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly (100%)', () => {
    const wrapper = shallow(<ProgressBar progress={1} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly (right justify)', () => {
    const wrapper = shallow(<ProgressBar progress={0.5} justify="right" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should render correctly (blue)', () => {
    const wrapper = shallow(<ProgressBar progress={0.5} color="superBlue" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
