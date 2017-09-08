/**
 * [walletbalance description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function walletBalance(lnd) {
  return new Promise((resolve, reject) => {

    lnd.walletBalance({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * [newAddress description]
 * @param  {[type]} lnd  [description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function newAddress(lnd, type) {
  return new Promise((resolve, reject) => {

    lnd.newAddress({type}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * [newWitnessAddress description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function newWitnessAddress(lnd, { addr }) {
  return new Promise((resolve, reject) => {

    lnd.newWitnessAddress({ address: addr}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * [getTransactions description]
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getTransactions(lnd) {
  return new Promise((resolve, reject) => {

    lnd.getTransactions({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * [sendcoins description]
 * @param  {[type]} lnd    [description]
 * @param  {[type]} addr   [description]
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
export function sendCoins(lnd, { addr, amount }) {
  return new Promise((resolve, reject) => {

    lnd.sendCoins({ addr, amount }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
