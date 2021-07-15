import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayAddressField } from 'components/Pay'
import { PAY_FORM_STEPS, PAYMENT_TYPES } from 'components/Pay/constants'

const props = {
  chain: 'Bitcoin',
  handlePayReqChange: () => {},
  intl: {},
  network: 'testnet',
  redirectPayReq: {},
  formState: { values: {}, submits: 0 },
}

describe('component.Pay.PayAddressField', () => {
  describe('current step is "address"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <PayAddressField
          {...props}
          currentStep={PAY_FORM_STEPS.address}
          paymentType={PAYMENT_TYPES.none}
        />
      )
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is "summary"', () => {
    describe('and it is an LN transaction', () => {
      it('should render correctly', () => {
        const wrapper = shallow(
          <PayAddressField
            {...props}
            currentStep={PAY_FORM_STEPS.summary}
            paymentType={PAYMENT_TYPES.bolt11}
          />
        )
        expect(toJSON(wrapper)).toMatchSnapshot()
      })
    })

    describe('and it is an on-chain transaction', () => {
      it('should render correctly', () => {
        const wrapper = shallow(
          <PayAddressField
            {...props}
            currentStep={PAY_FORM_STEPS.summary}
            paymentType={PAYMENT_TYPES.onchain}
          />
        )
        expect(toJSON(wrapper)).toMatchSnapshot()
      })
    })
  })
})
