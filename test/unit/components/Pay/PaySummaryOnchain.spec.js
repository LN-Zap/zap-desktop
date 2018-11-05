import React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { PaySummaryOnChain } from 'components/Pay'

const props = {
  amount: 1000,
  address: 'mmxyr3LNKbnbrf6jdGXZpCE4EDpMSZRf4c',
  currentTicker: {
    USD: {
      last: 6477.78
    },
    EUR: {
      last: 5656.01
    },
    GBP: {
      last: 5052.73
    }
  },
  cryptoCurrency: 'btc',
  cryptoCurrencyTicker: 'BTC',
  cryptoCurrencies: [
    {
      key: 'btc',
      name: 'BTC'
    },
    {
      key: 'bits',
      name: 'bits'
    },
    {
      key: 'sats',
      name: 'satoshis'
    }
  ],
  fiatCurrency: 'USD',
  queryFees: jest.fn(),
  setCryptoCurrency: jest.fn()
}

describe('component.Form.PaySummaryOnchain', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<PaySummaryOnChain {...props} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
