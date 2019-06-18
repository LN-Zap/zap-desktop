/* eslint-disable import/named */
import { requestTickerWithFallback, requestTicker } from '@zap/utils/rateProvider'

// Mock the requestTicker method so that it:
// - errros the first time
// - returns no data the second time
// - succeeds the third time
jest.mock('@zap/utils/rateProvider/requestTicker', () =>
  jest
    .fn()
    .mockImplementationOnce(async () => new Error('Some error'))
    .mockImplementationOnce(async () => ({}))
    .mockImplementationOnce(async () => ({ USD: [] }))
)

// Mock `getSupportedProviders.
jest.mock('@zap/utils/rateProvider/providers', () => ({
  getSupportedProviders: jest
    .fn()
    .mockReturnValue({ coinbase: {}, bitstamp: {}, kraken: {}, bitfinex: {} }),
}))

describe('requestTickerWithFallback', () => {
  test(`request tickets from fallback providers`, async () => {
    const provider = 'coinbase'
    const coin = 'BTC'
    const currency = 'USD'
    await requestTickerWithFallback(provider, coin, currency)

    expect(requestTicker).toHaveBeenCalledTimes(3)
    expect(requestTicker).toHaveBeenNthCalledWith(1, provider, coin, currency)
    expect(requestTicker).toHaveBeenNthCalledWith(2, 'bitstamp', coin, currency)
    expect(requestTicker).toHaveBeenNthCalledWith(3, 'kraken', coin, currency)
  })
})
