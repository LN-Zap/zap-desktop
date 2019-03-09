import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { Header } from 'components/UI'

describe('component.UI.Header', () => {
  it('should render correctly with default props', () => {
    const wrapper = shallow(<Header />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  it('should render correctly with title', () => {
    const wrapper = shallow(<Header title="title here" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  it('should render correctly with subtitle', () => {
    const wrapper = shallow(<Header subtitle="subtitle here" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  it('should render correctly with logo', () => {
    const wrapper = shallow(<Header logo="logo here" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  it('should render correctly with title, subtitle, and logo', () => {
    const wrapper = shallow(<Header logo="logo here" subtitle="logo here" title="title here" />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
