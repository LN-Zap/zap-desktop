import { createSelector } from 'reselect'
import { usd, btc } from '../utils'
import { callApi, callApis } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHANNEL_FORM = 'SET_CHANNEL_FORM'

export const SET_CHANNEL = 'SET_CHANNEL'

export const GET_CHANNELS = 'GET_CHANNELS'
export const RECEIVE_CHANNELS = 'RECEIVE_CHANNELS'

export const OPENING_CHANNEL = 'OPENING_CHANNEL'
export const OPENING_SUCCESSFUL = 'OPENING_SUCCESSFUL'
export const OPENING_FAILURE = 'OPENING_FAILURE'

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

export function receiveChannels(channels) {
  return {
    type: RECEIVE_CHANNELS,
    channels: channels[0].data.channels,
    pendingChannels: channels[1].data
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

export function openingChannel() {
  return {
    type: OPENING_CHANNEL
  }
}

export function openingSuccessful() {
  return {
    type: OPENING_SUCCESSFUL
  }
}

export function openingFailure() {
  return {
    type: OPENING_FAILURE
  }
}

export const fetchChannels = () => async (dispatch) => {
  dispatch(getChannels())
  const channels = await callApis(['channels', 'pending_channels'])
  dispatch(receiveChannels(channels))
}

export const openChannel = ({ pubkey, localamt, pushamt }) => async (dispatch) => {
  const payload = { pubkey, localamt, pushamt }
  dispatch(openingChannel())
  const channel = await callApi('addchannel', 'post', payload)
  console.log('channel: ', channel)
  
  channel.data ? dispatch(openingSuccessful()) : dispatch(openingFailure())

  return channel
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CHANNEL_FORM]: (state, { form }) => ({ ...state, channelForm: Object.assign({}, state.channelForm, form) }),

  [SET_CHANNEL]: (state, { channel }) => ({ ...state, channel }),

  [GET_CHANNELS]: (state) => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels, pendingChannels }) => ({ ...state, channelsLoading: false, channels, pendingChannels }),

  [OPENING_CHANNEL]: (state) => ({ ...state, openingChannel: true }),
}

const channelsSelectors = {}
const channelSelector = state => state.channels.channel
const channelsSelector = state => state.channels.channels
const pendingOpenChannelsSelector = state => state.channels.pendingChannels.pending_open_channels
const pendingClosedChannelsSelector = state => state.channels.pendingChannels.pending_closing_channels
const pendingForceClosedChannelsSelector = state => state.channels.pendingChannels.pending_force_closing_channels

channelsSelectors.channelModalOpen = createSelector(
  channelSelector,
  channel => channel ? true : false
)

channelsSelectors.allChannels = createSelector(
  channelsSelector,
  pendingOpenChannelsSelector,
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  (channels, pendingOpenChannels, pendingClosedChannels, pendingForcedClosedChannels) => [...channels, ...pendingOpenChannels, ...pendingClosedChannels, ...pendingForcedClosedChannels]
)

export { channelsSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  channelsLoading: false,
  channels: [],
  pendingChannels: {
    total_limbo_balance: '',
    pending_open_channels: [],
    pending_closing_channels: [
      {
        "channel": {
          "remote_node_pub": "02ef6248210e27b0f0df4d11d876e63f56e04bcb0054d0d8b6ba6a1a3e90dc56e1",
          "channel_point": "5f6c522970e81069075c27be8799d0e2fb16dd4975cbd84c07b1a8bc9ece9918:0",
          "capacity": "10000",
          "local_balance": "312",
          "remote_balance": "0"
        },
        "closing_txid": "4c0a25b0955e9efca46065a317a9560c9e3618356d4985e1a905eeb662e40bdb"
      }
    ],
    pending_force_closing_channels: []
  },
  channel: null,
  channelForm: {
    isOpen: false,
    node_key: '',
    local_amt: '',
    push_amt: ''
  },
  openingChannel: false
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}