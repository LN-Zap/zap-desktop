import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayPanelBody } from 'components/Pay'
import { PAY_FORM_STEPS, PAYMENT_TYPES } from 'components/Pay/constants'

const props = {
  amountInSats: '1',
  chain: 'testnet',
  chainName: 'Bitcoin',
  cryptoUnit: 'sats',
  cryptoUnitName: 'satoshi',
  formApi: {},
  formState: {},
  handlePayReqChange: () => {},
  intl: {},
  lndTargetConfirmations: {
    fast: 10,
    medium: 5,
    slow: 1,
  },
  network: '',
  paymentType: PAYMENT_TYPES.none,
  queryFees: () => {},
  walletBalanceConfirmed: '1',
}

describe('component.Pay.PayPanelBody', () => {
  describe('current step is summary', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelBody {...props} currentStep={PAY_FORM_STEPS.summary} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is not summary', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelBody {...props} currentStep={PAY_FORM_STEPS.amount} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
