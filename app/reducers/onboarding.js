import delay from 'lib/utils/delay'
import { setLoading } from './app'
import { walletSelectors } from './wallet'

const { isWalletOpen } = walletSelectors

// ------------------------------------
// Constants
// ------------------------------------
export const ONBOARDING_STARTED = 'ONBOARDING_STARTED'
export const ONBOARDING_FINISHED = 'ONBOARDING_FINISHED'
export const SET_CONNECTION_TYPE = 'SET_CONNECTION_TYPE'
export const SET_CONNECTION_URI = 'SET_CONNECTION_URI'
export const SET_CONNECTION_HOST = 'SET_CONNECTION_HOST'
export const SET_CONNECTION_CERT = 'SET_CONNECTION_CERT'
export const SET_CONNECTION_MACAROON = 'SET_CONNECTION_MACAROON'
export const SET_ALIAS = 'SET_ALIAS'
export const SET_NAME = 'SET_NAME'
export const SET_AUTOPILOT = 'SET_AUTOPILOT'
export const SET_PASSWORD = 'SET_PASSWORD'
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

export function onboardingStarted() {
  return {
    type: ONBOARDING_STARTED,
  }
}

export function onboardingFinished() {
  return {
    type: ONBOARDING_FINISHED,
  }
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

export function setPassword(password) {
  return {
    type: SET_PASSWORD,
    password,
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
    throw e.message
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

export const startOnboarding = () => async (dispatch, getState) => {
  dispatch(onboardingStarted())
  // add some delay if the app is starting for the first time vs logging out of the the opened wallet
  await delay(isWalletOpen(getState()) ? 0 : 1500)
  dispatch(setLoading(false))
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
  [SET_SEED]: (state, { seed }) => ({ ...state, seed, isFetchingSeed: false }),
  [SET_LNDCONNECT]: (state, { lndConnect }) => ({ ...state, lndConnect }),
  [SET_PASSWORD]: (state, { password }) => ({ ...state, password }),
  [ONBOARDING_STARTED]: state => ({ ...state, onboarding: true, isOnboarded: false }),
  [ONBOARDING_FINISHED]: state => ({ ...state, onboarding: false, isOnboarded: true }),
  [VALIDATING_HOST]: (state, { validatingHost }) => ({ ...state, validatingHost }),
  [VALIDATING_CERT]: (state, { validatingCert }) => ({ ...state, validatingCert }),
  [VALIDATING_MACAROON]: (state, { validatingMacaroon }) => ({ ...state, validatingMacaroon }),
  [RESET_ONBOARDING]: state => ({ ...state, ...initialState }),
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  onboarding: false,
  isOnboarded: false,
  autopilot: true,
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
  seed: [],
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function onboardingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
