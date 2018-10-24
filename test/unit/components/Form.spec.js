import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Form from 'components/Form'
import Pay from 'components/Form/Pay'
import Request from 'components/Form/Request'

configure({ adapter: new Adapter() })

const payFormProps = {
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

const requestFormProps = {
  requestform: {},
  ticker: {},

  currencyFilters: [],
  currencyName: '',
  requestFiatAmount: '',

  setRequestAmount: () => {},
  setRequestMemo: () => {},
  setCurrency: () => {},

  onRequestSubmit: () => {}
}

const defaultProps = {
  formType: '',
  formProps: {},
  closeForm: () => {}
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
