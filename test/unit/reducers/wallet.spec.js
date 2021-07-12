import reducer, {
  SET_WALLETS,
  SET_WALLETS_LOADED,
  DELETE_WALLET,
  DELETE_WALLET_SUCCESS,
  DELETE_WALLET_FAILURE,
  PUT_WALLET,
} from 'reducers/wallet'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('walletReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle SET_WALLETS', () => {
      const action = {
        type: SET_WALLETS,
        wallets: [{ some: 'data' }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_WALLETS_LOADED', () => {
      const action = {
        type: SET_WALLETS_LOADED,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle DELETE_WALLET', () => {
      const action = {
        type: DELETE_WALLET,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle DELETE_WALLET_SUCCESS', () => {
      const action = {
        type: DELETE_WALLET_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle DELETE_WALLET_FAILURE', () => {
      const action = {
        type: DELETE_WALLET_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle PUT_WALLET', () => {
      const action = {
        type: PUT_WALLET,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
