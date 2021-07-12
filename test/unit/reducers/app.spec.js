import reducer, {
  SET_LOADING,
  SET_MOUNTED,
  INIT_DATABASE,
  INIT_DATABASE_SUCCESS,
  INIT_DATABASE_FAILURE,
  INIT_APP,
  RESET_APP,
  TERMINATE_APP,
  TERMINATE_APP_SUCCESS,
} from 'reducers/app'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('appReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle SET_LOADING', () => {
      const action = {
        type: SET_LOADING,
        isLoading: false,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_MOUNTED', () => {
      const action = {
        type: SET_MOUNTED,
        isMounted: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_DATABASE', () => {
      const action = {
        type: INIT_DATABASE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_DATABASE_SUCCESS', () => {
      const action = {
        type: INIT_DATABASE_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_DATABASE_FAILURE', () => {
      const action = {
        type: INIT_DATABASE_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_APP', () => {
      const action = {
        type: INIT_APP,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RESET_APP', () => {
      const action = {
        type: RESET_APP,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle TERMINATE_APP', () => {
      const action = {
        type: TERMINATE_APP,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle TERMINATE_APP_SUCCESS', () => {
      const action = {
        type: TERMINATE_APP_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
