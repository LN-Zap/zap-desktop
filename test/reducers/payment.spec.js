/* eslint-disable */
// mock the app object of electron as electron-json-storage needs it
jest.mock('electron', () => ({ app: jest.fn() }))
import electron from 'electron'

import paymentReducer, {
  SET_PAYMENT,
  GET_PAYMENTS,
  RECEIVE_PAYMENTS,
  SEND_PAYMENT,
  PAYMENT_SUCCESSFULL,
  PAYMENT_FAILED
} from '../../app/reducers/payment'

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

    it('should have PAYMENT_SUCCESSFULL', () => {
      expect(PAYMENT_SUCCESSFULL).toEqual('PAYMENT_SUCCESSFULL')
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
      expect(paymentReducer(undefined, { type: RECEIVE_PAYMENTS, payments: [1, 2] })).toMatchSnapshot()
    })

    it('should correctly paymentSuccessful', () => {
      expect(paymentReducer(undefined, { type: PAYMENT_SUCCESSFULL, payment: 'foo' })).toMatchSnapshot()
    })
  })
})
