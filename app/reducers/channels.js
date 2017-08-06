import { createSelector } from 'reselect'
import { callApi } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHANNEL_FORM = 'SET_CHANNEL_FORM'

export const SET_CHANNEL = 'SET_CHANNEL'

export const GET_CHANNELS = 'GET_CHANNELS'
export const RECEIVE_CHANNELS = 'RECEIVE_CHANNELS'

// ------------------------------------
// Actions
// ------------------------------------
export function setChannelForm(isOpen) {
  return {
    type: SET_CHANNEL_FORM,
    isOpen
  }
}


export function setChannel(channel) {
  return {
    type: SET_CHANNEL,
    channel
  }
}

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
  [SET_CHANNEL_FORM]: (state, { isOpen }) => ({ ...state, channelForm: { ...state.form, isOpen } }),

  [SET_CHANNEL]: (state, { channel }) => ({ ...state, channel }),

  [GET_CHANNELS]: (state) => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels }) => ({ ...state, channelsLoading: false, channels })
}

const channelsSelectors = {}
const channelSelector = state => state.channels.channel

channelsSelectors.channelModalOpen = createSelector(
  channelSelector,
  channel => channel ? true : false
)

export { channelsSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  channelsLoading: false,
  channels: [],
  channel: null,
  channelForm: {
    isOpen: false,
    node_key: '',
    local_amt: '',
    push_amt: ''
  }
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}