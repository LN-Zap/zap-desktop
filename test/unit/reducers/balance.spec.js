import balanceReducer, { FETCH_BALANCE, FETCH_BALANCE_SUCCESS } from 'reducers/balance'

describe('reducers', () => {
  describe('balanceReducer', () => {
    it('should handle initial state', () => {
      expect(balanceReducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle FETCH_BALANCE', () => {
      expect(balanceReducer(undefined, { type: FETCH_BALANCE })).toMatchSnapshot()
    })

    it('should handle FETCH_BALANCE_SUCCESS', () => {
      const walletBalance = {
        total_balance: 1,
        confirmed_balance: 1,
        unconfirmed_balance: 1,
      }
      const channelBalance = {
        balance: 1,
        pending_open_balance: 1,
      }
      expect(
        balanceReducer(undefined, { type: FETCH_BALANCE_SUCCESS, walletBalance, channelBalance })
      ).toMatchSnapshot()
    })

    it('should handle unknown action type', () => {
      expect(balanceReducer(undefined, { type: 'unknown' })).toMatchSnapshot()
    })
  })
})
