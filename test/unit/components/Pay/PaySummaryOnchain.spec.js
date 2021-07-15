import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PaySummaryOnChain } from 'components/Pay'

const props = {
  amount: 1000,
  address: 'mmxyr3LNKbnbrf6jdGXZpCE4EDpMSZRf4c',
  currentTicker: {
    USD: 6477.78,
    EUR: 5656.01,
    GBP: 5052.73,
  },
  cryptoUnit: 'btc',
  cryptoUnitName: 'BTC',
  cryptoUnits: [
    {
      key: 'btc',
      name: 'BTC',
    },
    {
      key: 'bits',
      name: 'bits',
    },
    {
      key: 'sats',
      name: 'satoshis',
    },
  ],
  fiatCurrency: 'USD',
  lndTargetConfirmations: {
    fast: 100,
    medium: 80,
    slow: 60,
  },
  queryFees: jest.fn(),
  setCryptoCurrency: jest.fn(),
}

describe('component.Form.PaySummaryOnchain', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<PaySummaryOnChain {...props} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
