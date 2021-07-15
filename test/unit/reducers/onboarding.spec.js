import reducer, {
  SET_CONNECTION_TYPE,
  SET_CONNECTION_STRING,
  SET_CONNECTION_HOST,
  SET_CONNECTION_CERT,
  SET_CONNECTION_MACAROON,
  SET_ALIAS,
  SET_NAME,
  SET_AUTOPILOT,
  SET_CHAIN,
  SET_NETWORK,
  SET_PASSWORD,
  SET_PASSPHRASE,
  SET_SEED,
  VALIDATING_HOST,
  VALIDATING_CERT,
  VALIDATING_MACAROON,
  RESET_ONBOARDING,
  SET_LNDCONNECT,
} from 'reducers/onboarding'

import snapshotDiff from '../__helpers__/snapshotDiff'

describe('reducers', () => {
  describe('onboardingReducer', () => {
    it('should handle initial state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('should handle SET_CONNECTION_TYPE', () => {
      const action = {
        type: SET_CONNECTION_TYPE,
        connectionType: 'custom',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_CONNECTION_STRING', () => {
      const action = {
        type: SET_CONNECTION_STRING,
        connectionUri: 'lndconnect://localhost:10009?cert=/path/to/cert&macaroon=/path/to/macaroon',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_CONNECTION_HOST', () => {
      const action = {
        type: SET_CONNECTION_HOST,
        connectionHost: 'localhost',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_CONNECTION_CERT', () => {
      const action = {
        type: SET_CONNECTION_CERT,
        connectionCert: '/path/to/cert',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_CONNECTION_MACAROON', () => {
      const action = {
        type: SET_CONNECTION_MACAROON,
        connectionMacaroon: '/path/to/macaroon',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_ALIAS', () => {
      const action = {
        type: SET_ALIAS,
        alias: 'some alias',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_NAME', () => {
      const action = {
        type: SET_NAME,
        name: 'some name',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_AUTOPILOT', () => {
      const action = {
        type: SET_AUTOPILOT,
        autopilot: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_CHAIN', () => {
      const action = {
        type: SET_CHAIN,
        chain: 'bitcoin',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_NETWORK', () => {
      const action = {
        type: SET_NETWORK,
        network: 'testnet',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_PASSWORD', () => {
      const action = {
        type: SET_PASSWORD,
        password: 'some password',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_PASSPHRASE', () => {
      const action = {
        type: SET_PASSPHRASE,
        passphrase: 'some passphrase',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_SEED', () => {
      const action = {
        type: SET_SEED,
        seed: ['some', 'seed', 'words'],
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle VALIDATING_HOST', () => {
      const action = {
        type: VALIDATING_HOST,
        validatingHost: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle VALIDATING_CERT', () => {
      const action = {
        type: VALIDATING_CERT,
        validatingCert: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle VALIDATING_MACAROON', () => {
      const action = {
        type: VALIDATING_MACAROON,
        validatingMacaroon: true,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle RESET_ONBOARDING', () => {
      const action = {
        type: RESET_ONBOARDING,
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })

    it('should handle SET_LNDCONNECT', () => {
      const action = {
        type: SET_LNDCONNECT,
        lndConnect: 'lndconnect://localhost:10009?cert=/path/to/cert&macaroon=/path/to/macaroon',
      }
      expect(snapshotDiff(reducer(undefined, {}), reducer(undefined, action))).toMatchSnapshot()
    })
  })
})
