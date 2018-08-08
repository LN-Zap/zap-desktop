import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Request from 'components/Form/Request'

configure({ adapter: new Adapter() })

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

  onRequestSubmit: () => {}
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
