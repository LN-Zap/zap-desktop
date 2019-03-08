import transactionReducer, {
  GET_TRANSACTIONS,
  RECEIVE_TRANSACTIONS,
  SEND_TRANSACTION,
  TRANSACTION_SUCCESSFUL,
  TRANSACTION_FAILED,
  ADD_TRANSACTION,
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

    it('should have TRANSACTION_SUCCESSFUL', () => {
      expect(TRANSACTION_SUCCESSFUL).toEqual('TRANSACTION_SUCCESSFUL')
    })

    it('should have TRANSACTION_FAILED', () => {
      expect(TRANSACTION_FAILED).toEqual('TRANSACTION_FAILED')
    })

    it('should have ADD_TRANSACTION', () => {
      expect(ADD_TRANSACTION).toEqual('ADD_TRANSACTION')
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
      expect(transactionReducer(undefined, { type: TRANSACTION_SUCCESSFUL })).toMatchSnapshot()
    })

    it('should correctly transactionFailed', () => {
      expect(transactionReducer(undefined, { type: TRANSACTION_FAILED })).toMatchSnapshot()
    })

    it('should correctly addTransaction', () => {
      expect(transactionReducer(undefined, { type: ADD_TRANSACTION })).toMatchSnapshot()
    })
  })
})
