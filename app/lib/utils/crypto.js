import bitcoin from 'bitcoinjs-lib'
import bech32 from 'lib/utils/bech32'

/**
 * Test to see if a string is a valid on-chain address.
 * @param {String} input string to check.
 * @param {String} [network='mainnet'] network to check (mainnet, testnet).
 * @return {Boolean} boolean indicating wether the address is a valid on-chain address.
 */
export const isOnchain = (input, chain = 'bitcoin', network = 'mainnet') => {
  if (chain !== 'bitcoin') {
    // TODO: Implement address checking for litecoin.
    return true
  }
  try {
    bitcoin.address.toOutputScript(
      input,
      network === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
    )
    return true
  } catch (e) {
    return false
  }
}

/**
 * Test to see if a string is a valid lightning address.
 * @param {String} input string to check.
 * @param {String} [network='bitcoin'] chain to check (bitcoin, litecoin).
 * @param {String} [network='mainnet'] network to check (mainnet, testnet, regtest).
 * @return {Boolean} boolean indicating wether the address is a lightning address.
 */
export const isLn = (input, chain = 'bitcoin', network = 'mainnet') => {
  let prefix = 'ln'
  // Prefixes come from SLIP-0173
  // See https://github.com/satoshilabs/slips/blob/master/slip-0173.md
  if (chain === 'bitcoin') {
    switch (network) {
      case 'mainnet':
        prefix = 'lnbc'
        break
      case 'testnet':
        prefix = 'lntb'
        break
      case 'regtest':
        prefix = 'lnbcrt'
        break
    }
  } else if (chain === 'litecoin') {
    switch (network) {
      case 'mainnet':
        prefix = 'lnltc'
        break
      case 'testnet':
        prefix = 'lntltc'
        break
      case 'regtest':
        prefix = 'lnrltc'
        break
    }
  }

  if (!input.startsWith(prefix)) {
    return false
  }

  try {
    bech32.decode(input)
    return true
  } catch (e) {
    return false
  }
}
