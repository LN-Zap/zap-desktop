import reducer, {
  INIT_SETTINGS,
  INIT_SETTINGS_SUCCESS,
  INIT_SETTINGS_FAILURE,
  SET_SETTING,
} from 'reducers/settings'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('settingsReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle INIT_SETTINGS', () => {
      const action = {
        type: INIT_SETTINGS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_SETTINGS_SUCCESS', () => {
      const action = {
        type: INIT_SETTINGS_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle INIT_SETTINGS_FAILURE', () => {
      const action = {
        type: INIT_SETTINGS_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SETTING', () => {
      const action = {
        type: SET_SETTING,
        key: 'some',
        value: 'setting',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
