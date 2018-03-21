import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_ALIAS = 'UPDATE_ALIAS'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_CREATE_WALLET_PASSWORD = 'UPDATE_CREATE_WALLET_PASSWORD'
export const UPDATE_AEZEED_PASSWORD = 'UPDATE_AEZEED_PASSWORD'
export const UPDATE_SEED_INPUT = 'UPDATE_SEED_INPUT'

export const CHANGE_STEP = 'CHANGE_STEP'

export const SET_AUTOPILOT = 'SET_AUTOPILOT'

export const FETCH_SEED = 'FETCH_SEED'
export const SET_SEED = 'SET_SEED'
export const SET_HAS_SEED = 'SET_HAS_SEED'

export const ONBOARDING_STARTED = 'ONBOARDING_STARTED'
export const ONBOARDING_FINISHED = 'ONBOARDING_FINISHED'

export const STARTING_LND = 'STARTING_LND'
export const LND_STARTED = 'LND_STARTED'

export const CREATING_NEW_WALLET = 'CREATING_NEW_WALLET'

export const UNLOCKING_WALLET = 'UNLOCKING_WALLET'
export const WALLET_UNLOCKED = 'WALLET_UNLOCKED'
export const SET_UNLOCK_WALLET_ERROR = 'SET_UNLOCK_WALLET_ERROR'

export const SET_SIGNUP_CREATE = 'SET_SIGNUP_CREATE'
export const SET_SIGNUP_IMPORT = 'SET_SIGNUP_IMPORT'
// ------------------------------------
// Actions
// ------------------------------------
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

export function updateAezeedPassword(aezeedPassword) {
  return {
    type: UPDATE_AEZEED_PASSWORD,
    aezeedPassword
  }
}

export function updateSeedInput(inputSeedObj) {
  return {
    type: UPDATE_SEED_INPUT,
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

export function startLnd(alias, autopilot) {
  // once the user submits the data needed to start LND we will alert the app that it should start LND 
  ipcRenderer.send('startLnd', { alias, autopilot })

  return {
    type: STARTING_LND
  }
}

export const submitNewWallet = (wallet_password, cipher_seed_mnemonic, aezeed_passphrase) => (dispatch) => {
  // once the user submits the data needed to start LND we will alert the app that it should start LND 
  ipcRenderer.send('walletUnlocker', { msg: 'initWallet', data: { wallet_password, cipher_seed_mnemonic, aezeed_passphrase } })
  dispatch({ type: CREATING_NEW_WALLET })
}

export const startOnboarding = () => (dispatch) => {
  dispatch({ type: ONBOARDING_STARTED })
}

// Listener from after the LND walletUnlocker has started
export const walletUnlockerStarted = () => (dispatch) => {
  dispatch({ type: LND_STARTED })
  ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
}

export const createWallet = () => (dispatch) => {
  ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
  dispatch({ type: CHANGE_STEP, step: 4 })
}

export const successfullyCreatedWallet = (event) => (dispatch) => dispatch({ type: ONBOARDING_FINISHED })

// Listener for when LND creates and sends us a generated seed
export const receiveSeed = (event, { cipher_seed_mnemonic }) => (dispatch) => {
  dispatch({ type: SET_SEED, seed: cipher_seed_mnemonic })
  // there was no seed and we just generated a new one, send user to the login component
  dispatch({ type: CHANGE_STEP, step: 4 })
}

// Listener for when LND throws an error on seed creation
export const receiveSeedError = (event, error) => (dispatch) => {
  dispatch({ type: SET_HAS_SEED, hasSeed: true })
  // there is already a seed, send user to the login component
  dispatch({ type: CHANGE_STEP, step: 3 })
}

// Unlock an existing wallet with a wallet password
export const unlockWallet = (wallet_password) => (dispatch) => {
  ipcRenderer.send('walletUnlocker', { msg: 'unlockWallet', data: { wallet_password } })
  dispatch({ type: UNLOCKING_WALLET })
}

export const walletUnlocked = () => (dispatch) => {
  dispatch({ type: WALLET_UNLOCKED })
  dispatch({ type: ONBOARDING_FINISHED })
}

export const unlockWalletError = () => (dispatch) => {
  dispatch({ type: SET_UNLOCK_WALLET_ERROR })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_ALIAS]: (state, { alias }) => ({ ...state, alias }),
  [UPDATE_PASSWORD]: (state, { password }) => ({ ...state, password }),
  [UPDATE_CREATE_WALLET_PASSWORD]: (state, { createWalletPassword }) => ({ ...state, createWalletPassword }),
  [UPDATE_AEZEED_PASSWORD]: (state, { aezeedPassword }) => ({ ...state, aezeedPassword }),
  [UPDATE_SEED_INPUT]: (state, { inputSeedObj }) => {
    return {
      ...state,
      seedInput: Object.assign([], state.seedInput, { [inputSeedObj['index']]: inputSeedObj })
    }
  },
  
  [SET_AUTOPILOT]: (state, { autopilot }) => ({ ...state, autopilot }),
  
  [SET_HAS_SEED]: (state, { hasSeed }) => ({ ...state, hasSeed }),
  [SET_SEED]: (state, { seed }) => ({ ...state, seed, fetchingSeed: false }),
  
  [CHANGE_STEP]: (state, { step }) => ({ ...state, step }),
  
  [ONBOARDING_STARTED]: state => ({ ...state, onboarded: false }),
  [ONBOARDING_FINISHED]: state => ({ ...state, onboarded: true }),
  
  [STARTING_LND]: state => ({ ...state, startingLnd: true }),
  [LND_STARTED]: state => ({ ...state, startingLnd: false }),

  [CREATING_NEW_WALLET]: state => ({ ...state, creatingNewWallet: true }),

  [UNLOCKING_WALLET]: state => ({ ...state, unlockingWallet: true }),
  [WALLET_UNLOCKED]: state => ({ ...state, unlockingWallet: false, unlockWalletError: { isError: false, message: '' } }),
  [SET_UNLOCK_WALLET_ERROR]: state => ({ ...state, unlockingWallet: false, unlockWalletError: { isError: true, message: 'Incorrect password' } }),
  
  [SET_SIGNUP_CREATE]: state => ({ ...state, signupForm: { create: true, import: false } }),
  [SET_SIGNUP_IMPORT]: state => ({ ...state, signupForm: { create: false, import: true } })
}

const onboardingSelectors = {}
const passwordSelector = state => state.onboarding.password
const seedSelector = state => state.onboarding.seed
const seedInputSelector = state => state.onboarding.seedInput

onboardingSelectors.passwordIsValid = createSelector(
  passwordSelector,
  password => password.length >= 8
)

onboardingSelectors.reEnterSeedChecker = createSelector(
  seedSelector,
  seedInputSelector,
  (seed, seedInput) => seed.length === seedInput.length && seed.every((word, i) => word === seedInput[i].word)
)

export { onboardingSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  onboarded: true,
  step: 1,
  alias: '',
  password: '',
  startingLnd: false,
  
  fetchingSeed: false,
  hasSeed: false,
  seed: [],
  
  // wallet password. password used to encrypt the wallet and is required to unlock the daemon after set
  createWalletPassword: '',
  creatingNewWallet: false,

  // seed password. this is optional and used to encrypt the seed
  aezeedPassword: '',

  unlockingWallet: false,
  unlockWalletError: {
    isError: false,
    message: ''
  },

  // array of inputs for when the user re-enters their seed
  // object has a word attr and a index attr:
  // { word: 'foo', index: 0 }
  seedInput: [],
  // step where the user decides whether they want a newly created seed or to import an existing one
  signupForm: {
    create: false,
    import: false
  },

  autopilot: null
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function onboardingReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
