import { ipcRenderer } from 'electron'

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_ALIAS = 'UPDATE_ALIAS'

export const CHANGE_STEP = 'CHANGE_STEP'

export const ONBOARDING_STARTED = 'ONBOARDING_STARTED'
export const ONBOARDING_FINISHED = 'ONBOARDING_FINISHED'

// ------------------------------------
// Actions
// ------------------------------------
export function updateAlias(alias) {
  return {
    type: UPDATE_ALIAS,
    alias
  }
}

export function changeStep(step) {
  return {
    type: CHANGE_STEP,
    step
  }
}

export function submit(alias) {
  // alert the app we're done onboarding and it's cool to start LND
  ipcRenderer.send('onboardingFinished', { alias })

  return {
    type: ONBOARDING_FINISHED
  }
}

export const startOnboarding = () => (dispatch) => {
  dispatch({ type: ONBOARDING_STARTED })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_ALIAS]: (state, { alias }) => ({ ...state, alias }),
  [CHANGE_STEP]: (state, { step }) => ({ ...state, step }),
  [ONBOARDING_STARTED]: state => ({ ...state, onboarded: false }),
  [ONBOARDING_FINISHED]: state => ({ ...state, onboarded: true })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  onboarded: true,
  step: 1,
  alias: ''
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function lndReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
