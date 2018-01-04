import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { btc } from 'utils'
import { showNotification } from 'notifications'
import { closeChannelForm, resetChannelForm } from './channelform'
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

export const TOGGLE_CHANNEL_PULLDOWN = 'TOGGLE_CHANNEL_PULLDOWN'
export const CHANGE_CHANNEL_FILTER = 'CHANGE_CHANNEL_FILTER'

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
export const openChannel = ({ pubkey, host, local_amt, push_amt }) => (dispatch) => {
  const localamt = btc.btcToSatoshis(local_amt)

  dispatch(openingChannel())
  ipcRenderer.send('lnd', { msg: 'connectAndOpen', data: { pubkey, host, localamt } })
}

// TODO: Decide how to handle streamed updates for channels
// Receive IPC event for openChannel
export const channelSuccessful = () => (dispatch) => {
  console.log('CHANNEL channelSuccessful')
  dispatch(fetchChannels())
  dispatch(closeChannelForm())
  dispatch(resetChannelForm())
}

// Receive IPC event for updated channel
export const pushchannelupdated = (event, data) => (dispatch) => {
  console.log('PUSH CHANNEL UPDATED: ', data)
  dispatch(fetchChannels())
}

// Receive IPC event for channel end
export const pushchannelend = event => (dispatch) => { // eslint-disable-line
  console.log('PUSH CHANNEL END: ')
  dispatch(fetchChannels())
}

// Receive IPC event for channel error
export const pushchannelerror = (event, { error }) => (dispatch) => {
  console.log('PUSH CHANNEL ERROR: ', error)
  dispatch(openingFailure())
  dispatch(setError(error))
}

// Receive IPC event for channel status
export const pushchannelstatus = (event, data) => (dispatch) => { // eslint-disable-line
  console.log('PUSH CHANNEL STATUS: ', data)
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
export const closeChannelSuccessful = (event, data) => (dispatch) => {
  console.log('PUSH CLOSE CHANNEL SUCCESSFUL: ', data)
  dispatch(fetchChannels())
}

// Receive IPC event for updated closing channel
export const pushclosechannelupdated = (event, data) => (dispatch) => {
  console.log('PUSH CLOSE CHANNEL UPDATED: ', data)
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel end
export const pushclosechannelend = (event, data) => (dispatch) => {
  console.log('PUSH CLOSE CHANNEL END: ', data)
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel error
export const pushclosechannelerror = (event, data) => (dispatch) => {
  console.log('PUSH CLOSE CHANNEL END: ', data)
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel status
export const pushclosechannelstatus = (event, data) => (dispatch) => {
  console.log('PUSH CLOSE CHANNEL STATUS: ', data)
  dispatch(fetchChannels())
}

// IPC event for channel graph data
export const channelGraphData = (event, data) => (dispatch, getState) => {
  const info = getState().info
  const { channelGraphData: { channel_updates } } = data

  // if there are any new channel updates
  if (channel_updates.length) {
    // The network has updated, so fetch a new result
    // TODO: can't do this now because of the SVG performance issues, after we fix this we can uncomment the line below
    // dispatch(fetchDescribeNetwork())

    // loop through the channel updates
    for (let i = 0; i < channel_updates.length; i += 1) {
      const channel_update = channel_updates[i]
      const { advertising_node, connecting_node } = channel_update

      // if our node is involved in this update we wanna show a notification
      if (info.data.identity_pubkey === advertising_node || info.data.identity_pubkey === connecting_node) {
        // this channel has to do with the user, lets fetch a new channel list for them
        // TODO: full fetch is probably not necessary
        dispatch(fetchChannels())

        // Construct the notification
        const otherParty = info.data.identity_pubkey === advertising_node ? connecting_node : advertising_node
        let notifBody = `No new friends, just new channels. Your channel with ${otherParty}` // eslint-disable-line
        const notifTitle = 'New channel detected'

        // HTML 5 notification for channel updates involving our node
        showNotification(notifTitle, notifBody)
      }
    }
  }
}

// IPC event for channel graph status
export const channelGraphStatus = (event, data) => () => {
  console.log('channelGraphStatus: ', data)
}

export function toggleFilterPulldown() {
  return {
    type: TOGGLE_CHANNEL_PULLDOWN
  }
}

export function changeFilter(filter) {
  return {
    type: CHANGE_CHANNEL_FILTER,
    filter
  }
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

  [SET_VIEW_TYPE]: (state, { viewType }) => ({ ...state, viewType }),

  [TOGGLE_CHANNEL_PULLDOWN]: state => ({ ...state, filterPulldown: !state.filterPulldown }),
  [CHANGE_CHANNEL_FILTER]: (state, { filter }) => ({ ...state, filterPulldown: false, filter })
}

const channelsSelectors = {}
const channelSelector = state => state.channels.channel
const channelsSelector = state => state.channels.channels
const pendingOpenChannelsSelector = state => state.channels.pendingChannels.pending_open_channels
const pendingClosedChannelsSelector = state => state.channels.pendingChannels.pending_closing_channels
const pendingForceClosedChannelsSelector = state => state.channels.pendingChannels.pending_force_closing_channels
const channelSearchQuerySelector = state => state.channels.searchQuery
const filtersSelector = state => state.channels.filters
const filterSelector = state => state.channels.filter

channelsSelectors.channelModalOpen = createSelector(
  channelSelector,
  channel => (!!channel)
)

channelsSelectors.activeChannels = createSelector(
  channelsSelector,
  openChannels => openChannels.filter(channel => channel.active)
)

channelsSelectors.activeChannelPubkeys = createSelector(
  channelsSelector,
  openChannels => openChannels.filter(channel => channel.active).map(c => c.remote_pubkey)
)

channelsSelectors.nonActiveChannels = createSelector(
  channelsSelector,
  openChannels => openChannels.filter(channel => !channel.active)
)

channelsSelectors.nonActiveChannelPubkeys = createSelector(
  channelsSelector,
  openChannels => openChannels.filter(channel => !channel.active).map(c => c.remote_pubkey)
)

channelsSelectors.pendingOpenChannels = createSelector(
  pendingOpenChannelsSelector,
  pendingOpenChannels => pendingOpenChannels
)

channelsSelectors.pendingOpenChannelPubkeys = createSelector(
  pendingOpenChannelsSelector,
  pendingOpenChannels => pendingOpenChannels.map(pendingChannel => pendingChannel.channel.remote_node_pub)
)

channelsSelectors.closingPendingChannels = createSelector(
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  (pendingClosedChannels, pendingForcedClosedChannels) => [...pendingClosedChannels, ...pendingForcedClosedChannels]
)

channelsSelectors.activeChanIds = createSelector(
  channelsSelector,
  channels => channels.map(channel => channel.chan_id)
)

channelsSelectors.nonActiveFilters = createSelector(
  filtersSelector,
  filterSelector,
  (filters, filter) => filters.filter(f => f.key !== filter.key)
)

const allChannels = createSelector(
  channelsSelectors.activeChannels,
  channelsSelectors.nonActiveChannels,
  pendingOpenChannelsSelector,
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  channelSearchQuerySelector,
  (activeChannels, nonActiveChannels, pendingOpenChannels, pendingClosedChannels, pendingForcedClosedChannels, searchQuery) => {
    const filteredActiveChannels = activeChannels.filter(channel => channel.remote_pubkey.includes(searchQuery) || channel.channel_point.includes(searchQuery)) // eslint-disable-line
    const filteredNonActiveChannels = nonActiveChannels.filter(channel => channel.remote_pubkey.includes(searchQuery) || channel.channel_point.includes(searchQuery)) // eslint-disable-line

    const filteredPendingOpenChannels = pendingOpenChannels.filter(channel => channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)) // eslint-disable-line
    const filteredPendingClosedChannels = pendingClosedChannels.filter(channel => channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)) // eslint-disable-line
    const filteredPendingForcedClosedChannels = pendingForcedClosedChannels.filter(channel => channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)) // eslint-disable-line


    return [...filteredActiveChannels, ...filteredPendingOpenChannels, ...filteredPendingClosedChannels, ...filteredPendingForcedClosedChannels, ...filteredNonActiveChannels]
  }
)

export const currentChannels = createSelector(
  allChannels,
  channelsSelectors.activeChannels,
  channelsSelectors.nonActiveChannels,
  channelsSelector,
  pendingOpenChannelsSelector,
  channelsSelectors.closingPendingChannels,
  filterSelector,
  channelSearchQuerySelector,
  (allChannelsArr, activeChannelsArr, nonActiveChannelsArr, openChannels, pendingOpenChannels, pendingClosedChannels, filter, searchQuery) => {
    // Helper function to deliver correct channel array based on filter
    const filteredArray = (filterKey) => {
      switch (filterKey) {
        case 'ALL_CHANNELS':
          return allChannelsArr
        case 'ACTIVE_CHANNELS':
          return activeChannelsArr
        case 'NON_ACTIVE_CHANNELS':
          return nonActiveChannelsArr
        case 'OPEN_CHANNELS':
          return openChannels
        case 'OPEN_PENDING_CHANNELS':
          return pendingOpenChannels
        case 'CLOSING_PENDING_CHANNELS':
          return pendingClosedChannels
        default:
          return []
      }
    }

    const channelArray = filteredArray(filter.key)

    return channelArray.filter(channel => (Object.prototype.hasOwnProperty.call(channel, 'channel') ?
      channel.channel.remote_node_pub.includes(searchQuery) || channel.channel.channel_point.includes(searchQuery)
      :
      channel.remote_pubkey.includes(searchQuery) || channel.channel_point.includes(searchQuery)))
  }
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
  viewType: 0,

  filterPulldown: false,
  filter: { key: 'ALL_CHANNELS', name: 'All Contacts' },
  filters: [
    { key: 'ALL_CHANNELS', name: 'All Contacts' },
    { key: 'ACTIVE_CHANNELS', name: 'Online Contacts' },
    { key: 'NON_ACTIVE_CHANNELS', name: 'Offline Contacts' },
    { key: 'OPEN_PENDING_CHANNELS', name: 'Pending Contacts' },
    { key: 'CLOSING_PENDING_CHANNELS', name: 'Closing Contacts' }
  ]
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
