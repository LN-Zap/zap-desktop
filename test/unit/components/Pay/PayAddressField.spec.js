import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { PayAddressField } from 'components/Pay'
import { PAY_FORM_STEPS } from 'components/Pay/constants'

const props = {
  chain: 'Bitcoin',
  handlePayReqChange: () => {},
  intl: {},
  isLn: null,
  network: 'testnet',
  redirectPayReq: {},
  formState: { values: {}, submits: 0 },
}

describe('component.Pay.PayAddressField', () => {
  describe('current step is "address"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PayAddressField {...props} currentStep={PAY_FORM_STEPS.address} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is "summary"', () => {
    describe('and it is an LN transaction', () => {
      it('should render correctly', () => {
        const wrapper = shallow(
          <PayAddressField {...props} currentStep={PAY_FORM_STEPS.summary} isLn />
        )
        expect(toJSON(wrapper)).toMatchSnapshot()
      })
    })

    describe('and it is an on-chain transaction', () => {
      it('should render correctly', () => {
        const wrapper = shallow(
          <PayAddressField {...props} currentStep={PAY_FORM_STEPS.summary} isLn={false} />
        )
        expect(toJSON(wrapper)).toMatchSnapshot()
      })
    })
  })
})
