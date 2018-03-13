import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_ALIAS = 'UPDATE_ALIAS'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_CREATE_WALLET_PASSWORD = 'UPDATE_CREATE_WALLET_PASSWORD'

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

export function setAutopilot(autopilot) {
  return {
    type: SET_AUTOPILOT,
    autopilot
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

export function submitNewWallet(wallet_password, cipher_seed_mnemonic) {
  // once the user submits the data needed to start LND we will alert the app that it should start LND 
  ipcRenderer.send('walletUnlocker', { msg: 'initWallet', data: { wallet_password, cipher_seed_mnemonic } })
  dispatch({ type: CREATING_NEW_WALLET })
}

export const startOnboarding = () => (dispatch) => {
  dispatch({ type: ONBOARDING_STARTED })
}

// Listener from after the LND walletUnlocker has started
export const walletUnlockerStarted = () => (dispatch) => {
  dispatch({ type: LND_STARTED })
  dispatch({ type: CHANGE_STEP, step: 3 })
  ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
}

export const createWallet = () => (dispatch) => {
  ipcRenderer.send('walletUnlocker', { msg: 'genSeed' })
  dispatch({ type: CHANGE_STEP, step: 4 })
}

export const successfullyCreatedWallet = (event) => (dispatch) => dispatch({ type: ONBOARDING_FINISHED })

// Listener for when LND creates and sends us a generated seed
export const receiveSeed = (event, { cipher_seed_mnemonic }) => (dispatch) => dispatch({ type: SET_SEED, seed: cipher_seed_mnemonic })

// Listener for when LND throws an error on seed creation
export const receiveSeedError = (event, error) => (dispatch) => dispatch({ type: SET_HAS_SEED, hasSeed: true })

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
  [SET_UNLOCK_WALLET_ERROR]: state => ({ ...state, unlockingWallet: false, unlockWalletError: { isError: true, message: 'Incorrect password' } })
}

const onboardingSelectors = {}
const passwordSelector = state => state.onboarding.password

onboardingSelectors.passwordIsValid = createSelector(
  passwordSelector,
  password => password.length >= 8
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
  
  createWalletPassword: '',
  creatingNewWallet: false,

  unlockingWallet: false,
  unlockWalletError: {
    isError: false,
    message: ''
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
