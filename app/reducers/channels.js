import { createSelector } from 'reselect'
import { callApi } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHANNEL_FORM = 'SET_CHANNEL_FORM'

export const SET_CHANNEL = 'SET_CHANNEL'

export const GET_CHANNELS = 'GET_CHANNELS'
export const RECEIVE_CHANNELS = 'RECEIVE_CHANNELS'

export const GET_PENDING_CHANNELS = 'GET_PENDING_CHANNELS'
export const RECEIVE_PENDING_CHANNELS = 'RECEIVE_PENDING_CHANNELS'

// ------------------------------------
// Actions
// ------------------------------------
export function setChannelForm(form) {
  return {
    type: SET_CHANNEL_FORM,
    form
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

export function getPendingChannels() {
  return {
    type: GET_PENDING_CHANNELS
  }
}

export function receivePendingChannels({ pendingChannels }) {
  return {
    type: RECEIVE_PENDING_CHANNELS,
    pendingChannels
  }
}

export const fetchChannels = () => async (dispatch) => {
  dispatch(getChannels())
  const channels = await callApi('channels')
  dispatch(receiveChannels(channels.data))
}

export const fetchPendingChannels = () => async (dispatch) => {
  dispatch(getPendingChannels())
  const channels = await callApi('pending_channels')
  dispatch(receivePendingChannels(channels.data))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CHANNEL_FORM]: (state, { form }) => ({ ...state, channelForm: Object.assign({}, state.channelForm, form) }),

  [SET_CHANNEL]: (state, { channel }) => ({ ...state, channel }),

  [GET_CHANNELS]: (state) => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels }) => ({ ...state, channelsLoading: false, channels }),

  [GET_PENDING_CHANNELS]: (state) => ({ ...state, channelsLoading: true }),
  [RECEIVE_PENDING_CHANNELS]: (state, { pendingChannels }) => ({ ...state, channelsLoading: false, pendingChannels })
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
  pendingChannels: [],
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