/**
 * Returns the sum of all confirmed unspent outputs under control by the wallet
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
 * Creates a new address under control of the local wallet
 * @param  {[type]} lnd  [description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function newAddress(lnd, type) {
  return new Promise((resolve, reject) => {
    lnd.newAddress({ type }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * Creates a new witness address under control of the local wallet
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function newWitnessAddress(lnd, { addr }) {
  return new Promise((resolve, reject) => {
    lnd.newWitnessAddress({ address: addr }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns a list describing all the known transactions relevant to the wallet
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
 * Executes a request to send coins to a particular address
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

/**
 * Executes a request to set the alias for the node
 * @param  {[type]} new_alias [description]
 */
export function setAlias(lnd, { new_alias }) {
  return new Promise((resolve, reject) => {
    lnd.setAlias({ new_alias }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
