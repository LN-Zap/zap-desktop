import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Request from 'components/Form/Request'

import { mountWithIntl } from '../../__helpers__/intl-enzyme-test-helper.js'

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
    const el = mountWithIntl(<Request {...props} />)
    it('should contain Request', () => {
      expect(el.contains('Request Payment')).toBe(true)
    })
  })
})
