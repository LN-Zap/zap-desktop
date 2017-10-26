import { createSelector } from 'reselect'

// Initial State
const initialState = {
  isOpen: false,
  node_key: '',
  local_amt: 0,
  push_amt: 0,

  step: 1
}

// Constants
// ------------------------------------
export const OPEN_CHANNEL_FORM = 'OPEN_CHANNEL_FORM'
export const CLOSE_CHANNEL_FORM = 'CLOSE_CHANNEL_FORM'

export const SET_NODE_KEY = 'SET_NODE_KEY'
export const SET_LOCAL_AMOUNT = 'SET_LOCAL_AMOUNT'

export const CHANGE_STEP = 'CHANGE_STEP'

export const RESET_CHANNEL_FORM = 'RESET_CHANNEL_FORM'

// ------------------------------------
// Actions
// ------------------------------------
export function openChannelForm() {
  return {
    type: OPEN_CHANNEL_FORM
  }
}

export function closeChannelForm() {
  return {
    type: CLOSE_CHANNEL_FORM
  }
}

export function setNodeKey(node_key) {
  return {
    type: SET_NODE_KEY,
    node_key
  }
}

export function setLocalAmount(local_amt) {
  return {
    type: SET_LOCAL_AMOUNT,
    local_amt
  }
}

export function changeStep(step) {
  return {
    type: CHANGE_STEP,
    step
  }
}

export function resetChannelForm() {
  return {
    type: RESET_CHANNEL_FORM
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [OPEN_CHANNEL_FORM]: state => ({ ...state, isOpen: true }),
  [CLOSE_CHANNEL_FORM]: state => ({ ...state, isOpen: false }),
  
  [SET_NODE_KEY]: (state, { node_key }) => ({ ...state, node_key }),
  [SET_LOCAL_AMOUNT]: (state, { local_amt }) => ({ ...state, local_amt }),
  
  [CHANGE_STEP]: (state, { step }) => ({ ...state, step }),

  [RESET_CHANNEL_FORM]: () => (initialState)
}

const channelFormSelectors = {}
const channelFormStepSelector = state => state.channelform.step

channelFormSelectors.channelFormHeader = createSelector(
  channelFormStepSelector,
  step => {
    switch (step) {
      case 1:
        return 'Select a peer'
      case 2:
        return 'Set your local amount'
      case 3:
        return 'Set your push amount'
      default:
        return 'Confirm'
    }
  }
)

channelFormSelectors.channelFormProgress = createSelector(
  channelFormStepSelector,
  step => (step / 4) * 100
)

export { channelFormSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function channelFormReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
