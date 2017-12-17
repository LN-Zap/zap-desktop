/**
 * Returns the sum of all confirmed unspent outputs under control by the wallet
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function walletBalance(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.walletBalance({}, meta, (err, data) => {
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
export function newAddress(lnd, meta, type) {
  return new Promise((resolve, reject) => {
    lnd.newAddress({ type }, meta, (err, data) => {
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
export function newWitnessAddress(lnd, meta, { addr }) {
  return new Promise((resolve, reject) => {
    lnd.newWitnessAddress({ address: addr }, meta, (err, data) => {
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
export function getTransactions(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.getTransactions({}, meta, (err, data) => {
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
export function sendCoins(lnd, meta, { addr, amount }) {
  return new Promise((resolve, reject) => {
    lnd.sendCoins({ addr, amount }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

/**
 * Executes a request to set the alias for the node
 * @param  {[type]} new_alias [description]
 */
export function setAlias(lnd, meta, { new_alias }) {
  return new Promise((resolve, reject) => {
    lnd.setAlias({ new_alias }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
