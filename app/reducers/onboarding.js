import crypto from 'crypto'
import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import get from 'lodash.get'
import db from 'store/db'
import { validateHost as doHostValidation } from 'lib/utils/validateHost'
import { fileExists } from 'lib/utils/fileExists'
import { fetchInfo } from './info'
import { setError } from './error'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CONNECTION_TYPE = 'SET_CONNECTION_TYPE'
export const SET_CONNECTION_STRING = 'SET_CONNECTION_STRING'
export const SET_CONNECTION_HOST = 'SET_CONNECTION_HOST'
export const SET_CONNECTION_CERT = 'SET_CONNECTION_CERT'
export const SET_CONNECTION_MACAROON = 'SET_CONNECTION_MACAROON'
export const SET_ALIAS = 'SET_ALIAS'
export const SET_AUTOPILOT = 'SET_AUTOPILOT'
export const SET_PASSWORD = 'SET_PASSWORD'
export const SET_LND_WALLET_UNLOCKER_STARTED = 'SET_LND_WALLET_UNLOCKER_STARTED'
export const SET_LND_WALLET_STARTED = 'SET_LND_WALLET_STARTED'

export const FETCH_SEED = 'FETCH_SEED'
export const SET_SEED = 'SET_SEED'

export const ONBOARDING_STARTED = 'ONBOARDING_STARTED'
export const ONBOARDING_FINISHED = 'ONBOARDING_FINISHED'

export const STARTING_LND = 'STARTING_LND'
export const LND_STARTED = 'LND_STARTED'
export const SET_START_LND_ERROR = 'SET_START_LND_ERROR'

export const STOPPING_LND = 'STOPPING_LND'
export const LND_STOPPED = 'LND_STOPPED'

export const LOADING_EXISTING_WALLET = 'LOADING_EXISTING_WALLET'
export const CREATING_NEW_WALLET = 'CREATING_NEW_WALLET'
export const RECOVERING_OLD_WALLET = 'RECOVERING_OLD_WALLET'

export const UNLOCKING_WALLET = 'UNLOCKING_WALLET'
export const WALLET_UNLOCKED = 'WALLET_UNLOCKED'
export const SET_UNLOCK_WALLET_ERROR = 'SET_UNLOCK_WALLET_ERROR'

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
  dispatch({ type: SET_SEED, seed: [] })
}

export const setConnectionType = connectionType => async (dispatch, getState) => {
  const previousType = connectionTypeSelector(getState())

  // When changing the connection type, load any saved settings.
  if (previousType !== connectionType) {
    const wallet = (await db.wallets.get({ type: connectionType })) || {}
    dispatch(setConnectionString(wallet.string || initialState.connectionString))
    dispatch(setConnectionHost(wallet.host || initialState.connectionHost))
    dispatch(setConnectionCert(wallet.cert || initialState.connectionCert))
    dispatch(setConnectionMacaroon(wallet.macaroon || initialState.connectionMacaroon))
    dispatch(setAlias(wallet.alias || initialState.alias))
    dispatch(setAutopilot(wallet.autopilot || initialState.autopilot))
    dispatch(setStartLndError({}))
  }

  dispatch({
    type: SET_CONNECTION_TYPE,
    connectionType
  })
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

export function setLndWalletUnlockerStarted() {
  return {
    type: SET_LND_WALLET_UNLOCKER_STARTED
  }
}

export function setLndWalletStarted() {
  return {
    type: SET_LND_WALLET_STARTED
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

export const startLnd = options => async dispatch => {
  return new Promise((resolve, reject) => {
    // Tell the main process to start lnd using the supplied connection details.
    dispatch({ type: STARTING_LND })
    ipcRenderer.send('startLnd', options)

    ipcRenderer.once('startLndError', error => {
      ipcRenderer.removeListener('startLndSuccess', resolve)
      reject(error)
    })

    ipcRenderer.once('startLndSuccess', res => {
      ipcRenderer.removeListener('startLndError', reject)
      resolve(res)
    })
  })
}

// Listener for errors connecting to LND gRPC
export const startLndError = (event, errors) => (dispatch, getState) => {
  const connectionType = connectionTypeSelector(getState())
  switch (connectionType) {
    case 'custom':
      dispatch(setStartLndError(errors))
      break
    case 'btcpayserver':
      dispatch(setStartLndError(errors))
      break
    default:
      dispatch(setError(errors))
  }
}

export const lndStarted = () => async dispatch => {
  dispatch({ type: LND_STARTED })
}

export function setStartLndError(errors) {
  return {
    type: SET_START_LND_ERROR,
    errors
  }
}

export const stopLnd = () => async dispatch => {
  dispatch({ type: STOPPING_LND })
  ipcRenderer.send('stopLnd')
}

export const lndStopped = () => async dispatch => {
  dispatch({ type: LND_STOPPED })
}

export const generateSeed = () => async dispatch => {
  dispatch({ type: FETCH_SEED })
  ipcRenderer.send('startLnd', {
    id: `tmp`,
    type: 'local',
    chain: 'bitcoin',
    network: 'testnet'
  })
}

export const createNewWallet = () => (dispatch, getState) => {
  crypto.randomBytes(16, async (err, buffer) => {
    const state = getState().onboarding

    // Define the wallet config.
    const wallet = {
      id: buffer.toString('hex'),
      type: 'local',
      chain: 'bitcoin',
      network: 'testnet',
      settings: {
        autopilot: state.autopilot,
        alias: state.alias
      }
    }

    // Save the wallet config.
    await db.wallets.put(wallet)

    // Start Lnd and trigger the wallet to be initialised as soon as the wallet unlocker is available.
    dispatch({ type: CREATING_NEW_WALLET })
    ipcRenderer.send('startLnd', wallet)
  })
}

export const recoverOldWallet = () => dispatch => {
  crypto.randomBytes(16, function(err, buffer) {
    const id = buffer.toString('hex')

    dispatch({ type: RECOVERING_OLD_WALLET })
    ipcRenderer.send('startLnd', {
      id,
      type: 'local',
      chain: 'bitcoin',
      network: 'testnet'
    })
  })
}

export const startActiveWallet = () => async dispatch => {
  const activeWallet = await db.settings.get({ key: 'activeWallet' })
  if (activeWallet) {
    const wallet = await db.wallets.get({ id: activeWallet.value })
    if (wallet) {
      dispatch(startLnd(wallet))
    }
  }
}

export const unlockWallet = password => async dispatch => {
  dispatch({ type: UNLOCKING_WALLET })
  ipcRenderer.send('walletUnlocker', {
    msg: 'unlockWallet',
    data: { wallet_password: password }
  })
}

/**
 * As soon as we have an active connection to a WalletUnlocker service, attempt to generate a new seed which kicks off
 * the process of creating or unlocking a wallet.
 */
export const lndWalletUnlockerStarted = () => (dispatch, getState) => {
  dispatch(setLndWalletUnlockerStarted('active'))
  const state = getState().onboarding

  // Handle generate seed.
  if (state.fetchingSeed) {
    ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
  }

  // Handle unlock wallet.
  else if (state.unlockingWallet) {
    ipcRenderer.send('walletUnlocker', {
      msg: 'unlockWallet',
      data: { wallet_password: state.password }
    })
  }

  // Handle create wallet.
  else if (state.creatingNewWallet) {
    ipcRenderer.send('walletUnlocker', {
      msg: 'initWallet',
      data: { wallet_password: state.password, cipher_seed_mnemonic: state.seed }
    })
  }

  // Handle recover wallet.
  else if (state.recoveringOldWallet) {
    ipcRenderer.send('walletUnlocker', {
      msg: 'initWallet',
      data: {
        wallet_password: state.password,
        cipher_seed_mnemonic: state.seed,
        recovery_window: 250
      }
    })
  }

  // // Handle remote connect.
  // else if (state.startingLnd) {
  //   ipcRenderer.send('walletUnlocker', {
  //     msg: 'unlockWallet',
  //     data: { wallet_password: state.password }
  //   })
  // }
}

/**
 * As soon as we have an active connection to an unlocked wallet, fetch the wallet info so that we have the key data as
 * early as possible.
 */
export const lndWalletStarted = lndConfig => async dispatch => {
  dispatch(setLndWalletStarted())

  // Save the wallet settings.
  const walletId = await db.wallets.put(lndConfig)

  // Save the active wallet config.
  await db.settings.put({
    key: 'activeWallet',
    value: walletId
  })

  dispatch(fetchInfo())
  dispatch(lndStarted(lndConfig))
  dispatch({ type: ONBOARDING_FINISHED })
}

// Listener for errors connecting to LND gRPC
export const startOnboarding = () => async (dispatch, getState) => {
  const state = getState().onboarding
  if (state.stoppingLnd) {
    dispatch(lndStopped())
  }
  dispatch({ type: ONBOARDING_STARTED })
}

// Listener for when LND creates and sends us a generated seed
export const receiveSeed = (event, { cipher_seed_mnemonic }) => dispatch => {
  dispatch({ type: SET_SEED, seed: cipher_seed_mnemonic })
  dispatch(stopLnd())
}

// Listener for when LND throws an error on seed creation
export const receiveSeedError = (event, error) => dispatch => {
  dispatch({
    type: LOADING_EXISTING_WALLET,
    existingWalletDir: get(error, 'context.lndDataDir')
  })
}

export const walletCreated = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch({ type: ONBOARDING_FINISHED })
  ipcRenderer.send('startLightningWallet')
}

export const walletUnlocked = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch({ type: ONBOARDING_FINISHED })
  ipcRenderer.send('startLightningWallet')
}

export const setUnlockWalletError = (event, unlockWalletError) => dispatch => {
  dispatch({ type: SET_UNLOCK_WALLET_ERROR, unlockWalletError })
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
  [SET_AUTOPILOT]: (state, { autopilot }) => ({ ...state, autopilot }),
  [FETCH_SEED]: state => ({ ...state, fetchingSeed: true }),
  [SET_SEED]: (state, { seed }) => ({ ...state, seed, fetchingSeed: false }),
  [SET_PASSWORD]: (state, { password }) => ({ ...state, password }),
  [SET_LND_WALLET_UNLOCKER_STARTED]: state => ({
    ...state,
    lndWalletUnlockerStarted: true,
    lndWalletStarted: false
  }),
  [SET_LND_WALLET_STARTED]: state => ({
    ...state,
    lndWalletStarted: true,
    lndWalletUnlockerStarted: false
  }),
  [ONBOARDING_STARTED]: state => ({ ...state, onboarding: true, onboarded: false }),
  [ONBOARDING_FINISHED]: state => ({ ...state, onboarding: false, onboarded: true }),
  [STARTING_LND]: state => ({
    ...state,
    startingLnd: true,
    startLndHostError: '',
    startLndCertError: '',
    startLndMacaroonError: ''
  }),
  [LND_STARTED]: state => ({
    ...state,
    startingLnd: false,
    startLndHostError: '',
    startLndCertError: '',
    startLndMacaroonError: ''
  }),
  [SET_START_LND_ERROR]: (state, { errors }) => ({
    ...state,
    startingLnd: false,
    startLndHostError: errors.host,
    startLndCertError: errors.cert,
    startLndMacaroonError: errors.macaroon
  }),
  [STOPPING_LND]: state => ({
    ...state,
    stoppingLnd: true,
    lndWalletStarted: false,
    lndWalletUnlockerStarted: false
  }),
  [LND_STOPPED]: state => ({ ...state, stoppingLnd: false }),
  [LOADING_EXISTING_WALLET]: (state, { existingWalletDir }) => ({ ...state, existingWalletDir }),
  [CREATING_NEW_WALLET]: state => ({ ...state, creatingNewWallet: true }),
  [RECOVERING_OLD_WALLET]: state => ({ ...state, recoveringOldWallet: true }),
  [UNLOCKING_WALLET]: state => ({ ...state, unlockingWallet: true }),
  [WALLET_UNLOCKED]: state => ({
    ...state,
    unlockingWallet: false,
    unlockWalletError: ''
  }),
  [SET_UNLOCK_WALLET_ERROR]: (state, { unlockWalletError }) => ({
    ...state,
    unlockingWallet: false,
    unlockWalletError
  }),
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

const connectionTypeSelector = state => state.onboarding.connectionType

onboardingSelectors.startingLnd = state => state.onboarding.startingLnd

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
  connectionType: 'create',
  connectionString: '',
  connectionHost: '',
  connectionCert: '',
  connectionMacaroon: '',
  alias: '',
  autopilot: true,
  password: '',
  startingLnd: false,
  startLndHostError: '',
  startLndCertError: '',
  startLndMacaroonError: '',
  fetchingSeed: false,
  seed: [],
  creatingNewWallet: false,
  recoveringOldWallet: false,
  existingWalletDir: null,
  unlockingWallet: false,
  unlockWalletError: '',
  validatingHost: false,
  validatingCert: false,
  validatingMacaroon: false,
  lndWalletUnlockerStarted: false,
  lndWalletStarted: false
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function onboardingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
