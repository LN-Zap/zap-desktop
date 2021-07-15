import config from 'config'

import createReducer from '@zap/utils/createReducer'

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  isSkipBackupDialogOpen: false,
  autopilot: config.lnd.autopilot.active,
  chain: config.chain,
  network: config.network,
  validatingHost: false,
  validatingCert: false,
  validatingMacaroon: false,
  lndConnect: null,
  connectionType: 'create',
  connectionString: '',
  connectionHost: '',
  connectionCert: '',
  connectionMacaroon: '',
  alias: '',
  name: '',
  password: '',
  passphrase: '',
  seed: [],
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_CONNECTION_TYPE = 'SET_CONNECTION_TYPE'
export const SET_CONNECTION_STRING = 'SET_CONNECTION_STRING'
export const SET_CONNECTION_HOST = 'SET_CONNECTION_HOST'
export const SET_CONNECTION_CERT = 'SET_CONNECTION_CERT'
export const SET_CONNECTION_MACAROON = 'SET_CONNECTION_MACAROON'
export const SET_ALIAS = 'SET_ALIAS'
export const SET_NAME = 'SET_NAME'
export const SET_AUTOPILOT = 'SET_AUTOPILOT'
export const SET_CHAIN = 'SET_CHAIN'
export const SET_NETWORK = 'SET_NETWORK'
export const SET_PASSWORD = 'SET_PASSWORD'
export const SET_PASSPHRASE = 'SET_PASSPHRASE'
export const SET_SEED = 'SET_SEED'
export const VALIDATING_HOST = 'VALIDATING_HOST'
export const VALIDATING_CERT = 'VALIDATING_CERT'
export const VALIDATING_MACAROON = 'VALIDATING_MACAROON'
export const RESET_ONBOARDING = 'RESET_ONBOARDING'
export const SET_LNDCONNECT = 'SET_LNDCONNECT'

export const SKIP_BACKUP_DIALOG_ID = 'SKIP_BACKUP_DIALOG_ID'

// ------------------------------------
// IPC
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

/**
 * resetOnboarding - Reset onboarding state.
 *
 * @returns {(dispatch:Function) => void} Thunk
 */
export const resetOnboarding = () => dispatch => {
  dispatch({ type: RESET_ONBOARDING })
}

/**
 * setConnectionString - Set the connection string.
 *
 * @param {string} connectionString Connection string
 * @returns {object} Action
 */
export function setConnectionString(connectionString) {
  return {
    type: SET_CONNECTION_STRING,
    connectionString,
  }
}

/**
 * setConnectionType - Set the connection type.
 *
 * @param {string} connectionType Connection type
 * @returns {object} Action
 */
export function setConnectionType(connectionType) {
  return {
    type: SET_CONNECTION_TYPE,
    connectionType,
  }
}

/**
 * setConnectionHost - Set the connection host.
 *
 * @param {string} connectionHost Connection host
 * @returns {object} Action
 */
export function setConnectionHost(connectionHost) {
  return {
    type: SET_CONNECTION_HOST,
    connectionHost,
  }
}

/**
 * setConnectionCert - Set the connection cert.
 *
 * @param {string} connectionCert Connection cert
 * @returns {object} Action
 */
export function setConnectionCert(connectionCert) {
  return {
    type: SET_CONNECTION_CERT,
    connectionCert,
  }
}

/**
 * setConnectionMacaroon - Set the connection macaroon.
 *
 * @param {string} connectionMacaroon Connection macaroon
 * @returns {object} Action
 */
export function setConnectionMacaroon(connectionMacaroon) {
  return {
    type: SET_CONNECTION_MACAROON,
    connectionMacaroon,
  }
}

/**
 * setAlias - Set the node alias.
 *
 * @param {string} alias Alias
 * @returns {object} Action
 */
export function setAlias(alias) {
  return {
    type: SET_ALIAS,
    alias,
  }
}

/**
 * setName - Set the wallet name.
 *
 * @param {string} name Name
 * @returns {object} Action
 */
export function setName(name) {
  return {
    type: SET_NAME,
    name,
  }
}

/**
 * setAutopilot - Set autopilot status.
 *
 * @param {boolean} autopilot Boolean indicating autopilot status
 * @returns {object} Action
 */
export function setAutopilot(autopilot) {
  return {
    type: SET_AUTOPILOT,
    autopilot,
  }
}

/**
 * setName - Set the blockchain to connect to.
 *
 * @param {'bitcoin'} chain Chain name
 * @returns {object} Action
 */
export function setChain(chain) {
  return {
    type: SET_CHAIN,
    chain,
  }
}

/**
 * setNetwork - Set the network to connect to.
 *
 * @param {('testnet'|'mainnet')} network Network name
 * @returns {object} Action
 */
export function setNetwork(network) {
  return {
    type: SET_NETWORK,
    network,
  }
}

/**
 * setNetwork - Set the password used to unlock the wallet.
 *
 * @param {string} password Password
 * @returns {object} Action
 */
export function setPassword(password) {
  return {
    type: SET_PASSWORD,
    password,
  }
}

/**
 * setNetwork - Set the password used to encrypt the seed.
 *
 * @param {string} passphrase Passphrase
 * @returns {object} Action
 */
export function setPassphrase(passphrase) {
  return {
    type: SET_PASSPHRASE,
    passphrase,
  }
}

/**
 * setSeed - Set the seed.
 *
 * @param {Array} seed Seed
 * @returns {object} Action
 */
export function setSeed(seed) {
  return {
    type: SET_SEED,
    seed,
  }
}

/**
 * setLndconnect - Set the lndconnect string.
 *
 * @param {string} lndConnect LndConnect string
 * @returns {object} Action
 */
export function setLndconnect(lndConnect) {
  return {
    type: SET_LNDCONNECT,
    lndConnect,
  }
}

/**
 * lndconnectUri - Set the lndconnect uri.
 * Used to initiate new wallet creation.
 *
 * @param {object} event Event
 * @param {string} lndConnect LND Connect URI
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lndconnectUri = (event, lndConnect) => dispatch => {
  dispatch(setLndconnect(lndConnect))
}

/**
 * validateHost - Validate that a host can be connected to.
 *
 * @param {string} host Host to validate
 * @returns {(dispatch:Function) => Promise<boolean>} Thunk
 */
export const validateHost = host => async dispatch => {
  try {
    dispatch({ type: VALIDATING_HOST, validatingHost: true })
    await window.Zap.validateHost(host)
    dispatch({ type: VALIDATING_HOST, validatingHost: false })
    return true
  } catch (e) {
    dispatch({ type: VALIDATING_HOST, validatingHost: false })
    return Promise.reject(e.message)
  }
}

/**
 * validateHost - Validate a cart can be found on disk.
 *
 * @param {string} certPath Cert file to validate
 * @returns {(dispatch:Function) => Promise<boolean>} Thunk
 */
export const validateCert = certPath => async dispatch => {
  try {
    dispatch({ type: VALIDATING_CERT, validatingCert: true })
    await window.Zap.fileExists(certPath)
    dispatch({ type: VALIDATING_CERT, validatingCert: false })
    return true
  } catch (e) {
    dispatch({ type: VALIDATING_CERT, validatingCert: false })
    if (e.code === 'ENOENT') {
      e.message = 'no such file or directory'
    }
    throw e.message
  }
}

/**
 * validateMacaroon - Validate a macaroon can be found on disk.
 *
 * @param {string} macaroonPath Macaroon file to validate
 * @returns {(dispatch:Function) => Promise<boolean>} Thunk
 */
export const validateMacaroon = macaroonPath => async dispatch => {
  try {
    dispatch({ type: VALIDATING_MACAROON, validatingMacaroon: true })
    await window.Zap.fileExists(macaroonPath)
    dispatch({ type: VALIDATING_MACAROON, validatingMacaroon: false })
    return true
  } catch (e) {
    dispatch({ type: VALIDATING_MACAROON, validatingMacaroon: false })
    if (e.code === 'ENOENT') {
      e.message = 'no such file or directory'
    }
    throw e.message
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_CONNECTION_TYPE]: (state, { connectionType }) => {
    state.connectionType = connectionType
  },
  [SET_CONNECTION_STRING]: (state, { connectionString }) => {
    state.connectionString = connectionString
  },
  [SET_CONNECTION_HOST]: (state, { connectionHost }) => {
    state.connectionHost = connectionHost
  },
  [SET_CONNECTION_CERT]: (state, { connectionCert }) => {
    state.connectionCert = connectionCert
  },
  [SET_CONNECTION_MACAROON]: (state, { connectionMacaroon }) => {
    state.connectionMacaroon = connectionMacaroon
  },
  [SET_ALIAS]: (state, { alias }) => {
    state.alias = alias
  },
  [SET_NAME]: (state, { name }) => {
    state.name = name
  },
  [SET_AUTOPILOT]: (state, { autopilot }) => {
    state.autopilot = autopilot
  },
  [SET_CHAIN]: (state, { chain }) => {
    state.chain = chain
  },
  [SET_NETWORK]: (state, { network }) => {
    state.network = network
  },
  [SET_SEED]: (state, { seed }) => {
    state.seed = seed
  },
  [SET_LNDCONNECT]: (state, { lndConnect }) => {
    state.lndConnect = lndConnect
  },
  [SET_PASSWORD]: (state, { password }) => {
    state.password = password
  },
  [SET_PASSPHRASE]: (state, { passphrase }) => {
    state.passphrase = passphrase
  },
  [VALIDATING_HOST]: (state, { validatingHost }) => {
    state.validatingHost = validatingHost
  },
  [VALIDATING_CERT]: (state, { validatingCert }) => {
    state.validatingCert = validatingCert
  },
  [VALIDATING_MACAROON]: (state, { validatingMacaroon }) => {
    state.validatingMacaroon = validatingMacaroon
  },
  [RESET_ONBOARDING]: state => ({ ...state, ...initialState }),
}

export default createReducer(initialState, ACTION_HANDLERS)
