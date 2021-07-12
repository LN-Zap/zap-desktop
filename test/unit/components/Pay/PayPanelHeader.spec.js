import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayPanelHeader } from 'components/Pay'
import { PAYMENT_TYPES } from 'components/Pay/constants'

const props = {
  chainName: 'Bitcoin',
  cryptoUnitName: 'satoshis',
}

describe('component.Pay.PayPanelHeader', () => {
  describe('is an LN transaction', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelHeader {...props} paymentType={PAYMENT_TYPES.bolt11} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('is an on-chain transaction', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelHeader {...props} paymentType={PAYMENT_TYPES.onchain} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
