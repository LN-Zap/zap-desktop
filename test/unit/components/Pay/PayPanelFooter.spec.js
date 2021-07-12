import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayPanelFooter } from 'components/Pay'
import { PAY_FORM_STEPS } from 'components/Pay/constants'

const props = {
  amountInSats: 1,
  channelBalance: 1,
  cryptoUnitName: 'sats',
  formState: {
    values: {
      isCoinSweep: false,
    },
  },
  previousStep: () => {},
  walletBalanceConfirmed: 1,
}

describe('component.Pay.PayPanelFooter', () => {
  describe('current step is "address"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelFooter {...props} currentStep={PAY_FORM_STEPS.address} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is "summary"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayPanelFooter {...props} currentStep={PAY_FORM_STEPS.summary} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
