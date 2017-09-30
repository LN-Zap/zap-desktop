import React from 'react'
import { shallow } from 'enzyme'

import Form from '../../app/components/Form'
import PayForm from '../../app/components/Form/PayForm'
import RequestForm from '../../app/components/Form/RequestForm'

const payFormProps = {
  payform: {},
  currency: 'BTC',
  crypto: 'BTC',

  isOnchain: false,
  isLn: false,
  currentAmount: '0',
  inputCaption: '',
  showPayLoadingScreen: false,

  setPayAmount: () => {},
  setPayInput: () => {},
  fetchInvoice: () => {},


  onPaySubmit: () => {}
}

const requestFormProps = {
  requestform: {},
  currency: '',
  crypto: '',

  setRequestAmount: () => {},
  setRequestMemo: () => {},

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
    it('should contain PayForm', () => {
      expect(el.find(PayForm)).toHaveLength(1)
    })
  })

  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps, formType: 'REQUEST_FORM', formProps: requestFormProps }
    const el = shallow(<Form {...props} />)
    it('should contain RequestForm', () => {
      expect(el.find(RequestForm)).toHaveLength(1)
    })
  })
})
