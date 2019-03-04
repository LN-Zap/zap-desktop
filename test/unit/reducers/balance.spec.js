import balanceReducer, { GET_BALANCE, RECEIVE_BALANCE } from 'reducers/balance'

describe('reducers', () => {
  describe('balanceReducer', () => {
    it('should handle initial state', () => {
      expect(balanceReducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle GET_BALANCE', () => {
      expect(balanceReducer(undefined, { type: GET_BALANCE })).toMatchSnapshot()
    })

    it('should handle RECEIVE_BALANCE', () => {
      const walletBalance = {
        total_balance: 1,
        confirmed_balance: 1,
        unconfirmed_balance: 1
      }
      const channelBalance = 1
      expect(
        balanceReducer(undefined, { type: RECEIVE_BALANCE, walletBalance, channelBalance })
      ).toMatchSnapshot()
    })

    it('should handle unknown action type', () => {
      expect(balanceReducer(undefined, { type: 'unknown' })).toMatchSnapshot()
    })
  })
})
