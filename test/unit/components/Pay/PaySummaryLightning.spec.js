import React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { PaySummaryLightning } from 'components/Pay'

const props = {
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
  /* eslint-disable max-len */
  payReq:
    'lntb100u1pdaxza7pp5x73t3j7xgvkzgcdvzgpdg74k4pn0uhwuxlxu9qssytjn77x7zs4qdqqcqzysxqyz5vqd20eaq5uferzgzwasu5te3pla7gv8tzk8gcdxlj7lpkygvfdwndhwtl3ezn9ltjejl3hsp36ps3z3e5pp4rzp2hgqjqql80ec3hyzucq4d9axl',
  setCryptoCurrency: jest.fn(),
}
describe('component.Form.PaySummaryLightning', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<PaySummaryLightning {...props} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})
