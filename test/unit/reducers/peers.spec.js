import reducer, { FETCH_PEERS, FETCH_PEERS_SUCCESS, FETCH_PEERS_FAILURE } from 'reducers/peers'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('peersReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle FETCH_PEERS', () => {
      const action = {
        type: FETCH_PEERS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_PEERS_SUCCESS', () => {
      const action = {
        type: FETCH_PEERS_SUCCESS,
        peers: { some: 'peer' },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle FETCH_PEERS_FAILURE', () => {
      const action = {
        type: FETCH_PEERS_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
