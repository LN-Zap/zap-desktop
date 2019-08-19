import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { PayPanelHeader } from 'components/Pay'

const props = {
  chainName: 'Bitcoin',
  cryptoUnitName: 'satoshis',
}

describe('component.Pay.PayPanelHeader', () => {
  describe('is an LN transaction', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelHeader {...props} isLn />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('is an on-chain transaction', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelHeader {...props} isOnchain />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
