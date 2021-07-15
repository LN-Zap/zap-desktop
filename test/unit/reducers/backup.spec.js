import reducer, { SET_PROVIDER, SET_LOCAL_PATH, SET_RESTORE_MODE } from 'reducers/backup'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('backupReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle SET_PROVIDER', () => {
      const action = {
        type: SET_PROVIDER,
        provider: 'some-provider',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_LOCAL_PATH', () => {
      const action = {
        type: SET_LOCAL_PATH,
        localPath: '/some/path',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_RESTORE_MODE', () => {
      const action = {
        type: SET_RESTORE_MODE,
        isRestoreMode: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
