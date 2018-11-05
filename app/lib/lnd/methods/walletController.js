/**
 * Returns the sum of all confirmed unspent outputs under control by the wallet
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function walletBalance(lnd) {
  return new Promise((resolve, reject) => {
    lnd.walletBalance({}, (err, data) => {
      if (err) {
        return reject(err)
      }

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
      if (err) {
        return reject(err)
      }

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
      if (err) {
        return reject(err)
      }

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
      if (err) {
        return reject(err)
      }

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
export function sendCoins(lnd, { addr, amount, target_conf, sat_per_byte }) {
  return new Promise((resolve, reject) => {
    lnd.sendCoins({ addr, amount, target_conf, sat_per_byte }, (err, data) => {
      if (err) {
        return reject(err)
      }

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
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Generates a seed for the wallet
 */
export function genSeed(walletUnlocker) {
  return new Promise((resolve, reject) => {
    walletUnlocker.genSeed({}, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Unlocks a wallet with a password
 * @param  {[type]} password [description]
 */
export function unlockWallet(walletUnlocker, { wallet_password }) {
  return new Promise((resolve, reject) => {
    walletUnlocker.unlockWallet({ wallet_password: Buffer.from(wallet_password) }, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}

/**
 * Unlocks a wallet with a password
 * @param  {[type]} password [description]
 * @param  {[type]} cipher_seed_mnemonic [description]
 */
export function initWallet(
  walletUnlocker,
  { wallet_password, cipher_seed_mnemonic, aezeed_passphrase = '', recovery_window }
) {
  return new Promise((resolve, reject) => {
    walletUnlocker.initWallet(
      {
        wallet_password: Buffer.from(wallet_password),
        cipher_seed_mnemonic,
        aezeed_passphrase: Buffer.from(aezeed_passphrase, 'hex'),
        recovery_window
      },
      (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(data)
      }
    )
  })
}
