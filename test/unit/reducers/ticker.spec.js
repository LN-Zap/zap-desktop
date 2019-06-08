import tickerReducer, { GET_TICKERS, RECIEVE_TICKERS } from 'reducers/ticker'

describe('reducers', () => {
  describe('tickerReducer', () => {
    it('should handle initial state', () => {
      expect(tickerReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have GET_TICKER', () => {
      expect(GET_TICKERS).toEqual('GET_TICKERS')
    })

    it('should have RECIEVE_TICKER', () => {
      expect(RECIEVE_TICKERS).toEqual('RECIEVE_TICKERS')
    })

    it('should correctly getTicker', () => {
      expect(tickerReducer(undefined, { type: GET_TICKERS })).toMatchSnapshot()
    })

    it('should correctly receiveTicker', () => {
      expect(tickerReducer(undefined, { type: RECIEVE_TICKERS, ticker: 'foo' })).toMatchSnapshot()
    })
  })
})
