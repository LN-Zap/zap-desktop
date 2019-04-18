import { createSelector } from 'reselect'
import throttle from 'lodash.throttle'
import { proxyValue } from 'comlinkjs'
import { requestSuggestedNodes } from '@zap/utils/api'
import { lightningService } from 'workers'
import { updateNotification, showWarning, showError } from './notification'
import { fetchBalance } from './balance'
import { walletSelectors } from './wallet'
import { getNodeDisplayName, truncateNodePubkey, updateNodeData } from './network'
import { putSetting } from './settings'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_CHANNEL_VIEW_MODE = 'SET_CHANNEL_VIEW_MODE'
export const SET_SELECTED_CHANNEL = 'SET_SELECTED_CHANNEL'

export const CHANGE_CHANNEL_FILTER = 'CHANGE_CHANNEL_FILTER'

export const CHANGE_CHANNEL_SORT = 'CHANGE_CHANNEL_SORT'

export const UPDATE_SEARCH_QUERY = 'UPDATE_SEARCH_QUERY'

export const GET_CHANNELS = 'GET_CHANNELS'
export const RECEIVE_CHANNELS = 'RECEIVE_CHANNELS'

export const OPENING_SUCCESSFUL = 'OPENING_SUCCESSFUL'

export const CLOSING_CHANNEL = 'CLOSING_CHANNEL'
export const CLOSING_SUCCESSFUL = 'CLOSING_SUCCESSFUL'
export const CLOSING_FAILURE = 'CLOSING_FAILURE'

export const ADD_LOADING_PUBKEY = 'ADD_LOADING_PUBKEY'
export const REMOVE_LOADING_PUBKEY = 'REMOVE_LOADING_PUBKEY'

export const ADD_ClOSING_CHAN_ID = 'ADD_ClOSING_CHAN_ID'
export const REMOVE_ClOSING_CHAN_ID = 'REMOVE_ClOSING_CHAN_ID'

export const GET_SUGGESTED_NODES = 'GET_SUGGESTED_NODES'
export const RECEIVE_SUGGESTED_NODES_ERROR = 'RECEIVE_SUGGESTED_NODES_ERROR'
export const RECEIVE_SUGGESTED_NODES = 'RECEIVE_SUGGESTED_NODES'

export const OPEN_CLOSE_CHANNEL_DIALOG = 'OPEN_CLOSE_CHANNEL_DIALOG'
export const CLOSE_CLOSE_CHANNEL_DIALOG = 'CLOSE_CLOSE_CHANNEL_DIALOG'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * Get the channel data from aq channel object.
 * If this is a pending channel, the channel data will be stored under the `channel` key.
 * @param  {Object} channelObj Channel object
 * @return {Object} Channel data
 */
export const getChannelData = channelObj => channelObj.channel || channelObj

/**
 * Get a name to display for the channel.
 *
 * This will either be:
 *  - the alias of the node at the other end of the channel
 *  - a shortened public key.
 * @param  {Object} channel Channel object.
 * @param  {Array} nodes Array of nodes.
 * @return {String} Channel display name.
 */
const getDisplayName = (channel, nodes) => {
  const remoteNodePubkey = getRemoteNodePubKey(channel)
  const node = nodes.find(n => n.pub_key === remoteNodePubkey)

  return node ? getNodeDisplayName(node) : truncateNodePubkey(remoteNodePubkey)
}

/**
 * Get the remote pubkey depending on what type of channel.
 *
 * due to inconsistent API vals the remote nodes pubkey will be under remote_pubkey for active channels and
 * remote_node_pub for pending channels.
 * we have
 * @param  {[type]} channel [description]
 * @return {[type]}         [description]
 */
const getRemoteNodePubKey = channel => {
  return channel.node_pubkey || channel.remote_pubkey || channel.remote_node_pub
}

/**
 * Determine the status of a channel.
 * @param  {Object} channel Channel object.
 * @param  {Array} closingChannelIds List of channel ids that we are in the process of closing.
 * @return {String} Channel status name.
 */
const getStatus = (channelObj, closingChannelIds = [], loadingChannelPubKeys = []) => {
  const channelData = getChannelData(channelObj)
  const pubKey = getRemoteNodePubKey(channelData)

  // if the channel pubkey is in loadingChabnnels, set status as loading.
  if (loadingChannelPubKeys.includes(pubKey) && !channelData.channel_point) {
    return 'loading'
  }
  // if the channel has a confirmation_height property that means it's pending.
  if ('confirmation_height' in channelObj) {
    return 'pending_open'
  }
  // if the channel has a closing txid and a limbo balance, that means it's force_closing.
  if ('closing_txid' in channelObj && 'limbo_balance' in channelObj) {
    return 'pending_force_close'
  }
  // if the channel has a closing txid but no limbo balance or it's in our internal list of closing transactions,
  // that means it is pending closing.
  if (
    ('closing_txid' in channelObj && !('limbo_balance' in channelObj)) ||
    closingChannelIds.includes(channelObj.chan_id)
  ) {
    return 'pending_close'
  }
  // If the channel has a limbo balance but no closing txid, it is waiting to close.
  if (!('closing_txid' in channelObj) && 'limbo_balance' in channelObj) {
    return 'waiting_close'
  }
  // if the channel isn't active that means the remote peer isn't online.
  if (!channelObj.active) {
    return 'offline'
  }
  // if all of the above conditionals fail we must have an open/active/online channel.
  return 'open'
}

/**
 * Decorate a channel object with additional calculated properties.
 * @param  {Object} channelObj Channel object.
 * @param  {Array} nodes Array of node data.
 * @param  {Array} closingChannelIds List of channel ids that we are in the process of closing.
 * @return {Object} Decorated channel object.
 */
const decorateChannel = (channelObj, nodes, closingChannelIds, loadingChannels) => {
  // If this is a pending channel, the channel data will be stored under the `channel` key.
  const channelData = getChannelData(channelObj)
  const status = getStatus(channelObj, closingChannelIds, loadingChannels)

  const updatedChannelData = {
    ...channelData,
    display_pubkey: getRemoteNodePubKey(channelData),
    display_name: getDisplayName(channelData, nodes),
    display_status: status,
    can_close:
      ['open', 'offline'].includes(status) && !closingChannelIds.includes(channelData.chan_id),
  }

  if (channelObj.closing_txid) {
    updatedChannelData.closing_txid = channelObj.closing_txid
  }

  if (channelObj.channel) {
    return {
      ...channelObj,
      channel: updatedChannelData,
    }
  }
  return updatedChannelData
}

// ------------------------------------
// Actions
// ------------------------------------

export const initChannels = () => async (dispatch, getState) => {
  const state = getState()
  const userViewMode = state.settings.channelViewMode
  const channelViewMode = state.channels.viewMode
  if (userViewMode && userViewMode !== channelViewMode) {
    dispatch(setChannelViewMode(userViewMode))
  }
}

export const setChannelViewMode = viewMode => dispatch => {
  dispatch({
    type: SET_CHANNEL_VIEW_MODE,
    viewMode,
  })
  dispatch(putSetting('channelViewMode', viewMode))
}

export function changeFilter(filter) {
  return {
    type: CHANGE_CHANNEL_FILTER,
    filter,
  }
}
export function changeSort(sort) {
  return {
    type: CHANGE_CHANNEL_SORT,
    sort,
  }
}

export function getChannels() {
  return {
    type: GET_CHANNELS,
  }
}

export function closingChannel() {
  return {
    type: CLOSING_CHANNEL,
  }
}

export function updateChannelSearchQuery(searchQuery) {
  return {
    type: UPDATE_SEARCH_QUERY,
    searchQuery,
  }
}

export function addLoadingChannel(data) {
  return {
    type: ADD_LOADING_PUBKEY,
    data,
  }
}

export function removeLoadingChannel(pubkey) {
  return {
    type: REMOVE_LOADING_PUBKEY,
    pubkey,
  }
}

export function addClosingChanId(chanId) {
  return {
    type: ADD_ClOSING_CHAN_ID,
    chanId,
  }
}

export function removeClosingChanId(chanId) {
  return {
    type: REMOVE_ClOSING_CHAN_ID,
    chanId,
  }
}

export function setSelectedChannel(selectedChannelId) {
  return {
    type: SET_SELECTED_CHANNEL,
    selectedChannelId,
  }
}

export function getSuggestedNodes() {
  return {
    type: GET_SUGGESTED_NODES,
  }
}

export function receiveSuggestedNodesError() {
  return {
    type: RECEIVE_SUGGESTED_NODES_ERROR,
  }
}

export function receiveSuggestedNodes(suggestedNodes) {
  return {
    type: RECEIVE_SUGGESTED_NODES,
    suggestedNodes,
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
  const lightning = await lightningService
  const channels = await lightning.getChannels()
  dispatch(receiveChannels(channels))
}

// Receive IPC event for channels
export const receiveChannels = ({ channels, pendingChannels, closedChannels }) => dispatch => {
  dispatch({ type: RECEIVE_CHANNELS, channels, pendingChannels, closedChannels })
  dispatch(fetchBalance())
}

// Send IPC event for opening a channel
export const openChannel = data => async (dispatch, getState) => {
  const { pubkey, host, localamt, satPerByte, isPrivate, spendUnconfirmed = true } = data

  // Grab the activeWallet type from our local store. If the active connection type is local (light clients using
  // neutrino) we will flag manually created channels as private. Other connections like remote node and BTCPay Server
  // we will announce to the network as these users are using Zap to drive nodes that are online 24/7
  const state = getState()
  const activeWalletSettings = walletSelectors.activeWalletSettings(state)
  const channelIsPrivate = isPrivate || activeWalletSettings.type === 'local'

  // Add channel loading state.
  const loadingChannel = {
    node_pubkey: pubkey,
    local_balance: Number(localamt),
    remote_balance: 0,
    private: channelIsPrivate,
    sat_per_byte: satPerByte,
  }
  dispatch(addLoadingChannel(loadingChannel))

  // Show notification.
  dispatch(showWarning('Channel opening initiated', { payload: { pubkey }, isProcessing: true }))

  // Attempt to open the channel.
  const lightning = await lightningService
  try {
    const data = await lightning.connectAndOpen({
      pubkey,
      host,
      localamt,
      private: channelIsPrivate,
      satPerByte,
      spendUnconfirmed,
    })
    dispatch(pushchannelupdated(data))
    lightning.once('openChannel.data', proxyValue(data => dispatch(pushchannelupdated(data))))
  } catch (e) {
    dispatch(
      pushchannelerror({
        error: e.message,
        node_pubkey: e.payload.node_pubkey,
      })
    )
  }
}

// Receive IPC event for updated channel
export const pushchannelupdated = ({ node_pubkey, data }) => dispatch => {
  dispatch(fetchChannels())
  if (data.update === 'chan_pending') {
    dispatch(removeLoadingChannel(node_pubkey))
    dispatch(
      updateNotification(
        { payload: { pubkey: node_pubkey } },
        {
          variant: 'success',
          message: 'Channel successfully created',
          isProcessing: false,
        }
      )
    )
  }
}

// Receive IPC event for channel error
export const pushchannelerror = ({ node_pubkey, error }) => dispatch => {
  dispatch(removeLoadingChannel(node_pubkey))
  dispatch(
    updateNotification(
      { payload: { pubkey: node_pubkey } },
      {
        variant: 'error',
        message: `Unable to open channel: ${error}`,
        isProcessing: false,
      }
    )
  )
}

export const showCloseChannelDialog = () => ({ type: OPEN_CLOSE_CHANNEL_DIALOG })
export const hideCloseChannelDialog = () => ({ type: CLOSE_CLOSE_CHANNEL_DIALOG })

// Send IPC event for closing a channel
export const closeChannel = () => async (dispatch, getState) => {
  const selectedChannel = channelsSelectors.selectedChannel(getState())

  if (selectedChannel) {
    const { channel_point, chan_id, active } = selectedChannel
    dispatch(closingChannel())
    dispatch(addClosingChanId(chan_id))

    const [funding_txid, output_index] = channel_point.split(':')

    // Attempt to open the channel.
    const lightning = await lightningService
    try {
      const data = await lightning.closeChannel({
        channel_point: {
          funding_txid,
          output_index,
        },
        chan_id,
        force: !active,
      })
      dispatch(pushclosechannelupdated(data))
      lightning.once(
        'closeChannel.data',
        proxyValue(data => dispatch(pushclosechannelupdated(data)))
      )
    } catch (e) {
      dispatch(
        pushchannelerror({
          error: e.message,
          node_pubkey: e.payload.node_pubkey,
        })
      )
    }
  }
}

// Receive IPC event for updated closing channel
export const pushclosechannelupdated = ({ chan_id }) => dispatch => {
  dispatch(fetchChannels())
  dispatch(removeClosingChanId(chan_id))
}

// Receive IPC event for closing channel error
export const pushclosechannelerror = ({ error, chan_id }) => dispatch => {
  dispatch(showError(error))
  dispatch(removeClosingChanId(chan_id))
}

/**
 * Throttled dispatch to fetchChannels.
 * Calls fetchChannels no more than once per second.
 */
const throttledFetchChannels = throttle(dispatch => dispatch(fetchChannels()), 1000, {
  leading: true,
  trailing: true,
})

// IPC event for channel graph data
export const receiveChannelGraphData = ({ channel_updates, node_updates }) => (
  dispatch,
  getState
) => {
  const { info, channels } = getState()

  // Process node updates.
  if (node_updates.length) {
    dispatch(updateNodeData(node_updates))
  }

  // if there are any new channel updates
  let hasUpdates = false
  if (channel_updates.length) {
    // loop through the channel updates
    for (let i = 0; i < channel_updates.length; i += 1) {
      const channel_update = channel_updates[i]
      const { advertising_node, connecting_node } = channel_update

      // Determine wether this update affected our node or any of our channels.
      if (
        info.data.identity_pubkey === advertising_node ||
        info.data.identity_pubkey === connecting_node ||
        channels.channels.find(channel => {
          return [advertising_node, connecting_node].includes(channel.remote_pubkey)
        })
      ) {
        hasUpdates = true
      }
    }
  }

  // if our node or any of our channels were involved in this update, fetch an updated channel list.
  if (hasUpdates) {
    // We can receive a lot of channel updates from channel graph subscription in a short space of time. If these
    // involve our our channels we make a call to fetchChannels and then fetchBalances in order to refresh our channel
    // and balance data. Throttle these calls so that we don't attempt to fetch channels to often.
    throttledFetchChannels(dispatch)
  }
}

// IPC event for channel graph status
export const channelGraphStatus = () => () => {}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CHANNEL_VIEW_MODE]: (state, { viewMode }) => ({ ...state, viewMode }),
  [GET_CHANNELS]: state => ({ ...state, channelsLoading: true }),
  [RECEIVE_CHANNELS]: (state, { channels, pendingChannels, closedChannels }) => ({
    ...state,
    channelsLoading: false,
    channels,
    pendingChannels,
    closedChannels,
  }),

  [CLOSING_CHANNEL]: state => ({ ...state, closingChannel: true }),

  [UPDATE_SEARCH_QUERY]: (state, { searchQuery }) => ({ ...state, searchQuery }),

  [CHANGE_CHANNEL_FILTER]: (state, { filter }) => ({
    ...state,
    filter,
  }),

  [CHANGE_CHANNEL_SORT]: (state, { sort }) => ({
    ...state,
    sort,
  }),

  [ADD_LOADING_PUBKEY]: (state, { data }) => ({
    ...state,
    loadingChannels: [data, ...state.loadingChannels],
  }),
  [REMOVE_LOADING_PUBKEY]: (state, { pubkey }) => ({
    ...state,
    loadingChannels: state.loadingChannels.filter(data => data.node_pubkey !== pubkey),
  }),

  [ADD_ClOSING_CHAN_ID]: (state, { chanId }) => ({
    ...state,
    closingChannelIds: [chanId, ...state.closingChannelIds],
  }),
  [REMOVE_ClOSING_CHAN_ID]: (state, { chanId }) => ({
    ...state,
    closingChannelIds: state.closingChannelIds.filter(closingChanId => closingChanId !== chanId),
  }),

  [SET_SELECTED_CHANNEL]: (state, { selectedChannelId }) => ({ ...state, selectedChannelId }),

  [GET_SUGGESTED_NODES]: state => ({ ...state, suggestedNodesLoading: true }),
  [RECEIVE_SUGGESTED_NODES]: (state, { suggestedNodes }) => ({
    ...state,
    suggestedNodesLoading: false,
    suggestedNodes,
  }),
  [RECEIVE_SUGGESTED_NODES_ERROR]: state => ({
    ...state,
    suggestedNodesLoading: false,
    suggestedNodes: {
      mainnet: [],
      testnet: [],
    },
  }),
  [OPEN_CLOSE_CHANNEL_DIALOG]: state => ({
    ...state,
    isCloseDialogOpen: true,
  }),
  [CLOSE_CLOSE_CHANNEL_DIALOG]: state => ({
    ...state,
    isCloseDialogOpen: false,
  }),
}

const channelsSelectors = {}
const channelsSelector = state => state.channels.channels
const closedChannelsSelector = state => state.channels.closedChannels
const loadingChannelsSelector = state => state.channels.loadingChannels
const selectedChannelIdSelector = state => state.channels.selectedChannelId
const pendingOpenChannelsSelector = state => state.channels.pendingChannels.pending_open_channels
const pendingClosedChannelsSelector = state =>
  state.channels.pendingChannels.pending_closing_channels
const pendingForceClosedChannelsSelector = state =>
  state.channels.pendingChannels.pending_force_closing_channels
const waitingCloseChannelsSelector = state => state.channels.pendingChannels.waiting_close_channels
const totalLimboBalanceSelector = state => state.channels.pendingChannels.total_limbo_balance
const closingChannelIdsSelector = state => state.channels.closingChannelIds
const channelSearchQuerySelector = state => state.channels.searchQuery
const filterSelector = state => state.channels.filter
const nodesSelector = state => state.network.nodes

const channelMatchesQuery = (channelObj, searchQuery) => {
  if (!searchQuery) {
    return true
  }

  const channel = getChannelData(channelObj)
  const query = searchQuery.toLowerCase()

  const nodePubkey = (channel.node_pubkey || '').toLowerCase()
  const remoteNodePub = (channel.remote_node_pub || '').toLowerCase()
  const remotePubkey = (channel.remote_pubkey || '').toLowerCase()
  const displayName = (channel.display_name || '').toLowerCase()

  return (
    nodePubkey.includes(query) ||
    remoteNodePub.includes(query) ||
    remotePubkey.includes(query) ||
    displayName.includes(query)
  )
}

channelsSelectors.totalLimboBalance = createSelector(
  totalLimboBalanceSelector,
  totalLimboBalance => totalLimboBalance
)

channelsSelectors.loadingChannelPubKeys = createSelector(
  loadingChannelsSelector,
  loadingChannels => loadingChannels.map(loadingChannel => loadingChannel.node_pubkey)
)

channelsSelectors.loadingChannels = createSelector(
  loadingChannelsSelector,
  nodesSelector,
  closingChannelIdsSelector,
  channelsSelectors.loadingChannelPubKeys,
  (loadingChannels, nodes, closingChannelIds, loadingChannelPubKeys) =>
    loadingChannels.map(channel =>
      decorateChannel(channel, nodes, closingChannelIds, loadingChannelPubKeys)
    )
)

channelsSelectors.channelsSelector = createSelector(
  channelsSelector,
  nodesSelector,
  closingChannelIdsSelector,
  channelsSelectors.loadingChannelPubKeys,
  (channels, nodes, closingChannelIds, loadingChannelPubKeys) =>
    channels.map(channel =>
      decorateChannel(channel, nodes, closingChannelIds, loadingChannelPubKeys)
    )
)

channelsSelectors.activeChannels = createSelector(
  channelsSelectors.channelsSelector,
  openChannels => openChannels.filter(channel => channel.active)
)

channelsSelectors.activeChannelPubkeys = createSelector(
  channelsSelectors.activeChannels,
  openChannels => openChannels.map(c => c.remote_pubkey)
)

channelsSelectors.nonActiveChannels = createSelector(
  channelsSelectors.channelsSelector,
  openChannels => openChannels.filter(channel => !channel.active)
)

channelsSelectors.nonActiveChannelPubkeys = createSelector(
  channelsSelectors.nonActiveChannels,
  openChannels => openChannels.map(c => c.remote_pubkey)
)

channelsSelectors.pendingOpenChannelsRaw = createSelector(
  pendingOpenChannelsSelector,
  pendingOpenChannels => pendingOpenChannels
)

channelsSelectors.pendingOpenChannels = createSelector(
  channelsSelectors.pendingOpenChannelsRaw,
  nodesSelector,
  closingChannelIdsSelector,
  channelsSelectors.loadingChannelPubKeys,
  (pendingOpenChannels, nodes, closingChannelIds, loadingChannelPubKeys) =>
    pendingOpenChannels
      .map(channelObj =>
        decorateChannel(channelObj, nodes, closingChannelIds, loadingChannelPubKeys)
      )
      // Filter out channels from the loadingChannels array to prevent duplicates which can happen because the channel
      // actualy moves into the pending channels array before we get an update from the openChannel stream to say that
      // it is now in the pending state.
      .filter(channel => {
        const channelData = getChannelData(channel)
        return !loadingChannelPubKeys.includes(channelData.display_pubkey)
      })
)

channelsSelectors.pendingOpenChannelPubkeys = createSelector(
  channelsSelectors.pendingOpenChannels,
  pendingOpenChannels =>
    pendingOpenChannels.map(pendingChannel => pendingChannel.channel.remote_node_pub)
)

channelsSelectors.closingPendingChannelsRaw = createSelector(
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  waitingCloseChannelsSelector,
  (pendingClosedChannels, pendingForcedClosedChannels, waitingCloseChannels) => [
    ...pendingClosedChannels,
    ...pendingForcedClosedChannels,
    ...waitingCloseChannels,
  ]
)

channelsSelectors.closingPendingChannels = createSelector(
  channelsSelectors.closingPendingChannelsRaw,
  nodesSelector,
  closingChannelIdsSelector,
  channelsSelectors.loadingChannelPubKeys,
  (closingPendingChannels, nodes, closingChannelIds, loadingChannelPubKeys) =>
    closingPendingChannels.map(channelObj =>
      decorateChannel(channelObj, nodes, closingChannelIds, loadingChannelPubKeys)
    )
)

channelsSelectors.closingChannelIds = createSelector(
  closingChannelIdsSelector,
  channelsSelectors.closingPendingChannels,
  (closingChannelIds, closingPendingChannels) => [
    ...closingChannelIds,
    ...closingPendingChannels.map(pendingChannel => pendingChannel.channel.chan_id),
  ]
)

channelsSelectors.closedChannels = createSelector(
  closedChannelsSelector,
  nodesSelector,
  (closedChannels, nodes) => closedChannels.map(channelObj => decorateChannel(channelObj, nodes))
)

channelsSelectors.allChannels = createSelector(
  channelsSelectors.loadingChannels,
  channelsSelectors.activeChannels,
  channelsSelectors.pendingOpenChannels,
  channelsSelectors.closingPendingChannels,
  channelsSelectors.nonActiveChannels,
  (
    loadingChannels,
    activeChannels,
    pendingOpenChannels,
    closingPendingChannels,
    nonActiveChannels
  ) => {
    return [
      ...loadingChannels,
      ...activeChannels,
      ...pendingOpenChannels,
      ...closingPendingChannels,
      ...nonActiveChannels,
    ]
  }
)

channelsSelectors.allChannelsCount = createSelector(
  channelsSelectors.allChannels,
  allChannels => allChannels.length
)

channelsSelectors.allChannelsRaw = createSelector(
  loadingChannelsSelector,
  channelsSelector,
  closedChannelsSelector,
  pendingOpenChannelsSelector,
  pendingClosedChannelsSelector,
  pendingForceClosedChannelsSelector,
  waitingCloseChannelsSelector,
  (
    loadingChannels,
    channels,
    closedChannels,
    pendingOpenChannels,
    pendingClosedChannels,
    pendingForceClosedChannels,
    waitingCloseChannels
  ) => {
    return [
      ...loadingChannels,
      ...channels,
      ...closedChannels,
      ...pendingOpenChannels,
      ...pendingClosedChannels,
      ...pendingForceClosedChannels,
      ...waitingCloseChannels,
    ]
  }
)

channelsSelectors.currentChannels = createSelector(
  channelsSelectors.allChannels,
  channelsSelectors.activeChannels,
  channelsSelectors.channelsSelector,
  channelsSelectors.pendingOpenChannels,
  channelsSelectors.closingPendingChannels,
  channelsSelectors.nonActiveChannels,
  filterSelector,
  channelSearchQuerySelector,
  (
    allChannelsArr,
    activeChannelsArr,
    openChannels,
    pendingOpenChannels,
    pendingClosedChannels,
    nonActiveChannelsArr,
    channelFilter,
    searchQuery
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
    const filterChannel = channel => channelMatchesQuery(channel, searchQuery)

    return filteredArray(channelFilter).filter(filterChannel)
  }
)

channelsSelectors.selectedChannel = createSelector(
  selectedChannelIdSelector,
  channelsSelectors.allChannels,
  (selectedChannelId, allChannels) => {
    const channel = allChannels.find(channel => {
      const channelData = getChannelData(channel)
      return channelData.channel_point === selectedChannelId
    })
    return channel && getChannelData(channel)
  }
)

export { channelsSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  channelsLoading: false,
  loadingChannels: [],
  channels: [],
  pendingChannels: {
    total_limbo_balance: null,
    pending_open_channels: [],
    pending_closing_channels: [],
    pending_force_closing_channels: [],
    waiting_close_channels: [],
  },
  closedChannels: [],
  closingChannelIds: [],
  closingChannel: false,
  searchQuery: null,
  viewType: 0,

  filter: 'ALL_CHANNELS',
  filters: [
    { key: 'ALL_CHANNELS', name: 'All' },
    { key: 'ACTIVE_CHANNELS', name: 'Online' },
    { key: 'NON_ACTIVE_CHANNELS', name: 'Offline' },
    { key: 'OPEN_PENDING_CHANNELS', name: 'Pending' },
    { key: 'CLOSING_PENDING_CHANNELS', name: 'Closing' },
  ],

  sort: 'OPEN_DATE',
  sorters: [
    { key: 'OPEN_DATE', name: 'Open date' },
    { key: 'REMOTE_BALANCE', name: 'Remote balance' },
    { key: 'LOCAL_BALANCE', name: 'Local balance' },
    { key: 'ACTIVITY', name: 'Activity' },
    { key: 'NAME', name: 'Name' },
    { key: 'CAPACITY', name: 'Capacity' },
  ],

  selectedChannelId: null,
  viewMode: 'CHANNEL_LIST_VIEW_MODE_CARD',

  // nodes stored at zap.jackmallers.com/api/v1/suggested-peers manages by JimmyMow
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
    testnet: [],
  },
  suggestedNodesLoading: false,
}

export default function channelsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
