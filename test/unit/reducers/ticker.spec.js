import reducer, { GET_TICKERS, RECIEVE_TICKERS } from 'reducers/ticker'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('tickerReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle GET_TICKERS', () => {
      const action = {
        type: GET_TICKERS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECIEVE_TICKERS', () => {
      const action = {
        type: RECIEVE_TICKERS,
        rates: {
          some: 'data',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
