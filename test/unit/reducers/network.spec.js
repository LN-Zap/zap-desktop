import reducer, {
  GET_DESCRIBE_NETWORK,
  RECEIVE_DESCRIBE_NETWORK,
  UPDATE_NODE_DATA,
} from 'reducers/network'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('networkReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle GET_DESCRIBE_NETWORK', () => {
      const action = {
        type: GET_DESCRIBE_NETWORK,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_DESCRIBE_NETWORK', () => {
      const action = {
        type: RECEIVE_DESCRIBE_NETWORK,
        nodes: [{ some: 'data' }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle UPDATE_NODE_DATA', () => {
      const action = {
        type: UPDATE_NODE_DATA,
        data: [{ some: 'data' }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
