import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Request from 'components/Form/Request'

configure({ adapter: new Adapter() })

const defaultProps = {
  requestform: {},
  ticker: {
    currency: 'btc'
  },

  currentCurrencyFilters: [],
  showCurrencyFilters: true,
  currencyName: '',
  requestFiatAmount: '',

  setRequestAmount: () => {},
  setRequestMemo: () => {},
  setCurrency: () => {},
  setRequestCurrencyFilters: () => {},

  onRequestSubmit: () => {}
}

describe('Form', () => {
  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps }
    const el = mount(<Request {...props} />)
    it('should contain Request', () => {
      expect(el.contains('Request')).toBe(true)
    })
  })
})
