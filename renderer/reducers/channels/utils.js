import get from 'lodash/get'

import { CoinBig } from '@zap/utils/coin'
import truncateNodePubkey from '@zap/utils/truncateNodePubkey'
import { getNodeDisplayName } from 'reducers/network'

/**
 * getChannelData - Get the channel data from a channel object.
 * If this is a pending channel, the channel data will be stored under the `channel` key.
 *
 * @param {object} channelObj Channel object
 * @returns {object} Channel data
 */
export const getChannelData = channelObj => {
  return channelObj.channel ? { ...channelObj, ...channelObj.channel } : channelObj
}

/**
 * getRemoteNodePubKey - Get the remote pubkey depending on what type of channel.
 *
 * due to inconsistent API vals the remote nodes pubkey will be under remotePubkey for active channels and
 * remoteNodePub for pending channels we have.
 *
 * @param {object} channel Channel object
 * @returns {string} Channel remote pubKey
 */
export const getRemoteNodePubKey = channel => {
  return channel.nodePubkey || channel.remotePubkey || channel.remoteNodePub
}

/**
 * getDisplayName - Get a name to display for the channel.
 *
 * This will either be:
 *  - the alias of the node at the other end of the channel
 *  - a shortened public key.
 *
 * @param {object} channel Channel object
 * @param {Array} nodes Array of nodes
 * @returns {string} Channel display name
 */
export const getDisplayName = (channel, nodes) => {
  const remoteNodePubkey = getRemoteNodePubKey(channel)
  const node = nodes.find(n => n.pubKey === remoteNodePubkey)

  return node ? getNodeDisplayName(node) : truncateNodePubkey(remoteNodePubkey)
}

/**
 * getStatus - Determine the status of a channel.
 *
 * @param {object} channelObj Channel object
 * @param {Array} closingChannelIds List of channel ids that we are in the process of closing
 * @param {Array} loadingChannelPubKeys List of channel ids that we are in the process of opening
 * @returns {string} Channel status name
 */
export const getStatus = (channelObj, closingChannelIds = [], loadingChannelPubKeys = []) => {
  const channelData = getChannelData(channelObj)
  const pubKey = getRemoteNodePubKey(channelData)

  // if the channel pubkey is in loadingChabnnels, set status as loading.
  if (loadingChannelPubKeys.includes(pubKey) && !channelData.channelPoint) {
    return 'loading'
  }
  // if the channel has a confirmationHeight property that means it's pending.
  if ('confirmationHeight' in channelObj) {
    return 'pendingOpen'
  }
  // if the channel has a closing txid and a limbo balance, that means it's force closing.
  if ('closingTxid' in channelObj && 'limboBalance' in channelObj) {
    return 'pendingForceClose'
  }
  // if the channel has a closing txid but no limbo balance or it's in our internal list of closing transactions,
  // that means it is pending closing.
  if (
    ('closingTxid' in channelObj && !('limboBalance' in channelObj)) ||
    closingChannelIds.includes(channelObj.chanId)
  ) {
    return 'pendingClose'
  }
  // If the channel has a limbo balance but no closing txid, it is waiting to close.
  if (!('closingTxid' in channelObj) && 'limboBalance' in channelObj) {
    return 'waitingClose'
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
 * @param {object} channel Channel object
 * @returns {number} Effective capacity
 */
export const getChannelEffectiveCapacity = channel =>
  CoinBig(get(channel, 'localBalance', 0))
    .plus(CoinBig(get(channel, 'remoteBalance', 0)))
    .toNumber()

/**
 * decorateChannel - Decorate a channel object with additional calculated properties.
 *
 * @param {object} channelObj Channel object
 * @param {Array} nodes Array of node data
 * @param {Array} closingChannelIds List of channel ids that we are in the process of closing
 * @param {Array} loadingChannelPubKeys List of channel ids that we are in the process of opening
 * @returns {object} Decorated channel object
 */
export const decorateChannel = (channelObj, nodes, closingChannelIds, loadingChannelPubKeys) => {
  // If this is a pending channel, the channel data will be stored under the `channel` key.
  const channelData = getChannelData(channelObj)
  const status = getStatus(channelObj, closingChannelIds, loadingChannelPubKeys)

  const getActivity = c => {
    // Get the overall channel capacity.
    const capacity = getChannelEffectiveCapacity(c)

    if (capacity && CoinBig(capacity).gt(0)) {
      // Calculate channel flow (sum of amounts sent and received).
      const sent = CoinBig(get(c, 'totalSatoshisSent', 0))
      const received = CoinBig(get(c, 'totalSatoshisReceived', 0))
      const flow = CoinBig.sum(sent, received)

      // Calculate capacity as flow / capacity.
      const activity = flow
        .dividedBy(CoinBig(capacity))
        .multipliedBy(100)
        .toFixed(0)

      return Number(activity)
    }

    return 0
  }

  const updatedChannelData = {
    ...channelData,
    displayPubkey: getRemoteNodePubKey(channelData),
    displayName: getDisplayName(channelData, nodes),
    displayStatus: status,
    activity: getActivity(channelData),
    canClose:
      ['open', 'offline'].includes(status) && !closingChannelIds.includes(channelData.chanId),
  }

  if (channelObj.closingTxid) {
    updatedChannelData.closingTxid = channelObj.closingTxid
  }

  if (channelObj.channel) {
    return {
      ...channelObj,
      channel: updatedChannelData,
    }
  }

  return updatedChannelData
}
