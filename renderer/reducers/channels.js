import { createSelector } from 'reselect'
import { proxyValue } from 'comlinkjs'
import orderBy from 'lodash/orderBy'
import throttle from 'lodash/throttle'
import config from 'config'
import { requestSuggestedNodes } from '@zap/utils/api'
import truncateNodePubkey from '@zap/utils/truncateNodePubkey'
import { grpcService } from 'workers'
import { updateNotification, showWarning, showError } from './notification'
import { fetchBalance } from './balance'
import { walletSelectors } from './wallet'
import { getNodeDisplayName, updateNodeData, networkSelectors } from './network'
import { putConfig, settingsSelectors } from './settings'
import createReducer from './utils/createReducer'

// ------------------------------------
// Initial State
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

  filter: 'ALL_CHANNELS',
  filters: [
    { key: 'ALL_CHANNELS', value: 'All' },
    { key: 'ACTIVE_CHANNELS', value: 'Online' },
    { key: 'NON_ACTIVE_CHANNELS', value: 'Offline' },
    { key: 'OPEN_PENDING_CHANNELS', value: 'Pending' },
    { key: 'CLOSING_PENDING_CHANNELS', value: 'Closing' },
  ],
  sortOrder: 'asc',
  sort: 'OPEN_DATE',
  sorters: [
    { key: 'OPEN_DATE', value: 'Open date' },
    { key: 'REMOTE_BALANCE', value: 'Remote balance' },
    { key: 'LOCAL_BALANCE', value: 'Local balance' },
    { key: 'ACTIVITY', value: 'Activity' },
    { key: 'NAME', value: 'Name' },
    { key: 'CAPACITY', value: 'Capacity' },
  ],

  selectedChannelId: null,
  viewMode: config.channels.viewMode,

  suggestedNodes: {
    mainnet: [],
    testnet: [],
  },
  suggestedNodesLoading: false,
  suggestedNodesError: null,
}

// ------------------------------------
// Constants
// ------------------------------------

export const SET_CHANNEL_VIEW_MODE = 'SET_CHANNEL_VIEW_MODE'
export const SET_SELECTED_CHANNEL = 'SET_SELECTED_CHANNEL'

export const CHANGE_CHANNEL_FILTER = 'CHANGE_CHANNEL_FILTER'

export const CHANGE_CHANNEL_SORT = 'CHANGE_CHANNEL_SORT'
export const CHANGE_CHANNEL_SORT_ORDER = 'CHANGE_CHANNEL_SORT_ORDER'

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

// channel sorters
const OPEN_DATE = 'OPEN_DATE'
const REMOTE_BALANCE = 'REMOTE_BALANCE'
const LOCAL_BALANCE = 'LOCAL_BALANCE'
const ACTIVITY = 'ACTIVITY'
const NAME = 'NAME'
const CAPACITY = 'CAPACITY'

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * getChannelData - Get the channel data from aq channel object.
 * If this is a pending channel, the channel data will be stored under the `channel` key.
 *
 * @param  {object} channelObj Channel object
 * @returns {object} Channel data
 */
export const getChannelData = channelObj => channelObj.channel || channelObj

/**
 * getDisplayName - Get a name to display for the channel.
 *
 * This will either be:
 *  - the alias of the node at the other end of the channel
 *  - a shortened public key.
 *
 * @param  {object} channel Channel object
 * @param  {Array} nodes Array of nodes
 * @returns {string} Channel display name
 */
const getDisplayName = (channel, nodes) => {
  const remoteNodePubkey = getRemoteNodePubKey(channel)
  const node = nodes.find(n => n.pub_key === remoteNodePubkey)

  return node ? getNodeDisplayName(node) : truncateNodePubkey(remoteNodePubkey)
}

/**
 * getRemoteNodePubKey - Get the remote pubkey depending on what type of channel.
 *
 * due to inconsistent API vals the remote nodes pubkey will be under remote_pubkey for active channels and
 * remote_node_pub for pending channels we have.
 *
 * @param  {object} channel Channel object
 * @returns {string} Channel remote pubKey
 */
const getRemoteNodePubKey = channel => {
  return channel.node_pubkey || channel.remote_pubkey || channel.remote_node_pub
}

/**
 * getStatus - Determine the status of a channel.
 *
 * @param  {object} channelObj Channel object
 * @param  {Array} closingChannelIds List of channel ids that we are in the process of closing
 * @param  {Array} loadingChannelPubKeys List of channel ids that we are in the process of opening
 * @returns {string} Channel status name
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
 * getChannelEffectiveCapacity - Get the effective capacity (local + remote balance) for a channel.
 *
 * @param  {object} channel Channel object
 * @returns {number} Effective capacity
 */
const getChannelEffectiveCapacity = channel => channel.local_balance + channel.remote_balance || 0

/**
 * decorateChannel - Decorate a channel object with additional calculated properties.
 *
 * @param  {object} channelObj Channel object
 * @param  {Array} nodes Array of node data
 * @param  {Array} closingChannelIds List of channel ids that we are in the process of closing
 * @param  {Array} loadingChannelPubKeys List of channel ids that we are in the process of opening
 * @returns {object} Decorated channel object
 */
const decorateChannel = (channelObj, nodes, closingChannelIds, loadingChannelPubKeys) => {
  // If this is a pending channel, the channel data will be stored under the `channel` key.
  const channelData = getChannelData(channelObj)
  const status = getStatus(channelObj, closingChannelIds, loadingChannelPubKeys)

  const getActivity = c => {
    const capacity = getChannelEffectiveCapacity(c)
    return capacity ? (c.total_satoshis_sent || 0 + c.total_satoshis_received || 0) / capacity : 0
  }

  const updatedChannelData = {
    ...channelData,
    display_pubkey: getRemoteNodePubKey(channelData),
    display_name: getDisplayName(channelData, nodes),
    display_status: status,
    activity: getActivity(channelData),
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

/**
 * initChannels - Initialise channels.
 *
 * @returns {Function} Thunk
 */
export const initChannels = () => async (dispatch, getState) => {
  const state = getState()
  const currentConfig = settingsSelectors.currentConfig(state)
  const currentViewMode = channelsSelectors.viewMode(state)

  if (currentConfig.channels.viewMode !== currentViewMode) {
    dispatch(setChannelViewMode(currentConfig.channels.viewMode))
  }
}

/**
 * setChannelViewMode - Set the current channels list view mode.
 *
 * @param {('list'|'card')} viewMode View mode
 * @returns {Function} Thunk
 */
export const setChannelViewMode = viewMode => dispatch => {
  dispatch({ type: SET_CHANNEL_VIEW_MODE, viewMode })
  dispatch(putConfig('channels.viewMode', viewMode))
}

/**
 * changeFilter - Set the current channels list filter.
 *
 * @param {string} filter Filter Id
 * @returns {object} Action
 */
export function changeFilter(filter) {
  return {
    type: CHANGE_CHANNEL_FILTER,
    filter,
  }
}

/**
 * changeSort - Set the current channels list sort.
 *
 * @param {string} sort Sort Id
 * @returns {object} Action
 */
export function changeSort(sort) {
  return {
    type: CHANGE_CHANNEL_SORT,
    sort,
  }
}

/**
 * changeSortOrder - Set the current channels list sort order.
 *
 * @param {('asc'|'desc')} sortOrder Sort order
 * @returns {object} Action
 */
export function changeSortOrder(sortOrder) {
  return {
    type: CHANGE_CHANNEL_SORT_ORDER,
    sortOrder,
  }
}

/**
 * switchSortOrder - Switches between sort modes (asc<->desc).
 *
 * @returns {Function} Thunk
 */
export function switchSortOrder() {
  return (dispatch, getState) => {
    const sortOrder = channelSortOrderSelector(getState())
    return dispatch(changeSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))
  }
}

/**
 * getChannels - Initialte fetch of channel data.
 *
 * @returns {object} Action
 */
export function getChannels() {
  return {
    type: GET_CHANNELS,
  }
}

/**
 * closingChannel - Initialte channel close action.
 *
 * @returns {object} Action
 */
export function closingChannel() {
  return {
    type: CLOSING_CHANNEL,
  }
}

/**
 * updateChannelSearchQuery - Set the current channel serach string.
 *
 * @param {string} searchQuery Search query
 * @returns {object} Action
 */
export function updateChannelSearchQuery(searchQuery) {
  return {
    type: UPDATE_SEARCH_QUERY,
    searchQuery,
  }
}

/**
 * addLoadingChannel - Add a channel to the list of currently loading channels.
 *
 * @param {object} data Channel loading object
 * @returns {object} Action
 */
export function addLoadingChannel(data) {
  return {
    type: ADD_LOADING_PUBKEY,
    data,
  }
}

/**
 * removeLoadingChannel - Remove an item from list of currently loading channels.
 *
 * @param {string} pubkey Channel Pubkey
 * @returns {object} Action
 */
export function removeLoadingChannel(pubkey) {
  return {
    type: REMOVE_LOADING_PUBKEY,
    pubkey,
  }
}

/**
 * addClosingChanId - Add a channel id to to the list of currently closing channels.
 *
 * @param {string} chanId Channel Id
 * @returns {object} Action
 */
export function addClosingChanId(chanId) {
  return {
    type: ADD_ClOSING_CHAN_ID,
    chanId,
  }
}

/**
 * removeClosingChanId - Remove an item from list of currently closing channels.
 *
 * @param {string} chanId Channel Id
 * @returns {object} Action
 */
export function removeClosingChanId(chanId) {
  return {
    type: REMOVE_ClOSING_CHAN_ID,
    chanId,
  }
}

/**
 * setSelectedChannel - Set the currently selected channel.
 *
 * @param {string} selectedChannelId Channel Id
 * @returns {object} Action
 */
export function setSelectedChannel(selectedChannelId) {
  return {
    type: SET_SELECTED_CHANNEL,
    selectedChannelId,
  }
}

/**
 * getSuggestedNodes - Initiate fetch of the suggested nodes list.
 *
 * @returns {object} Action
 */
export function getSuggestedNodes() {
  return {
    type: GET_SUGGESTED_NODES,
  }
}

/**
 * receiveSuggestedNodesError - Error handler for issues fetching the suggested nodes list.
 *
 * @param {string} error Error message
 * @returns {object} Action
 */
export function receiveSuggestedNodesError(error) {
  return {
    type: RECEIVE_SUGGESTED_NODES_ERROR,
    error,
  }
}

/**
 * receiveSuggestedNodes - Success handler for fetching the suggested nodes list.
 *
 * @param {object[]} suggestedNodes List of suggested nodes
 * @returns {object} Action
 */
export function receiveSuggestedNodes(suggestedNodes) {
  return {
    type: RECEIVE_SUGGESTED_NODES,
    suggestedNodes,
  }
}

/**
 * fetchSuggestedNodes - Fetch suggested node list.
 *
 * @returns {Function} Thunk
 */
export const fetchSuggestedNodes = () => async dispatch => {
  dispatch(getSuggestedNodes())
  try {
    const suggestedNodes = await requestSuggestedNodes()
    dispatch(receiveSuggestedNodes(suggestedNodes))
  } catch (error) {
    dispatch(receiveSuggestedNodesError(error.message))
  }
}

/**
 * fetchChannels - Fetch channel data from lnd.
 *
 * @returns {Function} Thunk
 */
export const fetchChannels = () => async dispatch => {
  dispatch(getChannels())
  const grpc = await grpcService
  const channels = await grpc.services.Lightning.getChannels()
  dispatch(receiveChannels(channels))
}

/**
 * receiveChannels - Receive channels data from lnd.
 *
 * @param {object} data Details of all current channels
 * @returns {Function} Thunk
 */
export const receiveChannels = ({
  channels: { channels },
  pendingChannels,
  closedChannels: { channels: closedChannels },
}) => dispatch => {
  dispatch({ type: RECEIVE_CHANNELS, channels, pendingChannels, closedChannels })
  dispatch(fetchBalance())
}

/**
 * openChannel - Send open channel request to lnd.
 *
 * @param {object} data New channel config
 * @returns {Function} Thunk
 */
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
  try {
    const grpc = await grpcService
    const data = await grpc.services.Lightning.connectAndOpen({
      pubkey,
      host,
      localamt,
      private: channelIsPrivate,
      satPerByte,
      spendUnconfirmed,
    })
    dispatch(pushchannelupdated(data))
    grpc.services.Lightning.once(
      'openChannel.data',
      proxyValue(data => dispatch(pushchannelupdated(data)))
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

/**
 * pushchannelupdated - Receive a channel update notification from lnd.
 *
 * @param {object} data Channel update notification
 * @returns {Function} Thunk
 */
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

/**
 * pushchannelerror - Receive a channel error notification from lnd.
 *
 * @param {object} data Channel error notification
 * @returns {Function} Thunk
 */
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

/**
 * showCloseChannelDialog - Show the channel close dialog.
 *
 * @returns {object} Action
 */
export const showCloseChannelDialog = () => ({
  type: OPEN_CLOSE_CHANNEL_DIALOG,
})

/**
 * hideCloseChannelDialog - Hide the channel close dialog.
 *
 * @returns {object} Action
 */
export const hideCloseChannelDialog = () => ({
  type: CLOSE_CLOSE_CHANNEL_DIALOG,
})

/**
 * closeChannel - Close the currently selected channel.
 *
 * @returns {Function} Thunk
 */
export const closeChannel = () => async (dispatch, getState) => {
  const selectedChannel = channelsSelectors.selectedChannel(getState())

  if (selectedChannel) {
    const { channel_point, chan_id, active } = selectedChannel
    dispatch(closingChannel())
    dispatch(addClosingChanId(chan_id))

    const [funding_txid, output_index] = channel_point.split(':')

    // Attempt to open the channel.
    try {
      const grpc = await grpcService
      const data = await grpc.services.Lightning.closeChannel({
        channel_point: {
          funding_txid,
          output_index,
        },
        chan_id,
        force: !active,
      })
      dispatch(pushclosechannelupdated(data))
      grpc.services.Lightning.once(
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

/**
 * pushclosechannelupdated - Receive a channel cloase update notification from lnd.
 *
 * @param {object} data Channel close update notification
 * @returns {Function} Thunk
 */
export const pushclosechannelupdated = ({ chan_id }) => dispatch => {
  dispatch(fetchChannels())
  dispatch(removeClosingChanId(chan_id))
}

/**
 * pushclosechannelerror - Receive a channel cloase error notification from lnd.
 *
 * @param {object} data Channel close error notification
 * @returns {Function} Thunk
 */
export const pushclosechannelerror = ({ error, chan_id }) => dispatch => {
  dispatch(showError(error))
  dispatch(removeClosingChanId(chan_id))
}

/**
 * throttledFetchChannels - Throttled dispatch to fetchChannels (calls fetchChannels no more than once per second).
 */
const throttledFetchChannels = throttle(dispatch => dispatch(fetchChannels()), 1000, {
  leading: true,
  trailing: true,
})

/**
 * receiveChannelGraphData - Receive channel graph data from lnd.
 *
 * @param {object} data Channel graph
 * @returns {Function} Thunk
 */
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

      // Determine whether this update affected our node or any of our channels.
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

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_CHANNEL_VIEW_MODE]: (state, { viewMode }) => {
    state.viewMode = viewMode
  },
  [GET_CHANNELS]: state => {
    state.channelsLoading = true
  },
  [RECEIVE_CHANNELS]: (state, { channels, pendingChannels, closedChannels }) => {
    state.channelsLoading = false
    state.channels = channels
    state.pendingChannels = pendingChannels
    state.closedChannels = closedChannels
  },

  [CLOSING_CHANNEL]: state => {
    state.closingChannel = true
  },

  [UPDATE_SEARCH_QUERY]: (state, { searchQuery }) => {
    state.searchQuery = searchQuery
  },

  [CHANGE_CHANNEL_FILTER]: (state, { filter }) => {
    state.filter = filter
  },
  [CHANGE_CHANNEL_SORT]: (state, { sort }) => {
    state.sort = sort
  },
  [CHANGE_CHANNEL_SORT_ORDER]: (state, { sortOrder }) => {
    state.sortOrder = sortOrder
  },

  [ADD_LOADING_PUBKEY]: (state, { data }) => {
    state.loadingChannels.unshift(data)
  },
  [REMOVE_LOADING_PUBKEY]: (state, { pubkey }) => {
    state.loadingChannels = state.loadingChannels.filter(data => data.node_pubkey !== pubkey)
  },

  [ADD_ClOSING_CHAN_ID]: (state, { chanId }) => {
    state.closingChannelIds.unshift(chanId)
  },
  [REMOVE_ClOSING_CHAN_ID]: (state, { chanId }) => {
    state.closingChannelIds = state.closingChannelIds.filter(
      closingChanId => closingChanId !== chanId
    )
  },

  [SET_SELECTED_CHANNEL]: (state, { selectedChannelId }) => {
    state.selectedChannelId = selectedChannelId
  },

  [GET_SUGGESTED_NODES]: state => {
    state.suggestedNodesLoading = true
    state.suggestedNodesError = null
  },
  [RECEIVE_SUGGESTED_NODES]: (state, { suggestedNodes }) => {
    state.suggestedNodesLoading = false
    state.suggestedNodesError = null
    state.suggestedNodes = suggestedNodes
  },
  [RECEIVE_SUGGESTED_NODES_ERROR]: (state, { error }) => {
    state.suggestedNodesLoading = false
    state.suggestedNodesError = error
    state.suggestedNodes = {
      mainnet: [],
      testnet: [],
    }
  },
  [OPEN_CLOSE_CHANNEL_DIALOG]: state => {
    state.isCloseDialogOpen = true
  },
  [CLOSE_CLOSE_CHANNEL_DIALOG]: state => {
    state.isCloseDialogOpen = false
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

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
const channelSortSelector = state => state.channels.sort
const channelSortOrderSelector = state => state.channels.sortOrder
const filterSelector = state => state.channels.filter
const nodesSelector = state => networkSelectors.nodes(state)
const viewModeSelector = state => state.channels.viewMode

channelsSelectors.viewMode = viewModeSelector

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

const applyChannelSort = (channels, sort, sortOrder) => {
  const SORTERS = {
    [OPEN_DATE]: c => c.index,
    [REMOTE_BALANCE]: c => c.remote_balance || 0,
    [LOCAL_BALANCE]: c => c.local_balance || 0,
    [ACTIVITY]: c => c.activity,
    [NAME]: c => c.display_name || '',
    [CAPACITY]: getChannelEffectiveCapacity,
  }
  const sorter = SORTERS[sort]

  const result = sorter
    ? orderBy(
        // add indices to be able to provide reverse initial sorting (which corresponds to sorting by date)
        channels.map((c, index) => ({ ...c, index })),
        [c => Boolean(c.active), sorter],
        ['desc', sortOrder]
      )
    : channels
  return result
}

channelsSelectors.currentChannels = createSelector(
  channelsSelectors.allChannels,
  channelsSelectors.activeChannels,
  channelsSelectors.channelsSelector,
  channelsSelectors.pendingOpenChannels,
  channelsSelectors.closingPendingChannels,
  channelsSelectors.nonActiveChannels,
  filterSelector,
  channelSearchQuerySelector,
  channelSortSelector,
  channelSortOrderSelector,
  (
    allChannelsArr,
    activeChannelsArr,
    openChannels,
    pendingOpenChannels,
    pendingClosedChannels,
    nonActiveChannelsArr,
    channelFilter,
    searchQuery,
    sort,
    sortOrder
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

    const result = filteredArray(channelFilter).filter(filterChannel)
    return applyChannelSort(result, sort, sortOrder)
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

channelsSelectors.capacity = createSelector(
  channelsSelectors.allChannelsRaw,
  allChannels => {
    let send = 0
    let receive = 0
    allChannels.forEach(channel => {
      const channelData = getChannelData(channel)
      if (channelData.local_balance) {
        send += channelData.local_balance
      }
      if (channelData.remote_balance) {
        receive += channelData.remote_balance
      }
    })
    return { send, receive }
  }
)

channelsSelectors.sendCapacity = createSelector(
  channelsSelectors.capacity,
  capacity => capacity.send
)

channelsSelectors.receiveCapacity = createSelector(
  channelsSelectors.capacity,
  capacity => capacity.receive
)

export { channelsSelectors }

export default createReducer(initialState, ACTION_HANDLERS)
