import promisifiedCall from '@zap/utils/promisifiedCall'

/**
 * GenSeed is the first method that should be used to instantiate a new lnd instance
 * @param  {GenSeedRequest} payload rpc payload
 * @return {Promise<GenSeedResponse>}
 */
async function genSeed(payload = {}) {
  return promisifiedCall(this.service, this.service.genSeed, payload)
}

/**
 * UnlockWallet is used at startup of lnd to provide a password to unlock the wallet database
 * @param  {String} password Current valid passphrase for the daemon.
 * @return {Promise<UnlockWalletResponse>}
 */
async function unlockWallet(password) {
  const res = await promisifiedCall(this.service, this.service.unlockWallet, {
    wallet_password: Buffer.from(password),
  })
  this.emit('UNLOCK_WALLET_SUCCESS')
  return res
}

/**
 * InitWallet is used when lnd is starting up for the first time to fully initialize the daemon and its internal wallet
 * @param  {String} wallet_password        wallet_password is the passphrase that should be used to encrypt the wallet
 * @param  {String} cipher_seed_mnemonic   24-word mnemonic that encodes a prior aezeed cipher seed obtained by the user
 * @param  {Number} recovery_window        Address lookahead when restoring a wallet seed
 * @return {Promise<InitWalletResponse>}
 */
async function initWallet({ wallet_password, cipher_seed_mnemonic, recovery_window }) {
  return promisifiedCall(this.service, this.service.initWallet, {
    wallet_password: Buffer.from(wallet_password),
    cipher_seed_mnemonic,
    recovery_window,
  })
}

export default {
  genSeed,
  unlockWallet,
  initWallet,
}
