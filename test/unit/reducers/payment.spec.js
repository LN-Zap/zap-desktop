// @flow

import paymentReducer, {
  SET_PAYMENT,
  GET_PAYMENTS,
  RECEIVE_PAYMENTS,
  SEND_PAYMENT,
  PAYMENT_SUCCESSFUL,
  PAYMENT_FAILED
} from 'reducers/payment'

describe('reducers', () => {
  describe('paymentReducer', () => {
    it('should handle initial state', () => {
      expect(paymentReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have SET_PAYMENT', () => {
      expect(SET_PAYMENT).toEqual('SET_PAYMENT')
    })

    it('should have RECEIVE_PAYMENTS', () => {
      expect(RECEIVE_PAYMENTS).toEqual('RECEIVE_PAYMENTS')
    })

    it('should have SEND_PAYMENT', () => {
      expect(SEND_PAYMENT).toEqual('SEND_PAYMENT')
    })

    it('should have PAYMENT_SUCCESSFUL', () => {
      expect(PAYMENT_SUCCESSFUL).toEqual('PAYMENT_SUCCESSFUL')
    })

    it('should have PAYMENT_FAILED', () => {
      expect(PAYMENT_FAILED).toEqual('PAYMENT_FAILED')
    })

    it('should correctly sendPayment', () => {
      expect(paymentReducer(undefined, { type: SET_PAYMENT, payment: 'foo' })).toMatchSnapshot()
    })

    it('should correctly getPayments', () => {
      expect(paymentReducer(undefined, { type: GET_PAYMENTS })).toMatchSnapshot()
    })

    it('should correctly receivePayments', () => {
      expect(
        paymentReducer(undefined, { type: RECEIVE_PAYMENTS, payments: [1, 2] })
      ).toMatchSnapshot()
    })

    it('should correctly paymentSuccessful', () => {
      expect(
        paymentReducer(undefined, { type: PAYMENT_SUCCESSFUL, payment: 'foo' })
      ).toMatchSnapshot()
    })
  })
})
