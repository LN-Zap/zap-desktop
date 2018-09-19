import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Pay from 'components/Form/Pay'

import { mountWithIntl } from '../../__helpers__/intl-enzyme-test-helper'

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
    currency: 'btc',
    fiatTicker: 'USD'
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
    const el = mountWithIntl(<Pay {...defaultProps} />)

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })

  describe('should show lightning with a lightning input', () => {
    const props = { ...defaultProps, isLn: true }
    const el = mountWithIntl(<Pay {...props} />)

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })

  describe('should show on-chain with an on-chain input', () => {
    const props = { ...defaultProps, isOnchain: true }
    const el = mountWithIntl(<Pay {...props} />)

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })
})
