import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import get from 'lodash.get'
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

export const UPDATE_ALIAS = 'UPDATE_ALIAS'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_CREATE_WALLET_PASSWORD = 'UPDATE_CREATE_WALLET_PASSWORD'
export const UPDATE_CREATE_WALLET_PASSWORD_CONFIRMATION =
  'UPDATE_CREATE_WALLET_PASSWORD_CONFIRMATION'
export const UPDATE_RE_ENTER_SEED_INPUT = 'UPDATE_RE_ENTER_SEED_INPUT'
export const UPDATE_RECOVER_SEED_INPUT = 'UPDATE_RECOVER_SEED_INPUT'

export const CHANGE_STEP = 'CHANGE_STEP'

export const SET_AUTOPILOT = 'SET_AUTOPILOT'

export const FETCH_SEED = 'FETCH_SEED'
export const SET_SEED = 'SET_SEED'
export const SET_HAS_SEED = 'SET_HAS_SEED'
export const SET_RE_ENTER_SEED_INDEXES = 'SET_RE_ENTER_SEED_INDEXES'

export const ONBOARDING_STARTED = 'ONBOARDING_STARTED'
export const ONBOARDING_FINISHED = 'ONBOARDING_FINISHED'

export const STARTING_LND = 'STARTING_LND'
export const LND_STARTED = 'LND_STARTED'
export const SET_START_LND_ERROR = 'SET_START_LND_ERROR'

export const LOADING_EXISTING_WALLET = 'LOADING_EXISTING_WALLET'

export const CREATING_NEW_WALLET = 'CREATING_NEW_WALLET'

export const RECOVERING_OLD_WALLET = 'RECOVERING_OLD_WALLET'

export const UNLOCKING_WALLET = 'UNLOCKING_WALLET'
export const WALLET_UNLOCKED = 'WALLET_UNLOCKED'
export const SET_UNLOCK_WALLET_ERROR = 'SET_UNLOCK_WALLET_ERROR'

export const SET_SIGNUP_CREATE = 'SET_SIGNUP_CREATE'
export const SET_SIGNUP_IMPORT = 'SET_SIGNUP_IMPORT'

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
export const setConnectionType = connectionType => (dispatch, getState) => {
  const previousType = connectionTypeSelector(getState())

  // When changing the connection type clear out existing config.
  if (previousType !== connectionType) {
    dispatch(setConnectionString(''))
    dispatch(setConnectionHost(''))
    dispatch(setConnectionCert(''))
    dispatch(setConnectionMacaroon(''))
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

export function updateAlias(alias) {
  return {
    type: UPDATE_ALIAS,
    alias
  }
}

export function updatePassword(password) {
  return {
    type: UPDATE_PASSWORD,
    password
  }
}

export function updateCreateWalletPassword(createWalletPassword) {
  return {
    type: UPDATE_CREATE_WALLET_PASSWORD,
    createWalletPassword
  }
}

export function updateCreateWalletPasswordConfirmation(createWalletPasswordConfirmation) {
  return {
    type: UPDATE_CREATE_WALLET_PASSWORD_CONFIRMATION,
    createWalletPasswordConfirmation
  }
}

export function updateReEnterSeedInput(inputSeedObj) {
  return {
    type: UPDATE_RE_ENTER_SEED_INPUT,
    inputSeedObj
  }
}

export function updateRecoverSeedInput(inputSeedObj) {
  return {
    type: UPDATE_RECOVER_SEED_INPUT,
    inputSeedObj
  }
}

export function setAutopilot(autopilot) {
  return {
    type: SET_AUTOPILOT,
    autopilot
  }
}

export function setSignupCreate() {
  return {
    type: SET_SIGNUP_CREATE
  }
}

export function setSignupImport() {
  return {
    type: SET_SIGNUP_IMPORT
  }
}

export function changeStep(step) {
  return {
    type: CHANGE_STEP,
    step
  }
}

export function startLnd(options) {
  // once the user submits the data needed to start LND we will alert the app that it should start LND
  ipcRenderer.send('startLnd', options)

  return {
    type: STARTING_LND
  }
}

export function lndStarted() {
  return {
    type: LND_STARTED
  }
}

export function setStartLndError(errors) {
  return {
    type: SET_START_LND_ERROR,
    errors
  }
}

export function setReEnterSeedIndexes() {
  // we only want the user to have to verify 3 random indexes from the seed they were just given
  const INDEX_AMOUNT = 3

  const seedIndexesArr = []
  while (seedIndexesArr.length < INDEX_AMOUNT) {
    // add 1 because we dont want this to be 0 index based
    const ranNum = Math.floor(Math.random() * 24) + 1

    if (seedIndexesArr.indexOf(ranNum) > -1) {
      continue
    }

    seedIndexesArr[seedIndexesArr.length] = ranNum
  }

  return {
    type: SET_RE_ENTER_SEED_INDEXES,
    seedIndexesArr
  }
}

/**
 * As soon as we have an active connection to a WalletUnlocker service, attempt to generate a new seed which kicks off
 * the process of creating or unlocking a wallet.
 */
export const lndWalletUnlockerStarted = () => dispatch => {
  ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
  dispatch({ type: FETCH_SEED })
}

/**
 * As soon as we have an active connection to an unlocked wallet, fetch the wallet info so that we have the key data as
 * early as possible.
 */
export const lndWalletStarted = () => dispatch => {
  dispatch(fetchInfo())
  dispatch(lndStarted())
}

export const submitNewWallet = (
  wallet_password,
  cipher_seed_mnemonic,
  aezeed_passphrase
) => dispatch => {
  // once the user submits the data needed to start LND we will alert the app that it should start LND
  ipcRenderer.send('walletUnlocker', {
    msg: 'initWallet',
    data: { wallet_password, cipher_seed_mnemonic, aezeed_passphrase }
  })
  dispatch({ type: CREATING_NEW_WALLET })
}

export const recoverOldWallet = (
  wallet_password,
  cipher_seed_mnemonic,
  aezeed_passphrase
) => dispatch => {
  // once the user submits the data needed to start LND we will alert the app that it should start LND
  ipcRenderer.send('walletUnlocker', {
    msg: 'initWallet',
    data: { wallet_password, cipher_seed_mnemonic, aezeed_passphrase, recovery_window: 250 }
  })
  dispatch({ type: RECOVERING_OLD_WALLET })
}

// Listener for errors connecting to LND gRPC
export const startOnboarding = (event, lndConfig = {}) => dispatch => {
  dispatch(setConnectionType(lndConfig.type))

  switch (lndConfig.type) {
    case 'local':
      dispatch(updateAlias(lndConfig.alias))
      dispatch(setAutopilot(lndConfig.autopilot))
      break
    case 'custom':
      dispatch(setConnectionHost(lndConfig.host))
      dispatch(setConnectionCert(lndConfig.cert))
      dispatch(setConnectionMacaroon(lndConfig.macaroon))
      break
    case 'btcpayserver':
      dispatch(setConnectionString(lndConfig.string))
      break
  }

  dispatch({ type: ONBOARDING_STARTED })
}

// Listener for errors connecting to LND gRPC
export const startLndError = (event, errors) => (dispatch, getState) => {
  const connectionType = connectionTypeSelector(getState())

  switch (connectionType) {
    case 'local':
      dispatch(setError(errors))
      dispatch({ type: CHANGE_STEP, step: 0.1 })
      break
    case 'custom':
      dispatch(setStartLndError(errors))
      dispatch({ type: CHANGE_STEP, step: 0.2 })
      break
    case 'btcpayserver':
      dispatch(setStartLndError(errors))
      dispatch({ type: CHANGE_STEP, step: 0.3 })
      break
  }
}

export const createWallet = () => dispatch => {
  ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
  dispatch({ type: CHANGE_STEP, step: 4 })
}

export const finishOnboarding = () => dispatch => dispatch({ type: ONBOARDING_FINISHED })

// Listener for when LND creates and sends us a generated seed
export const receiveSeed = (event, { cipher_seed_mnemonic }) => dispatch => {
  dispatch({ type: CHANGE_STEP, step: 4 })
  // there was no seed and we just generated a new one, send user to the login component
  dispatch({ type: SET_SEED, seed: cipher_seed_mnemonic })
}

// Listener for when LND throws an error on seed creation
export const receiveSeedError = (event, error) => dispatch => {
  dispatch({ type: SET_HAS_SEED, hasSeed: true })
  // there is already a seed, send user to the login component
  dispatch({ type: CHANGE_STEP, step: 3 })
  dispatch({
    type: LOADING_EXISTING_WALLET,
    existingWalletDir: get(error, 'context.lndDataDir')
  })
}

// Unlock an existing wallet with a wallet password
export const unlockWallet = wallet_password => dispatch => {
  ipcRenderer.send('walletUnlocker', { msg: 'unlockWallet', data: { wallet_password } })
  dispatch({ type: UNLOCKING_WALLET })
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

export const walletConnected = () => dispatch => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch({ type: ONBOARDING_FINISHED })
}

export const unlockWalletError = () => dispatch => {
  dispatch({ type: SET_UNLOCK_WALLET_ERROR })
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
  [UPDATE_ALIAS]: (state, { alias }) => ({ ...state, alias }),
  [UPDATE_PASSWORD]: (state, { password }) => ({ ...state, password }),
  [UPDATE_CREATE_WALLET_PASSWORD]: (state, { createWalletPassword }) => ({
    ...state,
    createWalletPassword
  }),
  [UPDATE_CREATE_WALLET_PASSWORD_CONFIRMATION]: (state, { createWalletPasswordConfirmation }) => ({
    ...state,
    createWalletPasswordConfirmation
  }),
  [UPDATE_RE_ENTER_SEED_INPUT]: (state, { inputSeedObj }) => ({
    ...state,
    reEnterSeedInput: { ...state.reEnterSeedInput, [inputSeedObj.index]: inputSeedObj.word }
  }),
  [UPDATE_RECOVER_SEED_INPUT]: (state, { inputSeedObj }) => ({
    ...state,
    recoverSeedInput: Object.assign([], state.recoverSeedInput, {
      [inputSeedObj.index]: inputSeedObj
    })
  }),

  [SET_AUTOPILOT]: (state, { autopilot }) => ({ ...state, autopilot }),

  [FETCH_SEED]: state => ({ ...state, fetchingSeed: true }),
  [SET_HAS_SEED]: (state, { hasSeed }) => ({ ...state, hasSeed, fetchingSeed: false }),
  [SET_SEED]: (state, { seed }) => ({ ...state, seed, fetchingSeed: false }),
  [SET_RE_ENTER_SEED_INDEXES]: (state, { seedIndexesArr }) => ({ ...state, seedIndexesArr }),

  [CHANGE_STEP]: (state, { step }) => ({ ...state, step, previousStep: state.step }),

  [ONBOARDING_STARTED]: state => ({ ...state, onboarding: true, onboarded: false }),
  [ONBOARDING_FINISHED]: state => ({ ...state, onboarding: false, onboarded: true }),

  [STARTING_LND]: state => ({ ...state, startingLnd: true }),
  [LND_STARTED]: state => ({ ...state, startingLnd: false }),
  [SET_START_LND_ERROR]: (state, { errors }) => ({
    ...state,
    startingLnd: false,
    startLndHostError: errors.host,
    startLndCertError: errors.cert,
    startLndMacaroonError: errors.macaroon
  }),

  [LOADING_EXISTING_WALLET]: (state, { existingWalletDir }) => ({ ...state, existingWalletDir }),

  [CREATING_NEW_WALLET]: state => ({ ...state, creatingNewWallet: true }),

  [RECOVERING_OLD_WALLET]: state => ({ ...state, recoveringOldWallet: true }),

  [UNLOCKING_WALLET]: state => ({ ...state, unlockingWallet: true }),
  [WALLET_UNLOCKED]: state => ({
    ...state,
    unlockingWallet: false,
    unlockWalletError: { isError: false, message: '' }
  }),
  [SET_UNLOCK_WALLET_ERROR]: state => ({
    ...state,
    unlockingWallet: false,
    unlockWalletError: { isError: true, message: 'Incorrect password' }
  }),

  [SET_SIGNUP_CREATE]: state => ({ ...state, signupForm: { create: true, import: false } }),
  [SET_SIGNUP_IMPORT]: state => ({ ...state, signupForm: { create: false, import: true } })
}

// ------------------------------------
// Selector
// ------------------------------------
const onboardingSelectors = {}
const passwordSelector = state => state.onboarding.password

const createWalletPasswordSelector = state => state.onboarding.createWalletPassword
const createWalletPasswordConfirmationSelector = state =>
  state.onboarding.createWalletPasswordConfirmation

const seedSelector = state => state.onboarding.seed
const seedIndexesArrSelector = state => state.onboarding.seedIndexesArr
const reEnterSeedInputSelector = state => state.onboarding.reEnterSeedInput

const connectionStringSelector = state => state.onboarding.connectionString
const connectionTypeSelector = state => state.onboarding.connectionType
const connectionHostSelector = state => state.onboarding.connectionHost

onboardingSelectors.startingLnd = state => state.onboarding.startingLnd

onboardingSelectors.passwordIsValid = createSelector(
  passwordSelector,
  password => password.length >= 8
)

onboardingSelectors.passwordMinCharsError = createSelector(
  createWalletPasswordSelector,
  createWalletPasswordConfirmationSelector,
  (pass1, pass2) => pass1 === pass2 && pass1.length < 8 && pass1.length > 0
)

onboardingSelectors.showCreateWalletPasswordConfirmationError = createSelector(
  createWalletPasswordSelector,
  createWalletPasswordConfirmationSelector,
  (pass1, pass2) => pass1 !== pass2 && pass2.length > 0
)

onboardingSelectors.reEnterSeedChecker = createSelector(
  seedSelector,
  seedIndexesArrSelector,
  reEnterSeedInputSelector,
  (seed, seedIndexArr, reEnterSeedInput) =>
    Object.keys(reEnterSeedInput).length >= seedIndexArr.length &&
    seedIndexArr.every(
      index => reEnterSeedInput[index] && reEnterSeedInput[index] === seed[index - 1]
    )
)

onboardingSelectors.connectionHostIsValid = createSelector(
  connectionHostSelector,
  connectionHost => {
    return connectionHost.length > 0
  }
)

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

onboardingSelectors.connectionStringIsValid = createSelector(
  onboardingSelectors.connectionStringParamsSelector,
  connectionStringParams => {
    const { host, port, macaroon } = connectionStringParams
    return Boolean(host && port && macaroon)
  }
)

export { onboardingSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  onboarding: false,
  onboarded: false,
  step: 0.1,
  connectionType: 'default',
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
  hasSeed: false,
  seed: [],

  // wallet password. password used to encrypt the wallet and is required to unlock the daemon after set
  createWalletPassword: '',
  createWalletPasswordConfirmation: '',
  creatingNewWallet: false,
  recoveringOldWallet: false,

  existingWalletDir: null,
  unlockingWallet: false,
  unlockWalletError: {
    isError: false,
    message: ''
  },

  seedIndexesArr: [],
  // object of inputs for when the user re-enters their seed
  // {
  // index: word,
  // index: word,
  // index: word
  // }
  reEnterSeedInput: {},
  recoverSeedInput: [],
  // step where the user decides whether they want a newly created seed or to import an existing one
  signupForm: {
    create: true,
    import: false
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function onboardingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
