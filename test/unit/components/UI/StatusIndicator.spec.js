import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { StatusIndicator } from 'components/UI'

describe('component.UI.StatusIndicator', () => {
  describe('online', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<StatusIndicator variant="online" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('offline', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<StatusIndicator variant="offline" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('pending', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<StatusIndicator variant="pending" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('closing', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<StatusIndicator variant="closing" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
