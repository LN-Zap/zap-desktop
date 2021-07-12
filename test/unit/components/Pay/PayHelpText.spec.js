import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PayHelpText } from 'components/Pay'
import { PAY_FORM_STEPS } from 'components/Pay/constants'

const props = {
  chainName: 'Bitcoin',
  cryptoUnitName: 'sats',
}

describe('component.Pay.PayHelpText', () => {
  describe('initial payment request state', () => {
    it('should render correctly', () => {
      const wrapper = shallow(
        <PayHelpText {...props} currentStep={PAY_FORM_STEPS.amount} redirectPayReq={{}} />
      )
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('no payment request', () => {
    describe('and current step is "address"', () => {
      it('should render correctly', () => {
        const wrapper = shallow(<PayHelpText {...props} currentStep={PAY_FORM_STEPS.address} />)
        expect(toJSON(wrapper)).toMatchSnapshot()
      })
    })

    describe('and current step is "summary"', () => {
      it('should render correctly', () => {
        const wrapper = shallow(<PayHelpText {...props} currentStep={PAY_FORM_STEPS.summary} />)
        expect(toJSON(wrapper)).toMatchSnapshot()
      })
    })
  })
})
