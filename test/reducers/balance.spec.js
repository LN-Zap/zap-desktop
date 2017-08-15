import balanceReducer, {
  GET_BALANCE,
  RECEIVE_BALANCE
} from '../../app/reducers/balance'

describe('reducers', () => {
  describe('balanceReducer', () => {
    it('should handle initial state', () => {
      expect(balanceReducer(undefined, {})).toMatchSnapshot()
    })
  })
})