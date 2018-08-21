import transactionReducer, {
  GET_TRANSACTIONS,
  RECEIVE_TRANSACTIONS,
  SEND_TRANSACTION,
  TRANSACTION_SUCCESSFULL,
  TRANSACTION_FAILED,
  ADD_TRANSACTION,
  SHOW_SUCCESS_TRANSACTION_SCREEN,
  HIDE_SUCCESS_TRANSACTION_SCREEN
} from 'reducers/transaction'

describe('reducers', () => {
  describe('transactionReducer', () => {
    it('should handle initial state', () => {
      expect(transactionReducer(undefined, {})).toMatchSnapshot()
    })

    it('should have GET_TRANSACTIONS', () => {
      expect(GET_TRANSACTIONS).toEqual('GET_TRANSACTIONS')
    })

    it('should have RECEIVE_TRANSACTIONS', () => {
      expect(RECEIVE_TRANSACTIONS).toEqual('RECEIVE_TRANSACTIONS')
    })

    it('should have GET_TICKER', () => {
      expect(SEND_TRANSACTION).toEqual('SEND_TRANSACTION')
    })

    it('should have TRANSACTION_SUCCESSFULL', () => {
      expect(TRANSACTION_SUCCESSFULL).toEqual('TRANSACTION_SUCCESSFULL')
    })

    it('should have TRANSACTION_FAILED', () => {
      expect(TRANSACTION_FAILED).toEqual('TRANSACTION_FAILED')
    })

    it('should have ADD_TRANSACTION', () => {
      expect(ADD_TRANSACTION).toEqual('ADD_TRANSACTION')
    })

    it('should have SHOW_SUCCESS_TRANSACTION_SCREEN', () => {
      expect(SHOW_SUCCESS_TRANSACTION_SCREEN).toEqual('SHOW_SUCCESS_TRANSACTION_SCREEN')
    })

    it('should have HIDE_SUCCESS_TRANSACTION_SCREEN', () => {
      expect(HIDE_SUCCESS_TRANSACTION_SCREEN).toEqual('HIDE_SUCCESS_TRANSACTION_SCREEN')
    })

    it('should correctly getTransactions', () => {
      expect(transactionReducer(undefined, { type: GET_TRANSACTIONS })).toMatchSnapshot()
    })

    it('should correctly sendTransactions', () => {
      expect(transactionReducer(undefined, { type: SEND_TRANSACTION })).toMatchSnapshot()
    })

    it('should correctly receiveTransactions', () => {
      expect(transactionReducer(undefined, { type: RECEIVE_TRANSACTIONS })).toMatchSnapshot()
    })

    it('should correctly sendTransaction', () => {
      expect(transactionReducer(undefined, { type: SEND_TRANSACTION })).toMatchSnapshot()
    })

    it('should correctly transactionSuccessful', () => {
      expect(transactionReducer(undefined, { type: TRANSACTION_SUCCESSFULL })).toMatchSnapshot()
    })

    it('should correctly transactionFailed', () => {
      expect(transactionReducer(undefined, { type: TRANSACTION_FAILED })).toMatchSnapshot()
    })

    it('should correctly addTransaction', () => {
      expect(transactionReducer(undefined, { type: ADD_TRANSACTION })).toMatchSnapshot()
    })

    it('should correctly showSuccessTransactionScreen', () => {
      expect(
        transactionReducer(undefined, { type: SHOW_SUCCESS_TRANSACTION_SCREEN })
      ).toMatchSnapshot()
    })

    it('should correctly hideSuccessTransactionScreen', () => {
      expect(
        transactionReducer(undefined, { type: HIDE_SUCCESS_TRANSACTION_SCREEN })
      ).toMatchSnapshot()
    })
  })
})
