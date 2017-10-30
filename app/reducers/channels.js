import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { btc } from 'utils'
import { closeChannelForm } from './channelform'
import { setError } from './error'
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

export const CLOSING_CHANNEL = 'CLOSING_CHANNEL'
export const CLOSING_SUCCESSFUL = 'CLOSING_SUCCESSFUL'
export const CLOSING_FAILURE = 'CLOSING_FAILURE'

export const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY'

export const SET_VIEW_TYPE = 'SET_VIEW_TYPE'

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

export function openingChannel() {
  return {
    type: OPENING_CHANNEL
  }
}

export function closingChannel() {
  return {
    type: CLOSING_CHANNEL
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

export function updateChannelSearchQuery(searchQuery) {
  return {
    type: UPDATE_SEARCH_QUERY,
    searchQuery
  }
}

export function setViewType(viewType) {
  return {
    type: SET_VIEW_TYPE,
    viewType
  }
}

// Send IPC event for peers
export const fetchChannels = () => async (dispatch) => {
  dispatch(getChannels())
  ipcRenderer.send('lnd', { msg: 'channels' })
}

// Receive IPC event for channels
export const receiveChannels = (event, { channels, pendingChannels }) => dispatch => dispatch({ type: RECEIVE_CHANNELS, channels, pendingChannels })

// Send IPC event for opening a channel
export const openChannel = ({ pubkey, local_amt, push_amt }) => (dispatch) => {
  const localamt = btc.btcToSatoshis(local_amt)
  const pushamt = btc.btcToSatoshis(push_amt)

  dispatch(openingChannel())
  ipcRenderer.send('lnd', { msg: 'openChannel', data: { pubkey, localamt, pushamt } })
}

// TODO: Decide how to handle streamed updates for channels
// Receive IPC event for openChannel
export const channelSuccessful = () => (dispatch) => {
  dispatch(fetchChannels())
  dispatch(closeChannelForm())
}

// Receive IPC event for updated channel
export const pushchannelupdated = () => (dispatch) => {
  dispatch(fetchChannels())
}

// Receive IPC event for channel end
export const pushchannelend = event => (dispatch) => {
  dispatch(fetchChannels())
}

// Receive IPC event for channel error
export const pushchannelerror = (event, { error }) => (dispatch) => {
  dispatch(openingFailure())
  dispatch(setError(error))
}

// Receive IPC event for channel status
export const pushchannelstatus = event => (dispatch) => {
  dispatch(fetchChannels())
}

// Send IPC event for opening a channel
export const closeChannel = ({ channel_point }) => (dispatch) => {
  dispatch(closingChannel())
  const channelPoint = channel_point.split(':')
  ipcRenderer.send(
    'lnd',
    {
      msg: 'closeChannel',
      data: {
        channel_point: {
          funding_txid: channelPoint[0],
          output_index: channelPoint[1]
        },
        force: true
      }
    }
  )
}

// TODO: Decide how to handle streamed updates for closing channels
// Receive IPC event for closeChannel
export const closeChannelSuccessful = () => (dispatch) => {
  dispatch(fetchChannels())
}

// Receive IPC event for updated closing channel
export const pushclosechannelupdated = () => (dispatch) => {
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel end
export const pushclosechannelend = () => (dispatch) => {
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel error
export const pushclosechannelerror = () => (dispatch) => {
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel status
export const pushclosechannelstatus = () => (dispatch) => {
  dispatch(fetchChannels())
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CHANNEL_FORM]: (state, { form }) => (
    { ...state, channelForm: Object.assign({}, state.channelForm, form) }
  ),

  [SET_CHANNEL]: (state, { channel }) => ({ ...state, channel }),

  [GET_CHANNELS]: state => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels, pendingChannels }) => (
    { ...state, channelsLoading: false, channels, pendingChannels }
  ),

  [OPENING_CHANNEL]: state => ({ ...state, openingChannel: true }),
  [OPENING_FAILURE]: state => ({ ...state, openingChannel: false }),

  [CLOSING_CHANNEL]: state => ({ ...state, closingChannel: true }),

  [UPDATE_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [SET_VIEW_TYPE]: (state, { viewType }) => ({ ...state, viewType })
}

const channelsSelectors = {}
const channelSelector = state => state.channels.channel
const channelsSelector = state => state.channels.channels
const pendingOpenChannelsSelector = state => state.channels.pendingChannels.pending_open_channels
const pendingClosedChannelsSelector = state => state.channels.pendingChannels.pending_closing_channels
const pendingForceClosedChannelsSelector = state => state.channels.pendingChannels.pending_force_closing_channels
const channelSearchQuerySelector = state => state.channels.searchQuery

channelsSelectors.channelModalOpen = createSelector(
  channelSelector,
  channel => (!!channel)
)

channelsSelectors.allChannels = createSelector(
  channelsSelector,
  pendingOpenChannelsSelector,
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  channelSearchQuerySelector,
  (channels, pendingOpenChannels, pendingClosedChannels, pendingForcedClosedChannels, searchQuery) => {
    const filteredChannels = channels.filter(channel => channel.remote_pubkey.includes(searchQuery) || channel.channel_point.includes(searchQuery)) // eslint-disable-line
    const filteredPendingOpenChannels = pendingOpenChannels.filter(channel => channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)) // eslint-disable-line
    const filteredPendingClosedChannels = pendingClosedChannels.filter(channel => channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)) // eslint-disable-line
    const filteredPendingForcedClosedChannels = pendingForcedClosedChannels.filter(channel => channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)) // eslint-disable-line


    return [...filteredChannels, ...filteredPendingOpenChannels, ...filteredPendingClosedChannels, ...filteredPendingForcedClosedChannels]
  }
)

channelsSelectors.activeChanIds = createSelector(
  channelsSelector,
  channels => channels.map(channel => channel.chan_id)
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
    pending_closing_channels: [],
    pending_force_closing_channels: []
  },
  channel: null,
  channelForm: {
    isOpen: false,
    node_key: '',
    local_amt: '',
    push_amt: ''
  },
  openingChannel: false,
  closingChannel: false,
  searchQuery: '',
  viewType: 0
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
