import React from 'react'
import { shallow } from 'enzyme'

import Request from '../../../app/components/Form/Request'

const defaultProps = {
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

describe('Form', () => {
  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps }
    const el = shallow(<Request {...props} />)
    it('should contain Request', () => {
      expect(el.contains('Request')).toBe(true)
    })
  })
})
