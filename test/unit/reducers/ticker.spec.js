// @flow

import tickerReducer, {
  SET_CURRENCY,
  SET_CRYPTO,
  GET_TICKERS,
  RECIEVE_TICKERS,
} from 'reducers/ticker'

describe('reducers', () => {
  describe('tickerReducer', () => {
    it('should handle initial state', () => {
      expect(tickerReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_CURRENCY', () => {
      expect(SET_CURRENCY).toEqual('SET_CURRENCY')
    })

    it('should have SET_CRYPTO', () => {
      expect(SET_CRYPTO).toEqual('SET_CRYPTO')
    })

    it('should have GET_TICKER', () => {
      expect(GET_TICKERS).toEqual('GET_TICKERS')
    })

    it('should have RECIEVE_TICKER', () => {
      expect(RECIEVE_TICKERS).toEqual('RECIEVE_TICKERS')
    })

    it('should correctly setCurrency', () => {
      expect(tickerReducer(undefined, { type: SET_CURRENCY, currency: 'foo' })).toMatchSnapshot()
    })

    it('should correctly setCrypto', () => {
      expect(tickerReducer(undefined, { type: SET_CRYPTO, crypto: 'foo' })).toMatchSnapshot()
    })

    it('should correctly getTicker', () => {
      expect(tickerReducer(undefined, { type: GET_TICKERS })).toMatchSnapshot()
    })

    it('should correctly receiveTicker', () => {
      expect(tickerReducer(undefined, { type: RECIEVE_TICKERS, ticker: 'foo' })).toMatchSnapshot()
    })
  })
})
