import { createSelector } from 'reselect'
import get from 'lodash.get'
import { validateHost as doHostValidation } from 'lib/utils/validateHost'
import { fileExists } from 'lib/utils/fileExists'

// ------------------------------------
// Constants
// ------------------------------------
export const ONBOARDING_STARTED = 'ONBOARDING_STARTED'
export const ONBOARDING_FINISHED = 'ONBOARDING_FINISHED'
export const SET_CONNECTION_TYPE = 'SET_CONNECTION_TYPE'
export const SET_CONNECTION_STRING = 'SET_CONNECTION_STRING'
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

// ------------------------------------
// Helpers
// ------------------------------------
function prettyPrint(json) {
  try {
    return JSON.stringify(JSON.parse(json), undefined, 4)
  } catch (e) {
    return json
  }
}

// ------------------------------------
// Actions
// ------------------------------------

export const resetOnboarding = () => dispatch => {
  dispatch({ type: RESET_ONBOARDING })
}

export function onboardingStarted() {
  return {
    type: ONBOARDING_STARTED
  }
}

export function onboardingFinished() {
  return {
    type: ONBOARDING_FINISHED
  }
}

export const setConnectionString = connectionString => (dispatch, getState) => {
  dispatch({
    type: SET_CONNECTION_STRING,
    connectionString: prettyPrint(connectionString)
  })
  const { host, port, macaroon } = onboardingSelectors.connectionStringParamsSelector(getState())
  dispatch(setConnectionHost([host, port].join(':')))
  dispatch(setConnectionMacaroon(macaroon))
  dispatch(setConnectionCert(''))
}

export function setConnectionType(connectionType) {
  return {
    type: SET_CONNECTION_TYPE,
    connectionType
  }
}

export function setConnectionHost(connectionHost) {
  return {
    type: SET_CONNECTION_HOST,
    connectionHost
  }
}

export function setConnectionCert(connectionCert) {
  return {
    type: SET_CONNECTION_CERT,
    connectionCert
  }
}

export function setConnectionMacaroon(connectionMacaroon) {
  return {
    type: SET_CONNECTION_MACAROON,
    connectionMacaroon
  }
}

export function setAlias(alias) {
  return {
    type: SET_ALIAS,
    alias
  }
}

export function setName(name) {
  return {
    type: SET_NAME,
    name
  }
}

export function setAutopilot(autopilot) {
  return {
    type: SET_AUTOPILOT,
    autopilot
  }
}

export function setPassword(password) {
  return {
    type: SET_PASSWORD,
    password
  }
}

export function setSeed(seed) {
  return {
    type: SET_SEED,
    seed
  }
}

export const validateHost = host => async dispatch => {
  try {
    dispatch({ type: VALIDATING_HOST, validatingHost: true })
    const res = await doHostValidation(host)
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
    const res = await fileExists(certPath)
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
    const res = await fileExists(macaroonPath)
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

export const startOnboarding = () => dispatch => {
  dispatch(onboardingStarted())
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CONNECTION_TYPE]: (state, { connectionType }) => ({ ...state, connectionType }),
  [SET_CONNECTION_STRING]: (state, { connectionString }) => ({ ...state, connectionString }),
  [SET_CONNECTION_HOST]: (state, { connectionHost }) => ({ ...state, connectionHost }),
  [SET_CONNECTION_CERT]: (state, { connectionCert }) => ({ ...state, connectionCert }),
  [SET_CONNECTION_MACAROON]: (state, { connectionMacaroon }) => ({ ...state, connectionMacaroon }),
  [SET_ALIAS]: (state, { alias }) => ({ ...state, alias }),
  [SET_NAME]: (state, { name }) => ({ ...state, name }),
  [SET_AUTOPILOT]: (state, { autopilot }) => ({ ...state, autopilot }),
  [SET_SEED]: (state, { seed }) => ({ ...state, seed, fetchingSeed: false }),
  [SET_PASSWORD]: (state, { password }) => ({ ...state, password }),
  [ONBOARDING_STARTED]: state => ({ ...state, onboarding: true, onboarded: false }),
  [ONBOARDING_FINISHED]: state => ({ ...state, onboarding: false, onboarded: true }),
  [VALIDATING_HOST]: (state, { validatingHost }) => ({ ...state, validatingHost }),
  [VALIDATING_CERT]: (state, { validatingCert }) => ({ ...state, validatingCert }),
  [VALIDATING_MACAROON]: (state, { validatingMacaroon }) => ({ ...state, validatingMacaroon }),
  [RESET_ONBOARDING]: state => ({ ...state, ...initialState })
}

// ------------------------------------
// Selector
// ------------------------------------
const onboardingSelectors = {}

const connectionStringSelector = state => state.onboarding.connectionString

onboardingSelectors.connectionStringParamsSelector = createSelector(
  connectionStringSelector,
  connectionString => {
    let config = {}
    try {
      config = JSON.parse(connectionString)
    } catch (e) {
      return {}
    }

    const configurations = get(config, 'configurations', [])
    return configurations.find(c => c.type === 'grpc' && c.cryptoCode === 'BTC') || {}
  }
)

export { onboardingSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  onboarding: false,
  onboarded: false,
  autopilot: true,
  validatingHost: false,
  validatingCert: false,
  validatingMacaroon: false,
  connectionType: 'create',
  connectionString: '',
  connectionHost: '',
  connectionCert: '',
  connectionMacaroon: '',
  alias: '',
  name: '',
  password: '',
  seed: []
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function onboardingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
