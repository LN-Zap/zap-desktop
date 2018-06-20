import balanceReducer, { GET_BALANCE, RECEIVE_BALANCE } from '../../app/reducers/balance'

describe('reducers', () => {
  describe('balanceReducer', () => {
    it('should handle initial state', () => {
      expect(balanceReducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle INCREMENT_COUNTER', () => {
      expect(balanceReducer(undefined, { type: GET_BALANCE })).toMatchSnapshot()
    })

    it('should handle DECREMENT_COUNTER', () => {
      expect(balanceReducer(undefined, { type: RECEIVE_BALANCE })).toMatchSnapshot()
    })

    it('should handle unknown action type', () => {
      expect(balanceReducer(undefined, { type: 'unknown' })).toMatchSnapshot()
    })
  })
})
