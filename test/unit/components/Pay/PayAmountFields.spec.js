import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayAmountFields } from 'components/Pay'
import { PAY_FORM_STEPS } from 'components/Pay/constants'

const getFormApi = values => {
  return {
    getState: () => {
      return {
        values,
      }
    },
  }
}

const props = {
  cryptoUnit: 'sats',
  formApi: getFormApi({ isCoinSweep: false }),
  initialAmountCrypto: '1',
  initialAmountFiat: '1',
  intl: {},
  isOnchain: false,
  isQueryingFees: true,
  lndTargetConfirmations: {
    fast: 6,
    medium: 3,
    slow: 1,
  },
  onchainFees: {
    fast: 10,
    medium: 5,
    slow: 1,
  },
  queryFees: () => {},
  walletBalanceConfirmed: '1',
}

describe('component.Pay.PayAmountFields', () => {
  describe('current step is "amount"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayAmountFields {...props} currentStep={PAY_FORM_STEPS.amount} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is "address"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayAmountFields {...props} currentStep={PAY_FORM_STEPS.address} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is "summary"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayAmountFields {...props} currentStep={PAY_FORM_STEPS.summary} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
