import React from 'react'
import { shallow } from 'enzyme'

import Form from '../../app/components/Form'
import Pay from '../../app/components/Form/Pay'
import Request from '../../app/components/Form/Request'

const payFormProps = {
  payform: {
    amount: 0,
    payInput: '',
    invoice: {},
    showErrors: {},
  },
  currency: {},
  crypto: {},
  nodes: [],
  ticker: {},

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

  onPaySubmit: () => {},
}

const requestFormProps = {
  requestform: {},
  ticker: {},

  currentCurrencyFilters: [],
  showCurrencyFilters: true,
  currencyName: '',
  requestUsdAmount: '',

  setRequestAmount: () => {},
  setRequestMemo: () => {},
  setCurrency: () => {},
  setRequestCurrencyFilters: () => {},

  onRequestSubmit: () => {},
}

const defaultProps = {
  formType: '',
  formProps: {},
  closeForm: () => {},
}

describe('Form', () => {
  describe('should show pay form when formType is PAY_FORM', () => {
    const props = { ...defaultProps, formType: 'PAY_FORM', formProps: payFormProps }
    const el = shallow(<Form {...props} />)
    it('should contain Pay', () => {
      expect(el.find(Pay)).toHaveLength(1)
    })
  })

  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps, formType: 'REQUEST_FORM', formProps: requestFormProps }
    const el = shallow(<Form {...props} />)
    it('should contain Request', () => {
      expect(el.find(Request)).toHaveLength(1)
    })
  })
})
