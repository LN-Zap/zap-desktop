import reducer, {
  INIT_ACCOUNT,
  INIT_ACCOUNT_SUCCESS,
  INIT_ACCOUNT_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_CLEAR_ERROR,
} from 'reducers/account'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('accountReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle INIT_ACCOUNT', () => {
      const action = {
        type: INIT_ACCOUNT,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_ACCOUNT_SUCCESS', () => {
      const action = {
        type: INIT_ACCOUNT_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_ACCOUNT_FAILURE', () => {
      const action = {
        type: INIT_ACCOUNT_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle LOGIN', () => {
      const action = {
        type: LOGIN,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle LOGIN_SUCCESS', () => {
      const action = {
        type: LOGIN_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle LOGIN_FAILURE', () => {
      const action = {
        type: LOGIN_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle LOGIN_CLEAR_ERROR', () => {
      const action = {
        type: LOGIN_CLEAR_ERROR,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
