import config from 'config'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CONNECTION_TYPE = 'SET_CONNECTION_TYPE'
export const SET_CONNECTION_URI = 'SET_CONNECTION_URI'
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

// ------------------------------------
// Actions
// ------------------------------------

export const resetOnboarding = () => dispatch => {
  dispatch({ type: RESET_ONBOARDING })
}

export function setConnectionString(connectionString) {
  return {
    type: SET_CONNECTION_URI,
    connectionString,
  }
}

export function setConnectionType(connectionType) {
  return {
    type: SET_CONNECTION_TYPE,
    connectionType,
  }
}

export function setConnectionHost(connectionHost) {
  return {
    type: SET_CONNECTION_HOST,
    connectionHost,
  }
}

export function setConnectionCert(connectionCert) {
  return {
    type: SET_CONNECTION_CERT,
    connectionCert,
  }
}

export function setConnectionMacaroon(connectionMacaroon) {
  return {
    type: SET_CONNECTION_MACAROON,
    connectionMacaroon,
  }
}

export function setAlias(alias) {
  return {
    type: SET_ALIAS,
    alias,
  }
}

export function setName(name) {
  return {
    type: SET_NAME,
    name,
  }
}

export function setAutopilot(autopilot) {
  return {
    type: SET_AUTOPILOT,
    autopilot,
  }
}

export function setChain(chain) {
  return {
    type: SET_CHAIN,
    chain,
  }
}

export function setNetwork(network) {
  return {
    type: SET_NETWORK,
    network,
  }
}

export function setPassword(password) {
  return {
    type: SET_PASSWORD,
    password,
  }
}

export function setPassphrase(passphrase) {
  return {
    type: SET_PASSPHRASE,
    passphrase,
  }
}

export function setSeed(seed) {
  return {
    type: SET_SEED,
    seed,
  }
}

export function setLndconnect(lndConnect) {
  return {
    type: SET_LNDCONNECT,
    lndConnect,
  }
}

export const validateHost = host => async dispatch => {
  try {
    dispatch({ type: VALIDATING_HOST, validatingHost: true })
    const res = await window.Zap.validateHost(host)
    dispatch({ type: VALIDATING_HOST, validatingHost: false })
    return res
  } catch (e) {
    dispatch({ type: VALIDATING_HOST, validatingHost: false })
    return Promise.reject(e.message)
  }
}

export const validateCert = certPath => async dispatch => {
  try {
    dispatch({ type: VALIDATING_CERT, validatingCert: true })
    const res = await window.Zap.fileExists(certPath)
    dispatch({ type: VALIDATING_CERT, validatingCert: false })
    return res
  } catch (e) {
    dispatch({ type: VALIDATING_CERT, validatingCert: false })
    if (e.code === 'ENOENT') {
      e.message = 'no such file or directory'
    }
    throw e.message
  }
}

export const validateMacaroon = macaroonPath => async dispatch => {
  try {
    dispatch({ type: VALIDATING_MACAROON, validatingMacaroon: true })
    const res = await window.Zap.fileExists(macaroonPath)
    dispatch({ type: VALIDATING_MACAROON, validatingMacaroon: false })
    return res
  } catch (e) {
    dispatch({ type: VALIDATING_MACAROON, validatingMacaroon: false })
    if (e.code === 'ENOENT') {
      e.message = 'no such file or directory'
    }
    throw e.message
  }
}

export const lndconnectUri = (event, lndConnect) => dispatch => {
  dispatch(setLndconnect(lndConnect))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CONNECTION_TYPE]: (state, { connectionType }) => ({ ...state, connectionType }),
  [SET_CONNECTION_URI]: (state, { connectionString }) => ({ ...state, connectionString }),
  [SET_CONNECTION_HOST]: (state, { connectionHost }) => ({ ...state, connectionHost }),
  [SET_CONNECTION_CERT]: (state, { connectionCert }) => ({ ...state, connectionCert }),
  [SET_CONNECTION_MACAROON]: (state, { connectionMacaroon }) => ({ ...state, connectionMacaroon }),
  [SET_ALIAS]: (state, { alias }) => ({ ...state, alias }),
  [SET_NAME]: (state, { name }) => ({ ...state, name }),
  [SET_AUTOPILOT]: (state, { autopilot }) => ({ ...state, autopilot }),
  [SET_CHAIN]: (state, { chain }) => ({ ...state, chain }),
  [SET_NETWORK]: (state, { network }) => ({ ...state, network }),
  [SET_SEED]: (state, { seed }) => ({ ...state, seed, isFetchingSeed: false }),
  [SET_LNDCONNECT]: (state, { lndConnect }) => ({ ...state, lndConnect }),
  [SET_PASSWORD]: (state, { password }) => ({ ...state, password }),
  [SET_PASSPHRASE]: (state, { passphrase }) => ({ ...state, passphrase }),
  [VALIDATING_HOST]: (state, { validatingHost }) => ({ ...state, validatingHost }),
  [VALIDATING_CERT]: (state, { validatingCert }) => ({ ...state, validatingCert }),
  [VALIDATING_MACAROON]: (state, { validatingMacaroon }) => ({ ...state, validatingMacaroon }),
  [RESET_ONBOARDING]: state => ({ ...state, ...initialState }),
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  isOnboarding: false,
  isOnboarded: false,
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
// Reducer
// ------------------------------------
export default function onboardingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
