import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Pay from 'components/Form/Pay'

configure({ adapter: new Adapter() })

const defaultProps = {
  payform: {
    amount: 0,
    payInput: '',
    invoice: {},
    showErrors: {}
  },
  currency: '',
  crypto: '',
  nodes: [],
  ticker: {
    currency: 'btc'
  },

  isOnchain: false,
  isLn: true,
  currentAmount: 0,
  usdAmount: 0,
  inputCaption: '',
  showPayLoadingScreen: true,
  payFormIsValid: {},
  currentCurrencyFilters: [],
  currencyName: '',

  setPayAmount: () => {},
  setPayInput: () => {},
  setCurrencyFilters: () => {},
  fetchInvoice: () => {},
  setCurrency: () => {},

  onPayAmountBlur: () => {},

  onPayInputBlur: () => {},

  onPaySubmit: () => {}
}

describe('Form', () => {
  describe('should show the form without an input', () => {
    const el = mount(<Pay {...defaultProps} />)

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })

  describe('should show lightning with a lightning input', () => {
    const props = { ...defaultProps, isLn: true }
    const el = mount(<Pay {...props} />)

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })

  describe('should show on-chain with an on-chain input', () => {
    const props = { ...defaultProps, isOnchain: true }
    const el = mount(<Pay {...props} />)

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })
})
