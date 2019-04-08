import promisifiedCall from '@zap/utils/promisifiedCall'

/**
 * [genSeed description]
 * @return {[type]} [description]
 */
async function genSeed() {
  return promisifiedCall(this.service, this.service.genSeed, {})
}

/**
 * [unlockWallet description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
async function unlockWallet(password) {
  return promisifiedCall(this.service, this.service.unlockWallet, {
    wallet_password: Buffer.from(password),
  })
}

/**
 * [initWallet description]
 * @param  {[type]} wallet_password        [description]
 * @param  {[type]} cipher_seed_mnemonic   [description]
 * @param  {String} [aezeed_passphrase=''] [description]
 * @param  {[type]} recovery_window        [description]
 * @param  {[type]} }                      [description]
 * @return {[type]}                        [description]
 */
async function initWallet({
  wallet_password,
  cipher_seed_mnemonic,
  aezeed_passphrase = '',
  recovery_window,
}) {
  return promisifiedCall(this.service, this.service.initWallet, {
    wallet_password: Buffer.from(wallet_password),
    cipher_seed_mnemonic,
    aezeed_passphrase: Buffer.from(aezeed_passphrase, 'hex'),
    recovery_window,
  })
}

export default {
  genSeed,
  unlockWallet,
  initWallet,
}
