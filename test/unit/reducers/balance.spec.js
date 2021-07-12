import reducer, {
  FETCH_BALANCE,
  FETCH_BALANCE_SUCCESS,
  FETCH_BALANCE_FAILURE,
} from 'reducers/balance'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('balanceReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle FETCH_BALANCE', () => {
      const action = {
        type: FETCH_BALANCE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_BALANCE_SUCCESS', () => {
      const action = {
        type: FETCH_BALANCE_SUCCESS,
        walletBalance: {
          totalBalance: '1',
          confirmedBalance: '1',
          unconfirmedBalance: '1',
        },
        channelBalance: {
          balance: '1',
          pendingOpenBalance: '1',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_BALANCE_FAILURE', () => {
      const action = {
        type: FETCH_BALANCE_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
