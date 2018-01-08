import React from 'react'
import { shallow } from 'enzyme'

import PayForm from '../../../app/components/Form/PayForm'

const defaultProps = {
  payform: {
    amount: '',
    payInput: '',
    showErrors: {}
  },
  currency: 'BTC',
  crypto: 'BTC',

  isOnchain: false,
  isLn: false,
  currentAmount: '0',
  inputCaption: '',
  showPayLoadingScreen: false,
  payFormIsValid: {},

  setPayAmount: () => {},
  onPayAmountBlur: () => {},
  setPayInput: () => {},
  onPayInputBlur: () => {},
  fetchInvoice: () => {},

  onPaySubmit: () => {}
}

describe('Form', () => {
  describe('should show the form without an input', () => {
    const el = shallow(<PayForm {...defaultProps} />)

    it('should contain PayForm', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
      expect(el.contains('lightning network')).toBe(false)
      expect(el.contains('on-chain')).toBe(false)
    })
  })
})
