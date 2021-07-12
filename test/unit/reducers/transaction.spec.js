import reducer, {
  GET_TRANSACTIONS,
  RECEIVE_TRANSACTIONS,
  SEND_TRANSACTION,
  TRANSACTION_SUCCESSFUL,
  TRANSACTION_FAILED,
  TRANSACTION_COMPLETE,
} from 'reducers/transaction'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('transactionReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle GET_TRANSACTIONS', () => {
      const action = {
        type: GET_TRANSACTIONS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_TRANSACTIONS', () => {
      const action = {
        type: RECEIVE_TRANSACTIONS,
        transactions: [{ some: 'transaction' }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SEND_TRANSACTION', () => {
      const action = {
        type: SEND_TRANSACTION,
        transaction: { some: 'data' },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle TRANSACTION_SUCCESSFUL', () => {
      const action = {
        type: TRANSACTION_SUCCESSFUL,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle TRANSACTION_FAILED', () => {
      const action = {
        type: TRANSACTION_FAILED,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle TRANSACTION_COMPLETE', () => {
      const action = {
        type: TRANSACTION_COMPLETE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
