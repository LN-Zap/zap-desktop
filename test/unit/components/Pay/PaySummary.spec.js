import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PaySummary } from 'components/Pay'
import { PAY_FORM_STEPS } from 'components/Pay/constants'

const props = {
  amountInSats: 1,
  formApi: {},
  lndTargetConfirmations: {
    fast: 10,
    medium: 5,
    slow: 1,
  },
}

describe('component.Pay.PaySummary', () => {
  describe('current step is "summary"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PaySummary {...props} currentStep={PAY_FORM_STEPS.summary} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('current step is "amount"', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<PaySummary {...props} currentStep={PAY_FORM_STEPS.amount} />)
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})
