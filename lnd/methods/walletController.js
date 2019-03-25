import { promisifiedCall } from '@zap/utils'

/**
 * Returns the sum of all confirmed unspent outputs under control by the wallet
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */

export function walletBalance(lnd) {
  return promisifiedCall(lnd, lnd.walletBalance, {})
}

/**
 * Creates a new address under control of the local wallet
 * @param  {[type]} lnd  [description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
export function newAddress(lnd, type) {
  return promisifiedCall(lnd, lnd.newAddress, { type })
}

/**
 * Creates a new witness address under control of the local wallet
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function newWitnessAddress(lnd, { addr }) {
  return promisifiedCall(lnd, lnd.newWitnessAddress, { address: addr })
}

/**
 * Returns a list describing all the known transactions relevant to the wallet
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function getTransactions(lnd) {
  return promisifiedCall(lnd, lnd.getTransactions, {})
}

/**
 * Executes a request to send coins to a particular address
 * @param  {[type]} lnd    [description]
 * @param  {[type]} addr   [description]
 * @param  {[type]} amount [description]
 * @return {[type]}        [description]
 */
export function sendCoins(lnd, { addr, amount, target_conf, sat_per_byte }) {
  return promisifiedCall(lnd, lnd.sendCoins, { addr, amount, target_conf, sat_per_byte })
}

/**
 * Executes a request to set the alias for the node
 * @param  {[type]} new_alias [description]
 */
export function setAlias(lnd, { new_alias }) {
  return promisifiedCall(lnd, lnd.setAlias, { new_alias })
}

/**
 * Generates a seed for the wallet
 */
export function genSeed(walletUnlocker) {
  return promisifiedCall(walletUnlocker, walletUnlocker.genSeed, {})
}

/**
 * Unlocks a wallet with a password
 * @param  {[type]} password [description]
 */
export function unlockWallet(walletUnlocker, { wallet_password }) {
  return promisifiedCall(walletUnlocker, walletUnlocker.unlockWallet, {
    wallet_password: Buffer.from(wallet_password),
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
  return promisifiedCall(walletUnlocker, walletUnlocker.initWallet, {
    wallet_password: Buffer.from(wallet_password),
    cipher_seed_mnemonic,
    aezeed_passphrase: Buffer.from(aezeed_passphrase, 'hex'),
    recovery_window,
  })
}
