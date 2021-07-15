import reducer, {
  GET_PAYMENTS,
  RECEIVE_PAYMENTS,
  SEND_PAYMENT,
  PAYMENT_SUCCESSFUL,
  PAYMENT_COMPLETED,
  PAYMENT_FAILED,
  DECREASE_PAYMENT_RETRIES,
} from 'reducers/payment'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('paymentReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle GET_PAYMENTS', () => {
      const action = {
        type: GET_PAYMENTS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_PAYMENTS', () => {
      const action = {
        type: RECEIVE_PAYMENTS,
        payments: [
          { some: 'data', paymentHash: '1' },
          { some: 'data', paymentHash: '2' },
        ],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SEND_PAYMENT', () => {
      const action = {
        type: SEND_PAYMENT,
        payment: { some: 'data' },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle PAYMENT_SUCCESSFUL', () => {
      const action = {
        type: PAYMENT_SUCCESSFUL,
        paymentId: '123abc',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle PAYMENT_COMPLETED', () => {
      const action = {
        type: PAYMENT_COMPLETED,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle PAYMENT_FAILED', () => {
      const action = {
        type: PAYMENT_FAILED,
        paymentRequest: 'somepaymentrequest',
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle DECREASE_PAYMENT_RETRIES', () => {
      const action = {
        type: DECREASE_PAYMENT_RETRIES,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
