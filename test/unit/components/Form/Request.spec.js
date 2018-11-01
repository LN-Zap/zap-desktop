import React from 'react'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { ThemeProvider } from 'styled-components'
import Request from 'components/Form/Request'
import { dark } from 'themes'
import { mountWithIntl } from '../../__helpers__/intl-enzyme-test-helper'

configure({ adapter: new Adapter() })

const defaultProps = {
  requestform: {},
  ticker: {
    currency: 'btc',
    fiatTicker: 'USD'
  },

  currencyFilters: [],
  currencyName: '',
  requestFiatAmount: '',

  setRequestAmount: () => {},
  setRequestMemo: () => {},
  setCurrency: () => {},

  onRequestSubmit: () => {}
}

describe('Form', () => {
  describe('should show request form when formType is REQUEST_FORM', () => {
    const props = { ...defaultProps }
    const el = mountWithIntl(
      <ThemeProvider theme={dark}>
        <Request {...props} />
      </ThemeProvider>
    )
    it('should contain Request', () => {
      expect(el.contains('Request Payment')).toBe(true)
    })
  })
})
