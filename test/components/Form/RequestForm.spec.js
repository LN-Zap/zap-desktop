import React from 'react'
import { shallow } from 'enzyme'

import RequestForm from '../../../app/components/Form/RequestForm'

const defaultProps = {
  requestform: {
    amount: '',
    showErrors: {}
  },
  currency: '',
  crypto: '',

  setRequestAmount: () => {},
  setRequestMemo: () => {},

  onRequestSubmit: () => {}
}

describe('Form', () => {
  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps }
    const el = shallow(<RequestForm {...props} />)
    it('should contain RequestForm', () => {
      expect(el.contains('Request')).toBe(true)
    })
  })
})
