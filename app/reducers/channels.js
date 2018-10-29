import { createSelector } from 'reselect'
import { ipcRenderer } from 'electron'
import { btc } from 'lib/utils'
import { showNotification } from 'lib/utils/notifications'
import { requestSuggestedNodes } from 'lib/utils/api'
import db from 'store/db'
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

export const ADD_LOADING_PUBKEY = 'ADD_LOADING_PUBKEY'
export const REMOVE_LOADING_PUBKEY = 'REMOVE_LOADING_PUBKEY'

export const ADD_ClOSING_CHAN_ID = 'ADD_ClOSING_CHAN_ID'
export const REMOVE_ClOSING_CHAN_ID = 'REMOVE_ClOSING_CHAN_ID'

export const SET_SELECTED_CHANNEL = 'SET_SELECTED_CHANNEL'

export const GET_SUGGESTED_NODES = 'GET_SUGGESTED_NODES'
export const RECEIVE_SUGGESTED_NODES_ERROR = 'RECEIVE_SUGGESTED_NODES_ERROR'
export const RECEIVE_SUGGESTED_NODES = 'RECEIVE_SUGGESTED_NODES'

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

export function addLoadingPubkey(pubkey) {
  return {
    type: ADD_LOADING_PUBKEY,
    pubkey
  }
}

export function removeLoadingPubkey(pubkey) {
  return {
    type: REMOVE_LOADING_PUBKEY,
    pubkey
  }
}

export function addClosingChanId(chanId) {
  return {
    type: ADD_ClOSING_CHAN_ID,
    chanId
  }
}

export function removeClosingChanId(chanId) {
  return {
    type: REMOVE_ClOSING_CHAN_ID,
    chanId
  }
}

export function setSelectedChannel(selectedChannel) {
  return {
    type: SET_SELECTED_CHANNEL,
    selectedChannel
  }
}

export function getSuggestedNodes() {
  return {
    type: GET_SUGGESTED_NODES
  }
}

export function receiveSuggestedNodesError() {
  return {
    type: RECEIVE_SUGGESTED_NODES_ERROR
  }
}

export function receiveSuggestedNodes(suggestedNodes) {
  return {
    type: RECEIVE_SUGGESTED_NODES,
    suggestedNodes
  }
}

export const fetchSuggestedNodes = () => async dispatch => {
  dispatch(getSuggestedNodes())
  try {
    const suggestedNodes = await requestSuggestedNodes()
    dispatch(receiveSuggestedNodes(suggestedNodes))
  } catch (e) {
    dispatch(receiveSuggestedNodesError())
  }
}

// Send IPC event for peers
export const fetchChannels = () => async dispatch => {
  dispatch(getChannels())
  ipcRenderer.send('lnd', { msg: 'channels' })
}

// Receive IPC event for channels
export const receiveChannels = (event, { channels, pendingChannels }) => dispatch =>
  dispatch({ type: RECEIVE_CHANNELS, channels, pendingChannels })

// Send IPC event for opening a channel
export const openChannel = ({ pubkey, host, local_amt }) => async (dispatch, getState) => {
  const state = getState()
  const localamt = btc.convert(state.ticker.currency, 'sats', local_amt)

  dispatch(openingChannel())
  dispatch(addLoadingPubkey(pubkey))

  // Grab the activeWallet type from our local store. If the active connection type is local (light clients using
  // neutrino) we will flag manually created channels as private. Other connections like remote node and BTCPay Server
  // we will announce to the network as these users are using Zap to drive nodes that are online 24/7
  const activeWallet = await db.settings.get({ key: 'activeWallet' })
  const wallet = (await db.wallets.get({ id: activeWallet.value })) || {}

  ipcRenderer.send('lnd', {
    msg: 'connectAndOpen',
    data: { pubkey, host, localamt, private: wallet.type === 'local' }
  })
}

// TODO: Decide how to handle streamed updates for channels
// Receive IPC event for openChannel
export const channelSuccessful = () => dispatch => {
  dispatch(fetchChannels())
}

// Receive IPC event for updated channel
export const pushchannelupdated = (event, { pubkey }) => dispatch => {
  dispatch(fetchChannels())
  dispatch(removeLoadingPubkey(pubkey))
}

// Receive IPC event for channel end
// eslint-disable-next-line no-unused-vars
export const pushchannelend = event => dispatch => {
  dispatch(fetchChannels())
}

// Receive IPC event for channel error
export const pushchannelerror = (event, { pubkey, error }) => dispatch => {
  dispatch(openingFailure())
  dispatch(setError(error))
  dispatch(removeLoadingPubkey(pubkey))
}

// Receive IPC event for channel status
// eslint-disable-next-line no-unused-vars
export const pushchannelstatus = (event, data) => dispatch => {
  dispatch(fetchChannels())
}

// Send IPC event for opening a channel
export const closeChannel = ({ channel_point, chan_id, force }) => dispatch => {
  dispatch(closingChannel())
  dispatch(addClosingChanId(chan_id))

  const [funding_txid, output_index] = channel_point.split(':')
  ipcRenderer.send('lnd', {
    msg: 'closeChannel',
    data: {
      channel_point: {
        funding_txid,
        output_index
      },
      force
    }
  })
}

// TODO: Decide how to handle streamed updates for closing channels
// Receive IPC event for closeChannel
export const closeChannelSuccessful = () => dispatch => {
  dispatch(fetchChannels())
}

// Receive IPC event for updated closing channel
export const pushclosechannelupdated = (event, { chan_id }) => dispatch => {
  dispatch(fetchChannels())
  dispatch(removeClosingChanId(chan_id))
}

// Receive IPC event for closing channel end
export const pushclosechannelend = () => dispatch => {
  dispatch(fetchChannels())
}

// Receive IPC event for closing channel error
export const pushclosechannelerror = (event, { error, chan_id }) => dispatch => {
  dispatch(setError(error))
  dispatch(removeClosingChanId(chan_id))
}

// Receive IPC event for closing channel status
export const pushclosechannelstatus = () => dispatch => {
  dispatch(fetchChannels())
}

// IPC event for channel graph data
export const channelGraphData = (event, data) => (dispatch, getState) => {
  const { info } = getState()
  const {
    channelGraphData: { channel_updates }
  } = data

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
      if (
        info.data.identity_pubkey === advertising_node ||
        info.data.identity_pubkey === connecting_node
      ) {
        // this channel has to do with the user, lets fetch a new channel list for them
        // TODO: full fetch is probably not necessary
        dispatch(fetchChannels())

        // Construct the notification
        const otherParty =
          info.data.identity_pubkey === advertising_node ? connecting_node : advertising_node
        const notifBody = `No new friends, just new channels. Your channel with ${otherParty}`
        const notifTitle = 'New channel detected'

        // HTML 5 notification for channel updates involving our node
        showNotification(notifTitle, notifBody)
      }
    }
  }
}

// IPC event for channel graph status
export const channelGraphStatus = () => () => {}

export function toggleFilterPulldown() {
  return {
    type: TOGGLE_CHANNEL_PULLDOWN
  }
}

export function changeFilter(channelFilter) {
  return {
    type: CHANGE_CHANNEL_FILTER,
    channelFilter
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CHANNEL_FORM]: (state, { form }) => ({
    ...state,
    channelForm: Object.assign({}, state.channelForm, form)
  }),

  [SET_CHANNEL]: (state, { channel }) => ({ ...state, channel }),

  [GET_CHANNELS]: state => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels, pendingChannels }) => ({
    ...state,
    channelsLoading: false,
    channels,
    pendingChannels
  }),

  [OPENING_CHANNEL]: state => ({ ...state, openingChannel: true }),
  [OPENING_FAILURE]: state => ({ ...state, openingChannel: false }),

  [CLOSING_CHANNEL]: state => ({ ...state, closingChannel: true }),

  [UPDATE_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [SET_VIEW_TYPE]: (state, { viewType }) => ({ ...state, viewType }),

  [TOGGLE_CHANNEL_PULLDOWN]: state => ({ ...state, filterPulldown: !state.filterPulldown }),
  [CHANGE_CHANNEL_FILTER]: (state, { channelFilter }) => ({
    ...state,
    filterPulldown: false,
    filter: channelFilter
  }),

  [ADD_LOADING_PUBKEY]: (state, { pubkey }) => ({
    ...state,
    loadingChannelPubkeys: [pubkey, ...state.loadingChannelPubkeys]
  }),
  [REMOVE_LOADING_PUBKEY]: (state, { pubkey }) => ({
    ...state,
    loadingChannelPubkeys: state.loadingChannelPubkeys.filter(
      loadingPubkey => loadingPubkey !== pubkey
    )
  }),

  [ADD_ClOSING_CHAN_ID]: (state, { chanId }) => ({
    ...state,
    closingChannelIds: [chanId, ...state.closingChannelIds]
  }),
  [REMOVE_ClOSING_CHAN_ID]: (state, { chanId }) => ({
    ...state,
    closingChannelIds: state.closingChannelIds.filter(closingChanId => closingChanId !== chanId)
  }),

  [SET_SELECTED_CHANNEL]: (state, { selectedChannel }) => ({ ...state, selectedChannel }),

  [GET_SUGGESTED_NODES]: state => ({ ...state, suggestedNodesLoading: true }),
  [RECEIVE_SUGGESTED_NODES]: (state, { suggestedNodes }) => ({
    ...state,
    suggestedNodesLoading: false,
    suggestedNodes
  }),
  [RECEIVE_SUGGESTED_NODES_ERROR]: state => ({
    ...state,
    suggestedNodesLoading: false,
    suggestedNodes: {
      mainnet: [],
      testnet: []
    }
  })
}

const channelsSelectors = {}
const channelSelector = state => state.channels.channel
const channelsSelector = state => state.channels.channels
const pendingOpenChannelsSelector = state => state.channels.pendingChannels.pending_open_channels
const pendingClosedChannelsSelector = state =>
  state.channels.pendingChannels.pending_closing_channels
const pendingWaitingCloseChannelsSelector = state =>
  state.channels.pendingChannels.waiting_close_channels
const pendingForceClosedChannelsSelector = state =>
  state.channels.pendingChannels.pending_force_closing_channels
const waitingCloseChannelsSelector = state => state.channels.pendingChannels.waiting_close_channels
const channelSearchQuerySelector = state => state.channels.searchQuery
const filtersSelector = state => state.channels.filters
const filterSelector = state => state.channels.filter
const nodesSelector = state => state.network.nodes

const channelMatchesQuery = (channel, nodes, searchQuery) => {
  const node = nodes.find(n => channel.remote_pubkey === n.pub_key)
  const query = searchQuery.toLowerCase()

  const remoteNodePub = (channel.remote_node_pub || '').toLowerCase()
  const remotePubkey = (channel.remote_pubkey || '').toLowerCase()
  const displayName = (node ? node.alias : '' || '').toLowerCase()

  return (
    remoteNodePub.includes(query) || remotePubkey.includes(query) || displayName.includes(query)
  )
}

channelsSelectors.channelModalOpen = createSelector(channelSelector, channel => !!channel)

channelsSelectors.activeChannels = createSelector(channelsSelector, openChannels =>
  openChannels.filter(channel => channel.active)
)

channelsSelectors.activeChannelPubkeys = createSelector(channelsSelector, openChannels =>
  openChannels.filter(channel => channel.active).map(c => c.remote_pubkey)
)

channelsSelectors.nonActiveChannels = createSelector(channelsSelector, openChannels =>
  openChannels.filter(channel => !channel.active)
)

channelsSelectors.nonActiveChannelPubkeys = createSelector(channelsSelector, openChannels =>
  openChannels.filter(channel => !channel.active).map(c => c.remote_pubkey)
)

channelsSelectors.pendingOpenChannels = pendingOpenChannelsSelector

channelsSelectors.pendingOpenChannelPubkeys = createSelector(
  pendingOpenChannelsSelector,
  pendingOpenChannels =>
    pendingOpenChannels.map(pendingChannel => pendingChannel.channel.remote_node_pub)
)

channelsSelectors.closingPendingChannels = createSelector(
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  pendingWaitingCloseChannelsSelector,
  (pendingClosedChannels, pendingForcedClosedChannels, pendingWaitingCloseChannels) => [
    ...pendingClosedChannels,
    ...pendingForcedClosedChannels,
    ...pendingWaitingCloseChannels
  ]
)

channelsSelectors.activeChanIds = createSelector(channelsSelector, channels =>
  channels.map(channel => channel.chan_id)
)

channelsSelectors.nonActiveFilters = createSelector(
  filtersSelector,
  filterSelector,
  (filters, channelFilter) => filters.filter(f => f.key !== channelFilter.key)
)

channelsSelectors.channelNodes = createSelector(
  channelsSelector,
  nodesSelector,
  (channels, nodes) => {
    const chanPubkeys = channels.map(channel => channel.remote_pubkey)

    return nodes.filter(node => chanPubkeys.includes(node.pub_key))
  }
)

const allChannels = createSelector(
  channelsSelectors.activeChannels,
  channelsSelectors.nonActiveChannels,
  pendingOpenChannelsSelector,
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  waitingCloseChannelsSelector,
  channelSearchQuerySelector,
  nodesSelector,
  (
    activeChannels,
    nonActiveChannels,
    pendingOpenChannels,
    pendingClosedChannels,
    pendingForcedClosedChannels,
    waitingCloseChannels,
    searchQuery,
    nodes
  ) => {
    const filterChannel = channel =>
      channelMatchesQuery(channel.channel || channel, nodes, searchQuery)

    const filteredActiveChannels = activeChannels.filter(filterChannel)
    const filteredNonActiveChannels = nonActiveChannels.filter(filterChannel)

    const filterPendingChannel = channel =>
      channelMatchesQuery(channel.channel || channel, nodes, searchQuery)

    const filteredPendingOpenChannels = pendingOpenChannels.filter(filterPendingChannel)
    const filteredPendingClosedChannels = pendingClosedChannels.filter(filterPendingChannel)
    const filteredPendingForcedClosedChannels = pendingForcedClosedChannels.filter(
      filterPendingChannel
    )
    const filteredWaitingCloseChannels = waitingCloseChannels.filter(filterPendingChannel)

    return [
      ...filteredActiveChannels,
      ...filteredPendingOpenChannels,
      ...filteredPendingClosedChannels,
      ...filteredPendingForcedClosedChannels,
      ...filteredNonActiveChannels,
      ...filteredWaitingCloseChannels
    ]
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
  nodesSelector,
  (
    allChannelsArr,
    activeChannelsArr,
    nonActiveChannelsArr,
    openChannels,
    pendingOpenChannels,
    pendingClosedChannels,
    channelFilter,
    searchQuery,
    nodes
  ) => {
    // Helper function to deliver correct channel array based on filter
    const filteredArray = filterKey => {
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

    const channelArray = filteredArray(channelFilter.key)
    return channelArray.filter(channel =>
      channelMatchesQuery(channel.channel || channel, nodes, searchQuery)
    )
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
    pending_force_closing_channels: [],
    waiting_close_channels: []
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
  filter: { key: 'ALL_CHANNELS', name: 'All' },
  filters: [
    { key: 'ALL_CHANNELS', name: 'All' },
    { key: 'ACTIVE_CHANNELS', name: 'Online' },
    { key: 'NON_ACTIVE_CHANNELS', name: 'Offline' },
    { key: 'OPEN_PENDING_CHANNELS', name: 'Pending' },
    { key: 'CLOSING_PENDING_CHANNELS', name: 'Closing' }
  ],

  loadingChannelPubkeys: [],
  closingChannelIds: [],

  selectedChannel: null,

  // nodes stored at zap.jackmallers.com/suggested-peers manages by JimmyMow
  // we store this node list here and if the user doesnt have any channels
  // we show them this list in case they wanna use our suggestions to connect
  // to the network and get started
  // **** Example ****
  // {
  //   pubkey: "02212d3ec887188b284dbb7b2e6eb40629a6e14fb049673f22d2a0aa05f902090e",
  //   host: "testnet-lnd.yalls.org",
  //   nickname: "Yalls",
  //   description: "Top up prepaid mobile phones with bitcoin and altcoins in USA and around the world"
  // }
  // ****
  suggestedNodes: {
    mainnet: [],
    testnet: []
  },
  suggestedNodesLoading: false
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
