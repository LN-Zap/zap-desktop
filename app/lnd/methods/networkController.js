/**
 * [info description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getInfo(lnd) {
  return new Promise((resolve, reject) => {

    lnd.getInfo({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * [getNodeInfo description]
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @return {[type]}        [description]
 */
export function getNodeInfo(lnd, { pubkey }) {
  return new Promise ((resolve, reject) => {

    lnd.getNodeInfo({ pub_key: pubkey}, (err, data) => {
      if(err) { reject (err) }

      resolve(data)
    })
  })
}


/**
 * [describeGraph description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function describeGraph(lnd) {
  return new Promise ((resolve, reject) => {

    lnd.describeGraph({}, (err, data) => {
      if(err) { reject (err) }

      resolve(data)
    })
  })
}


/**
 * [queryRoutes description]
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
export function queryRoutes(lnd, { pubkey, amount }) {
  return new Promise ((resolve, reject) => {

    lnd.queryRoutes({pub_key: pubkey, amt: amount }, (err, data) => {
      if(err) {reject (err) }

      resolve(data)
    })
  })
}


/**
 * [getNetworkInfo description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getNetworkInfo(lnd) {
  return new Promise((resolve, reject) => {

    lnd.getNetworkInfo({}, (err, data) => {
      if(err) { reject(err) }

      resolve(data)
    })
  })
}
