import reducer, { GET_INFO, RECEIVE_INFO, SET_HAS_SYNCED } from 'reducers/info'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('infoReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle GET_INFO', () => {
      const action = {
        type: GET_INFO,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_INFO', () => {
      const action = {
        type: RECEIVE_INFO,
        data: { semver: '0.5.2', chains: [{ chain: 'bitcoin', network: 'mainnet' }] },
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_HAS_SYNCED', () => {
      const action = {
        type: SET_HAS_SYNCED,
        hasSynced: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
