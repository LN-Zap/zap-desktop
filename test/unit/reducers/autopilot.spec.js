import reducer, {
  UPDATE_AUTOPILOT_NODE_SCORES,
  UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS,
  UPDATE_AUTOPILOT_NODE_SCORES_FAILURE,
} from 'reducers/autopilot'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('autopilotReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle UPDATE_AUTOPILOT_NODE_SCORES', () => {
      const action = {
        type: UPDATE_AUTOPILOT_NODE_SCORES,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS', () => {
      const action = {
        type: UPDATE_AUTOPILOT_NODE_SCORES_SUCCESS,
        scores: {
          some: 'data',
        },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_AUTOPILOT_NODE_SCORES_FAILURE', () => {
      const action = {
        type: UPDATE_AUTOPILOT_NODE_SCORES_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
