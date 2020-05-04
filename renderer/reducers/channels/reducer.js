import throttle from 'lodash/throttle'
import createReducer from '@zap/utils/createReducer'
import { CoinBig } from '@zap/utils/coin'
import { getIntl } from '@zap/i18n'
import { requestSuggestedNodes } from '@zap/utils/api'
import { grpc } from 'workers'
import { updateNotification, showWarning, showError } from 'reducers/notification'
import { fetchBalance } from 'reducers/balance'
import { walletSelectors } from 'reducers/wallet'
import { updateNodeData } from 'reducers/network'
import { putConfig, settingsSelectors } from 'reducers/settings'
import messages from './messages'
import * as constants from './constants'
import channelsSelectors from './selectors'

const {
  DEFAULT_FILTER,
  SET_CHANNEL_VIEW_MODE,
  SET_SELECTED_CHANNEL,
  CHANGE_CHANNEL_FILTER,
  CHANGE_CHANNEL_SORT,
  CHANGE_CHANNEL_SORT_ORDER,
  UPDATE_SEARCH_QUERY,
  GET_CHANNELS,
  RECEIVE_CHANNELS,
  CLOSING_CHANNEL,
  ADD_LOADING_PUBKEY,
  REMOVE_LOADING_PUBKEY,
  ADD_CLOSING_CHAN_ID,
  REMOVE_CLOSING_CHAN_ID,
  GET_SUGGESTED_NODES,
  RECEIVE_SUGGESTED_NODES_ERROR,
  RECEIVE_SUGGESTED_NODES,
} = constants

// ------------------------------------
// Initial State
// ------------------------------------

const initialState = {
  channelsLoading: false,
  loadingChannels: [],
  channels: [],
  pendingChannels: {
    totalLimboBalance: '0',
    pendingOpenChannels: [],
    pendingClosingChannels: [],
    pendingForceClosingChannels: [],
    waitingCloseChannels: [],
  },
  closedChannels: [],
  closingChannelIds: [],
  closingChannel: false,
  searchQuery: null,
  filter: new Set([...DEFAULT_FILTER]),
  filters: [
    { key: 'ACTIVE_CHANNELS', value: 'Online' },
    { key: 'NON_ACTIVE_CHANNELS', value: 'Offline' },
    { key: 'OPEN_PENDING_CHANNELS', value: 'Pending' },
    { key: 'CLOSING_PENDING_CHANNELS', value: 'Closing' },
  ],
  sortOrder: 'asc',
  sort: 'CHANNELS_SORT_OPEN_DATE',
  sorters: [
    { key: 'CHANNELS_SORT_OPEN_DATE', value: 'Open date' },
    { key: 'CHANNELS_SORT_REMOTE_BALANCE', value: 'Remote balance' },
    { key: 'CHANNELS_SORT_LOCAL_BALANCE', value: 'Local balance' },
    { key: 'CHANNELS_SORT_ACTIVITY', value: 'Activity' },
    { key: 'CHANNELS_SORT_NAME', value: 'Name' },
    { key: 'CHANNELS_SORT_CAPACITY', value: 'Capacity' },
  ],

  selectedChannelId: null,

  suggestedNodes: {
    mainnet: [],
    testnet: [],
  },
  suggestedNodesLoading: false,
  suggestedNodesError: null,
}

// ------------------------------------
// Actions
// ------------------------------------

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
    const sortOrder = channelsSelectors.channelSortOrder(getState())
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
    type: ADD_CLOSING_CHAN_ID,
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
    type: REMOVE_CLOSING_CHAN_ID,
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
 * fetchChannels - Fetch channel data from lnd.
 *
 * @returns {Function} Thunk
 */
export const fetchChannels = () => async dispatch => {
  dispatch(getChannels())
  const channels = await grpc.services.Lightning.getChannels()
  dispatch(receiveChannels(channels))
}

/**
 * pushchannelupdated - Receive a channel update notification from lnd.
 *
 * @param {object} data Channel update notification
 * @returns {Function} Thunk
 */
export const pushchannelupdated = ({ nodePubkey, data }) => dispatch => {
  dispatch(fetchChannels())
  if (data.update === 'chanPending') {
    dispatch(removeLoadingChannel(nodePubkey))
    dispatch(
      updateNotification(
        { payload: { pubkey: nodePubkey } },
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
export const pushchannelerror = ({ nodePubkey, error }) => dispatch => {
  dispatch(removeLoadingChannel(nodePubkey))
  dispatch(
    updateNotification(
      { payload: { pubkey: nodePubkey } },
      {
        variant: 'error',
        message: `Unable to open channel: ${error}`,
        isProcessing: false,
      }
    )
  )
}

/**
 * pushclosechannelupdated - Receive a channel cloase update notification from lnd.
 *
 * @param {object} data Channel close update notification
 * @returns {Function} Thunk
 */
export const pushclosechannelupdated = ({ chanId }) => dispatch => {
  dispatch(fetchChannels())
  dispatch(removeClosingChanId(chanId))
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
    nodePubkey: pubkey,
    localBalance: CoinBig(localamt || 0).toString(),
    remoteBalance: '0',
    private: channelIsPrivate,
  }
  dispatch(addLoadingChannel(loadingChannel))

  // Show notification.
  dispatch(
    showWarning(getIntl().formatMessage(messages.channels_open_warning), {
      payload: { pubkey },
      isProcessing: true,
    })
  )

  // Attempt to open the channel.
  try {
    const channelData = await grpc.services.Lightning.connectAndOpen({
      pubkey,
      host,
      localamt,
      private: channelIsPrivate,
      satPerByte,
      spendUnconfirmed,
    })
    dispatch(pushchannelupdated(channelData))
  } catch (e) {
    dispatch(
      pushchannelerror({
        error: e.message,
        nodePubkey: e.payload.nodePubkey,
      })
    )
  }
}

/**
 * closeChannel - Close the currently selected channel.
 *
 * @returns {Function} Thunk
 */
export const closeChannel = () => async (dispatch, getState) => {
  const selectedChannel = channelsSelectors.selectedChannel(getState())

  if (selectedChannel) {
    const { channelPoint, chanId, active } = selectedChannel
    dispatch(closingChannel())
    dispatch(addClosingChanId(chanId))

    const [fundingTxid, outputIndex] = channelPoint.split(':')

    // Attempt to open the channel.
    try {
      const data = await grpc.services.Lightning.closeChannel({
        channelPoint: {
          fundingTxid,
          outputIndex,
        },
        chanId,
        force: !active,
      })
      dispatch(pushclosechannelupdated(data))
    } catch (e) {
      dispatch(
        pushchannelerror({
          error: e.message,
          nodePubkey: e.payload.nodePubkey,
        })
      )
    }
  }
}

/**
 * pushclosechannelerror - Receive a channel cloase error notification from lnd.
 *
 * @param {object} data Channel close error notification
 * @returns {Function} Thunk
 */
export const pushclosechannelerror = ({ error, chanId }) => dispatch => {
  dispatch(showError(error))
  dispatch(removeClosingChanId(chanId))
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
export const receiveChannelGraphData = ({ channelUpdates, nodeUpdates }) => (
  dispatch,
  getState
) => {
  const { info, channels } = getState()
  // Process node updates.
  if (nodeUpdates.length) {
    dispatch(updateNodeData(nodeUpdates))
  }

  // if there are any new channel updates
  let hasUpdates = false
  if (channelUpdates.length) {
    // loop through the channel updates
    for (let i = 0; i < channelUpdates.length; i += 1) {
      const channelUpdate = channelUpdates[i]
      const { advertisingNode, connectingNode } = channelUpdate

      // Determine whether this update affected our node or any of our channels.
      if (
        info.data.identityPubkey === advertisingNode ||
        info.data.identityPubkey === connectingNode ||
        channels.channels.find(channel => {
          return [advertisingNode, connectingNode].includes(channel.remotePubkey)
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
    const { filter: allFilters } = state
    // if `filter` action param is not set - reset to default
    if (!filter) {
      state.filter = new Set([...DEFAULT_FILTER])
    } else if (allFilters.has(filter)) {
      allFilters.delete(filter)
    } else {
      allFilters.add(filter)
    }
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
    state.loadingChannels = state.loadingChannels.filter(data => data.nodePubkey !== pubkey)
  },
  [ADD_CLOSING_CHAN_ID]: (state, { chanId }) => {
    state.closingChannelIds.unshift(chanId)
  },
  [REMOVE_CLOSING_CHAN_ID]: (state, { chanId }) => {
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
}

export default createReducer(initialState, ACTION_HANDLERS)
