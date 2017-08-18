import { ipcRenderer } from 'electron'
import { callApi } from '../api'
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


export function receiveInfo(data) {
  return {
    type: RECEIVE_INFO,
    data
  }
}

// Send IPC event for getifno
export const fetchInfo = () => async (dispatch) => {
  dispatch(getInfo())
  ipcRenderer.send('lnd', { msg: 'info' })
}

// Receive IPC event for info
export const receivedInfo = (event, data) => dispatch => dispatch({ type: RECEIVE_INFO, data })

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

export default function infoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
