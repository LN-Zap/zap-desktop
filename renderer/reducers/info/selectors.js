import get from 'lodash/get'
import { createSelector } from 'reselect'
import semver from 'semver'

import { settingsSelectors } from 'reducers/settings'

/**
 * @typedef {import('../index').State} State
 */

/**
 * chainSelector - Current active chain.
 *
 * @param {State} state Redux state
 * @returns {string|null} Chain name
 */
const chainSelector = state => state.info.chain

/**
 * chainsSelector - List of supported chain.
 *
 * @param {State} state Redux state
 * @returns {object} Chain details
 */
const chainsSelector = state => state.info.chains

/**
 * networkSelector - Current active chain.
 *
 * @param {State} state Redux state
 * @returns {string|null} Network name
 */
const networkSelector = state => state.info.network

/**
 * networksSelector - List of supported networks.
 *
 * @param {State} state Redux state
 * @returns {object} Network details
 */
const networksSelector = state => state.info.networks

/**
 * infoLoading - Info loading state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if info is loading
 */
const infoLoading = state => state.info.infoLoading

/**
 * infoLoaded - Info loaded state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if info has been loaded
 */
const infoLoaded = state => state.info.infoLoaded

/**
 * hasSynced - Node has synced state.
 *
 * @param {State} state Redux state
 * @returns {boolean|undefined} Boolean indicating if node has been synced
 */
const hasSynced = state => state.info.hasSynced

/**
 * isSyncedToChain - Chain sync state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if chain is synced
 */
const isSyncedToChain = state => get(state, 'info.data.syncedToChain', false)

/**
 * isSyncedToGraph - Graph sync state.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if node graph is synced
 */
const isSyncedToGraph = state => get(state, 'info.data.syncedToGraph', false)

/**
 * blockHeight - Block height.
 *
 * @param {State} state Redux state
 * @returns {number} Current block height
 */
const blockHeight = state => get(state, 'info.data.blockHeight')

/**
 * version - Node version.
 *
 * @param {State} state Redux state
 * @returns {string} Node version
 */
const version = state => get(state, 'info.data.version')

/**
 * version - Node pubkey.
 *
 * @param {State} state Redux state
 * @returns {string} Node pubkey
 */
const identityPubkey = state => get(state, 'info.data.identityPubkey')

/**
 * version - Node urls.
 *
 * @param {State} state Redux state
 * @returns {string[]} Node urls
 */
const nodeUris = state => get(state, 'info.data.uris')

/**
 * version - Grpc proto version used when connecting to the node.
 *
 * @param {State} state Redux state
 * @returns {string} Grpc proto version
 */
const grpcProtoVersion = state => get(state, 'info.data.grpcProtoVersion')

/**
 * versionString - Version string (excluding commit hash)
 *
 * @returns {string} Version string
 */
const versionString = createSelector(version, v => v && v.split(' ')[0])

/**
 * commitString - Extract the commit string from the version.
 *
 * @returns {string} Version string
 */
const commitString = createSelector(version, v => {
  if (!v) {
    return undefined
  }
  const c = v.split(' ')[1]
  return c ? c.replace('commit=', '') : undefined
})

/**
 * hasRouterSupport - Check whether node has support for Invoices service
 *
 * @returns {boolean} Boolean indicating if node has Invoices service
 */
const hasInvoicesSupport = createSelector(grpcProtoVersion, v => {
  if (!v) {
    return false
  }
  return semver.gte(v, '0.6.0-beta', { includePrerelease: true })
})

/**
 * hasRouterSupport - Check whether node has support for Router service
 *
 * @returns {boolean} Boolean indicating if node has Router service
 */
const hasRouterSupport = createSelector(grpcProtoVersion, v => {
  if (!v) {
    return false
  }
  return semver.gte(v, '0.7.1-beta', { includePrerelease: true })
})

/**
 * hasSendPaymentV2Support - Check whether node has support for SendPaymentV2 service
 *
 * @returns {boolean} Boolean indicating if node has SendPaymentV2 api
 */
const hasSendPaymentV2Support = createSelector(grpcProtoVersion, v => {
  if (!v) {
    return false
  }
  return semver.gte(v, '0.10.0-beta', { includePrerelease: true })
})

/**
 * hasMppSupport - Check whether node has support for MPP
 *
 * @returns {boolean} Boolean indicating if node has support for MPP
 */
const hasMppSupport = createSelector(grpcProtoVersion, v => {
  if (!v) {
    return false
  }
  return semver.gte(v, '0.10.0-beta', { includePrerelease: true })
})

/**
 * nodePubkey - Get the node pubkey. If not set, try to extract it from the node uri.
 *
 * @returns {string} Node pubkey
 */
const nodePubkey = createSelector(nodeUris, identityPubkey, (n, pk) => {
  const parseFromDataUri = () => n && n[0] && n[0].split('@')[0]
  return pk || parseFromDataUri()
})

/**
 * nodeUrisOrPubkey - Get the node uri or pubkey.
 *
 * @returns {string} Node uri or pubkey
 */
const nodeUrisOrPubkey = createSelector(nodeUris, nodePubkey, (uris, pk) => {
  if (uris && uris.length) {
    return uris
  }
  return [pk]
})

/**
 * networkInfo - Node network info.
 *
 * @returns {object} Node network info
 */
const networkInfo = createSelector(
  chainSelector,
  networkSelector,
  networksSelector,
  settingsSelectors.currentConfig,
  (chain, network, networks, currentConfig) => {
    const info = get(networks, `${chain}.${network}`, {})
    return {
      ...info,
      explorerUrl: info.explorerUrls[currentConfig.blockExplorer],
    }
  }
)

/**
 * chainName - Current chain name
 *
 * @returns {string} Chain name
 */
const chainName = createSelector(chainSelector, chainsSelector, (chain, chains) =>
  get(chains, `${chain}.name`, null)
)

export default {
  blockHeight,
  chainSelector,
  chainsSelector,
  networkSelector,
  networksSelector,
  infoLoading,
  infoLoaded,
  hasSynced,
  isSyncedToChain,
  isSyncedToGraph,
  version,
  identityPubkey,
  nodeUris,
  grpcProtoVersion,
  versionString,
  commitString,
  hasInvoicesSupport,
  hasRouterSupport,
  hasSendPaymentV2Support,
  hasMppSupport,
  nodePubkey,
  nodeUrisOrPubkey,
  networkInfo,
  chainName,
}
