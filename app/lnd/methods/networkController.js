/**
 * [info description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getInfo(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.getInfo({}, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns general information concerning the lightning node
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @return {[type]}        [description]
 */
export function getNodeInfo(lnd, meta, { pubkey }) {
  return new Promise((resolve, reject) => {
    lnd.getNodeInfo({ pub_key: pubkey }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns a description of the latest graph state from the point of view of the node
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function describeGraph(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.describeGraph({}, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Attempts to query the daemon’s Channel Router for a possible route to a target destination capable of carrying a specific amount of satoshis
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
export function queryRoutes(lnd, meta, { pubkey, amount }) {
  return new Promise((resolve, reject) => {
    lnd.queryRoutes({ pub_key: pubkey, amt: amount }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns some basic stats about the known channel graph from the point of view of the node
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getNetworkInfo(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.getNetworkInfo({}, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
