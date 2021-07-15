import reducer, {
  START_NEUTRINO,
  START_NEUTRINO_SUCCESS,
  START_NEUTRINO_FAILURE,
  STOP_NEUTRINO,
  STOP_NEUTRINO_SUCCESS,
  STOP_NEUTRINO_FAILURE,
  RECEIVE_CURRENT_BLOCK_HEIGHT,
  RECEIVE_LND_BLOCK_HEIGHT,
  RECEIVE_LND_CFILTER_HEIGHT,
  RECEIVE_LND_RECOVERY_HEIGHT,
  SET_SYNC_STATUS_PENDING,
  SET_SYNC_STATUS_WAITING,
  SET_SYNC_STATUS_IN_PROGRESS,
  SET_SYNC_STATUS_COMPLETE,
  SET_GRPC_ACTIVE_INTERFACE,
  NEUTRINO_CRASHED,
  NEUTRINO_RESET,
} from 'reducers/neutrino'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('neutrinoReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle START_NEUTRINO', () => {
      const action = {
        type: START_NEUTRINO,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle START_NEUTRINO_SUCCESS', () => {
      const action = {
        type: START_NEUTRINO_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle START_NEUTRINO_FAILURE', () => {
      const action = {
        type: START_NEUTRINO_FAILURE,
        startNeutrinoError: 'Some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle STOP_NEUTRINO', () => {
      const action = {
        type: STOP_NEUTRINO,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle STOP_NEUTRINO_SUCCESS', () => {
      const action = {
        type: STOP_NEUTRINO_SUCCESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle STOP_NEUTRINO_FAILURE', () => {
      const action = {
        type: STOP_NEUTRINO_FAILURE,
        error: 'some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_CURRENT_BLOCK_HEIGHT', () => {
      const action = {
        type: RECEIVE_CURRENT_BLOCK_HEIGHT,
        blockHeight: 12345,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_LND_BLOCK_HEIGHT', () => {
      const action = {
        type: RECEIVE_LND_BLOCK_HEIGHT,
        data: [{ height: 12345 }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_LND_CFILTER_HEIGHT', () => {
      const action = {
        type: RECEIVE_LND_CFILTER_HEIGHT,
        data: [{ height: 12345 }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RECEIVE_LND_RECOVERY_HEIGHT', () => {
      const action = {
        type: RECEIVE_LND_RECOVERY_HEIGHT,
        data: [{ height: 12345 }],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SYNC_STATUS_PENDING', () => {
      const action = {
        type: SET_SYNC_STATUS_PENDING,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SYNC_STATUS_WAITING', () => {
      const action = {
        type: SET_SYNC_STATUS_WAITING,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SYNC_STATUS_IN_PROGRESS', () => {
      const action = {
        type: SET_SYNC_STATUS_IN_PROGRESS,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SYNC_STATUS_COMPLETE', () => {
      const action = {
        type: SET_SYNC_STATUS_COMPLETE,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_GRPC_ACTIVE_INTERFACE', () => {
      const action = {
        type: SET_GRPC_ACTIVE_INTERFACE,
        grpcActiveInterface: 'lightning',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle NEUTRINO_CRASHED', () => {
      const action = {
        type: NEUTRINO_CRASHED,
        code: 1,
        signal: 'SIGTERM',
        lastError: 'Some error',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle NEUTRINO_RESET', () => {
      const action = {
        type: NEUTRINO_RESET,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
