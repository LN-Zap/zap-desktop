import { callApi } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CHANNELS = 'GET_CHANNELS'
export const RECEIVE_CHANNELS = 'RECEIVE_CHANNELS'

// ------------------------------------
// Actions
// ------------------------------------
export function getChannels() {
  return {
    type: GET_CHANNELS
  }
}

export function receiveChannels({ channels }) {
  return {
    type: RECEIVE_CHANNELS,
    channels
  }
}

export const fetchChannels = () => async (dispatch) => {
  dispatch(getChannels())
  const channels = await callApi('channels')
  dispatch(receiveChannels(channels.data))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_CHANNELS]: (state) => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels }) => ({ ...state, channelsLoading: false, channels })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  channelsLoading: false,
  channels: []
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}