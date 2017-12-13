import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_INFO = 'GET_INFO'
export const RECEIVE_INFO = 'RECEIVE_INFO'

// ------------------------------------
// Actions
// ------------------------------------
export function getInfo() {
  return {
    type: GET_INFO
  }
}

// Send IPC event for getinfo
export const fetchInfo = () => async (dispatch) => {
  dispatch(getInfo())
  ipcRenderer.send('lnd', { msg: 'info' })
}

// Receive IPC event for info
export const receiveInfo = (event, data) => (dispatch) => {
  dispatch({ type: RECEIVE_INFO, data })
}

// IPC info fetch failed
// export const infoFailed = (event, data) => dispatch => {}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_INFO]: state => ({ ...state, infoLoading: true }),
  [RECEIVE_INFO]: (state, { data }) => ({ ...state, infoLoading: false, data })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  infoLoading: false,
  data: {}
}

// Selectors
const infoSelectors = {}
const testnetSelector = state => state.info.data.testnet

infoSelectors.isTestnet = createSelector(
  testnetSelector,
  isTestnet => (!!isTestnet)
)

infoSelectors.explorerLinkBase = createSelector(
  infoSelectors.isTestnet,
  isTestnet => (isTestnet ? 'https://testnet.smartbit.com.au' : 'https://smartbit.com.au')
)

export { infoSelectors }

export default function infoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
