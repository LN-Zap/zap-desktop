import get from 'lodash/get'
import orderBy from 'lodash/orderBy'
import { createSelector } from 'reselect'

import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { infoSelectors } from 'reducers/info'
import { networkSelectors } from 'reducers/network'
import { settingsSelectors } from 'reducers/settings'

import {
  DEFAULT_FILTER,
  CHANNELS_SORT_OPEN_DATE,
  CHANNELS_SORT_REMOTE_BALANCE,
  CHANNELS_SORT_LOCAL_BALANCE,
  CHANNELS_SORT_ACTIVITY,
  CHANNELS_SORT_NAME,
  CHANNELS_SORT_CAPACITY,
} from './constants'
import { getChannelData, getChannelEffectiveCapacity, decorateChannel } from './utils'

const channelsSelectors = {}

const channelsSelector = state => state.channels.channels
const closedChannelsSelector = state => state.channels.closedChannels
const loadingChannelsSelector = state => state.channels.loadingChannels
const selectedChannelIdSelector = state => state.channels.selectedChannelId
const pendingOpenChannelsSelector = state => state.channels.pendingChannels.pendingOpenChannels
const pendingClosedChannelsSelector = state => state.channels.pendingChannels.pendingClosingChannels
const pendingForceClosedChannelsSelector = state =>
  state.channels.pendingChannels.pendingForceClosingChannels
const waitingCloseChannelsSelector = state => state.channels.pendingChannels.waitingCloseChannels
const totalLimboBalanceSelector = state => state.channels.pendingChannels.totalLimboBalance
const closingChannelIdsSelector = state => state.channels.closingChannelIds
const channelSearchQuerySelector = state => state.channels.searchQuery
const channelSortSelector = state => state.channels.sort
const channelSortOrderSelector = state => state.channels.sortOrder
const filterSelector = state => state.channels.filter
const nodesSelector = state => networkSelectors.nodes(state)

export const channelMatchesQuery = (channelObj, searchQuery) => {
  if (!searchQuery) {
    return true
  }

  const channel = getChannelData(channelObj)
  const query = searchQuery.toLowerCase()

  const nodePubkey = (channel.nodePubkey || '').toLowerCase()
  const remoteNodePub = (channel.remoteNodePub || '').toLowerCase()
  const remotePubkey = (channel.remotePubkey || '').toLowerCase()
  const displayName = (channel.displayName || '').toLowerCase()

  return (
    nodePubkey.includes(query) ||
    remoteNodePub.includes(query) ||
    remotePubkey.includes(query) ||
    displayName.includes(query)
  )
}

channelsSelectors.viewMode = createSelector(settingsSelectors.currentConfig, currentConfig =>
  get(currentConfig, 'channels.viewMode')
)

channelsSelectors.channelSortOrder = channelSortOrderSelector

channelsSelectors.totalLimboBalance = createSelector(
  totalLimboBalanceSelector,
  totalLimboBalance => totalLimboBalance
)

channelsSelectors.loadingChannelPubKeys = createSelector(loadingChannelsSelector, loadingChannels =>
  loadingChannels.map(loadingChannel => loadingChannel.nodePubkey)
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
  openChannels => openChannels.map(c => c.remotePubkey)
)

channelsSelectors.nonActiveChannels = createSelector(
  channelsSelectors.channelsSelector,
  openChannels => openChannels.filter(channel => !channel.active)
)

channelsSelectors.nonActiveChannelPubkeys = createSelector(
  channelsSelectors.nonActiveChannels,
  openChannels => openChannels.map(c => c.remotePubkey)
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
        return !loadingChannelPubKeys.includes(channelData.displayPubkey)
      })
)

channelsSelectors.pendingOpenChannelPubkeys = createSelector(
  channelsSelectors.pendingOpenChannels,
  pendingOpenChannels =>
    pendingOpenChannels.map(pendingChannel => pendingChannel.channel.remoteNodePub)
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
    ...closingPendingChannels.map(pendingChannel => pendingChannel.channel.chanId),
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
    [CHANNELS_SORT_OPEN_DATE]: c => c.chanId,
    [CHANNELS_SORT_REMOTE_BALANCE]: c =>
      Number(convert('sats', 'btc', get(c, 'remoteBalance', 0))) || 0,
    [CHANNELS_SORT_LOCAL_BALANCE]: c =>
      Number(convert('sats', 'btc', get(c, 'localBalance', 0))) || 0,
    [CHANNELS_SORT_ACTIVITY]: c => c.activity,
    [CHANNELS_SORT_NAME]: c => c.displayName || '',
    [CHANNELS_SORT_CAPACITY]: getChannelEffectiveCapacity,
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
    filters,
    searchQuery,
    sort,
    sortOrder
  ) => {
    const filterChannel = channel => channelMatchesQuery(channel, searchQuery)

    const result = []
    const curFilter = filters.size ? filters : DEFAULT_FILTER

    curFilter.has('ACTIVE_CHANNELS') && result.push(...activeChannelsArr)
    curFilter.has('NON_ACTIVE_CHANNELS') && result.push(...nonActiveChannelsArr)
    curFilter.has('OPEN_CHANNELS') && result.push(...openChannels)
    curFilter.has('OPEN_PENDING_CHANNELS') && result.push(...pendingOpenChannels)
    curFilter.has('CLOSING_PENDING_CHANNELS') && result.push(...pendingClosedChannels)

    return applyChannelSort(result.filter(filterChannel), sort, sortOrder)
  }
)

channelsSelectors.selectedChannel = createSelector(
  selectedChannelIdSelector,
  channelsSelectors.allChannels,
  (selectedChannelId, allChannels) => {
    const channel = allChannels.find(c => {
      const channelData = getChannelData(c)
      return channelData.channelPoint === selectedChannelId
    })
    return channel && getChannelData(channel)
  }
)

channelsSelectors.capacity = createSelector(
  channelsSelectors.activeChannels,
  infoSelectors.hasMppSupport,
  (allChannels, hasMppSupport) => {
    let maxOneTimeSend = 0
    let maxOneTimeReceive = 0
    let send = 0
    let receive = 0

    allChannels.forEach(channel => {
      const channelData = getChannelData(channel)
      const local = CoinBig(get(channelData, 'localBalance', 0))
      const remote = CoinBig(get(channelData, 'remoteBalance', 0))

      if (local) {
        send = CoinBig.sum(send, local)
        maxOneTimeSend = hasMppSupport ? send : CoinBig.max(maxOneTimeSend, local)
      }

      if (remote) {
        receive = CoinBig.sum(receive, remote)
        maxOneTimeReceive = hasMppSupport ? receive : CoinBig.max(maxOneTimeReceive, remote)
      }
    })

    return {
      send: CoinBig(send).toString(),
      receive: CoinBig(receive).toString(),
      maxOneTimeReceive: CoinBig(maxOneTimeReceive).toString(),
      maxOneTimeSend: CoinBig(maxOneTimeSend).toString(),
    }
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
channelsSelectors.maxOneTimeSend = createSelector(
  channelsSelectors.capacity,
  capacity => capacity.maxOneTimeSend
)

channelsSelectors.maxOneTimeReceive = createSelector(
  channelsSelectors.capacity,
  capacity => capacity.maxOneTimeReceive
)

channelsSelectors.isCustomFilter = createSelector(filterSelector, filters => {
  if (filters.size && filters.size !== DEFAULT_FILTER.size) {
    return true
  }
  const difference = new Set([...filters].filter(x => !DEFAULT_FILTER.has(x)))
  return difference.size > 0
})

export default channelsSelectors
