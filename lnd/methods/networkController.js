import { promisifiedCall } from '@zap/utils'
/**
 * [info description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getInfo(lnd) {
  return promisifiedCall(lnd, lnd.getInfo, {})
}

/**
 * Returns general information concerning the lightning node
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @return {[type]}        [description]
 */
export function getNodeInfo(lnd, { pubkey }) {
  return promisifiedCall(lnd, lnd.getNodeInfo, { pub_key: pubkey })
}

/**
 * Returns a description of the latest graph state from the point of view of the node
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function describeGraph(lnd) {
  return promisifiedCall(lnd, lnd.describeGraph, {})
}

/**
 * Attempts to query the daemon’s Channel Router for a possible route to a
 * target destination capable of carrying a specific amount of satoshis
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
export function queryRoutes(lnd, { pubkey, amount, numRoutes = 15 }) {
  return promisifiedCall(lnd, lnd.queryRoutes, {
    pub_key: pubkey,
    amt: amount,
    num_routes: numRoutes,
  })
}

/**
 * Returns some basic stats about the known channel graph from the point of view of the node
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getNetworkInfo(lnd) {
  return promisifiedCall(lnd, lnd.getNetworkInfo, {})
}
