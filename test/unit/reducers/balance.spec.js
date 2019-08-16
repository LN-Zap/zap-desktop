import snapshotDiff from '../__helpers__/snapshotDiff'
import reducer, {
  FETCH_BALANCE,
  FETCH_BALANCE_SUCCESS,
  FETCH_BALANCE_FAILURE,
} from 'reducers/balance'

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
          total_balance: 1,
          confirmed_balance: 1,
          unconfirmed_balance: 1,
        },
        channelBalance: {
          balance: 1,
          pending_open_balance: 1,
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
