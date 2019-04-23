import reducer, {
  START_LND,
  START_LND_SUCCESS,
  START_LND_FAILURE,
  CLEAR_START_LND_ERROR,
  STOP_LND,
  STOP_LND_SUCCESS,
  CREATE_NEW_WALLET,
  CREATE_NEW_WALLET_SUCCESS,
  RECOVER_OLD_WALLET,
  RECOVER_OLD_WALLET_SUCCESS,
  RECOVER_OLD_WALLET_FAILURE,
  CLEAR_RECOVER_OLD_WALLET_ERROR,
  UNLOCK_WALLET,
  UNLOCK_WALLET_SUCCESS,
  UNLOCK_WALLET_FAILURE,
  FETCH_SEED,
  FETCH_SEED_FAILURE,
  FETCH_SEED_SUCCESS,
  CONNECT_GRPC,
  CONNECT_GRPC_SUCCESS,
  CONNECT_GRPC_FAILURE,
  LND_WALLET_UNLOCKER_GRPC_ACTIVE,
  LND_LIGHTNING_GRPC_ACTIVE,
  DISCONNECT_GRPC,
  DISCONNECT_GRPC_SUCCESS,
  DISCONNECT_GRPC_FAILURE,
} from 'reducers/lnd'

describe('reducers', () => {
  describe('neutrinoReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle START_LND', () => {
      const action = {
        type: START_LND,
        lndConfig: {
          type: 'local',
          chain: 'bitcoin',
          network: 'testnet',
        },
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle START_LND_SUCCESS', () => {
      const action = {
        type: START_LND_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle START_LND_FAILURE', () => {
      const action = {
        type: START_LND_FAILURE,
        errors: {
          host: 'a host error',
          cert: 'a cert error',
          macaroon: 'a macaroon error',
        },
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CLEAR_START_LND_ERROR', () => {
      const action = {
        type: CLEAR_START_LND_ERROR,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle STOP_LND', () => {
      const action = {
        type: STOP_LND,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle STOP_LND_SUCCESS', () => {
      const action = {
        type: STOP_LND_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CREATE_NEW_WALLET', () => {
      const action = {
        type: CREATE_NEW_WALLET,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CREATE_NEW_WALLET_SUCCESS', () => {
      const action = {
        type: CREATE_NEW_WALLET_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle RECOVER_OLD_WALLET', () => {
      const action = {
        type: RECOVER_OLD_WALLET,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle RECOVER_OLD_WALLET_SUCCESS', () => {
      const action = {
        type: RECOVER_OLD_WALLET_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle RECOVER_OLD_WALLET_FAILURE', () => {
      const action = {
        type: RECOVER_OLD_WALLET_FAILURE,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CLEAR_RECOVER_OLD_WALLET_ERROR', () => {
      const action = {
        type: CLEAR_RECOVER_OLD_WALLET_ERROR,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle UNLOCK_WALLET', () => {
      const action = {
        type: UNLOCK_WALLET,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle UNLOCK_WALLET_SUCCESS', () => {
      const action = {
        type: UNLOCK_WALLET_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle UNLOCK_WALLET_FAILURE', () => {
      const action = {
        type: UNLOCK_WALLET_FAILURE,
        unlockWalletError: 'some error',
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle FETCH_SEED', () => {
      const action = {
        type: FETCH_SEED,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle FETCH_SEED_SUCCESS', () => {
      const action = {
        type: FETCH_SEED_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle FETCH_SEED_FAILURE', () => {
      const action = {
        type: FETCH_SEED_FAILURE,
        error: 'some error',
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CONNECT_GRPC', () => {
      const action = {
        type: CONNECT_GRPC,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CONNECT_GRPC_SUCCESS', () => {
      const action = {
        type: CONNECT_GRPC_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle CONNECT_GRPC_FAILURE', () => {
      const action = {
        type: CONNECT_GRPC_FAILURE,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle LND_WALLET_UNLOCKER_GRPC_ACTIVE', () => {
      const action = {
        type: LND_WALLET_UNLOCKER_GRPC_ACTIVE,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle LND_LIGHTNING_GRPC_ACTIVE', () => {
      const action = {
        type: LND_LIGHTNING_GRPC_ACTIVE,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle DISCONNECT_GRPC', () => {
      const action = {
        type: DISCONNECT_GRPC,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle DISCONNECT_GRPC_SUCCESS', () => {
      const action = {
        type: DISCONNECT_GRPC_SUCCESS,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })

    it('should handle DISCONNECT_GRPC_FAILURE', () => {
      const action = {
        type: DISCONNECT_GRPC_FAILURE,
      }
      expect(reducer({}, action)).toMatchSnapshot()
    })
  })
})
