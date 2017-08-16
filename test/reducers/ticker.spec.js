import tickerReducer, {
  SET_CURRENCY,
  GET_TICKER,
  RECIEVE_TICKER
} from '../../app/reducers/ticker'

describe('reducers', () => {
  describe('tickerReducer', () => {
    it('should handle initial state', () => {
      expect(tickerReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_CURRENCY', () => {
      expect(SET_CURRENCY).toEqual('SET_CURRENCY')
    })

    it('should have GET_TICKER', () => {
      expect(GET_TICKER).toEqual('GET_TICKER')
    })

    it('should have RECIEVE_TICKER', () => {
      expect(RECIEVE_TICKER).toEqual('RECIEVE_TICKER')
    })

    it('should correctly setCurrency', () => {
      expect(tickerReducer(undefined, { type: SET_CURRENCY, currency: 'foo' })).toMatchSnapshot()
    })

    it('should correctly getTicker', () => {
      expect(tickerReducer(undefined, { type: GET_TICKER })).toMatchSnapshot()
    })

    it('should correctly receiveTicker', () => {
      expect(tickerReducer(undefined, { type: RECIEVE_TICKER, ticker: 'foo' })).toMatchSnapshot()
    })
  })
})
