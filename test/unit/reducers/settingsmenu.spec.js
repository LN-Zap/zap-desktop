import reducer, { OPEN_SETTINGS, CLOSE_SETTINGS } from 'reducers/settingsmenu'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('settingsmenuReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle OPEN_SETTINGS', () => {
      const action = {
        type: OPEN_SETTINGS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle CLOSE_SETTINGS', () => {
      const action = {
        type: CLOSE_SETTINGS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
