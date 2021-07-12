import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayHeader } from 'components/Pay'

describe('component.Pay.PayHeader', () => {
  describe('onchain', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayHeader title="Send Bitcoin" type="onchain" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('offchain', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayHeader title="Send Bitcoin" type="offchain" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
  describe('generic', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayHeader title="Send Bitcoin" />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
