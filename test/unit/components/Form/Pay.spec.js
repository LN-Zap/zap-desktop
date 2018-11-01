import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-styled-components'
import { ThemeProvider } from 'styled-components'
import Pay from 'components/Form/Pay'
import { dark } from 'themes'
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
  currencyFilters: [],
  currencyName: '',

  setPayAmount: () => {},
  setPayInput: () => {},
  fetchInvoice: () => {},
  setCurrency: () => {},

  onPayAmountBlur: () => {},

  onPayInputBlur: () => {},

  onPaySubmit: () => {}
}

describe('Form', () => {
  describe('should show the form without an input', () => {
    const el = mountWithIntl(
      <ThemeProvider theme={dark}>
        <Pay {...defaultProps} />
      </ThemeProvider>
    )

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })

  describe('should show lightning with a lightning input', () => {
    const props = { ...defaultProps, isLn: true }
    const el = mountWithIntl(
      <ThemeProvider theme={dark}>
        <Pay {...props} />
      </ThemeProvider>
    )

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })

  describe('should show on-chain with an on-chain input', () => {
    const props = { ...defaultProps, isOnchain: true }
    const el = mountWithIntl(
      <ThemeProvider theme={dark}>
        <Pay {...props} />
      </ThemeProvider>
    )

    it('should contain Pay', () => {
      expect(el.find('input#paymentRequest').props.value).toBe(undefined)
    })
  })
})
