import get from 'lodash/get'

import { convert } from '@zap/utils/btc'

import {
  TRANSACTION_SPEED_SLOW,
  TRANSACTION_SPEED_MEDIUM,
  TRANSACTION_SPEED_FAST,
} from './constants'

/**
 * getAmountInSats - Returns amount in sats from an ln invoice or an on-chain transation.
 *
 * @param {number} amount Amount to convert to sats
 * @param {string} cryptoUnit Crypto unit to convert from to sats (e.g., btc to sats)
 * @param {object} [lnInvoice] Optional ln invoice. It will be used first if passed in
 * @returns {number} Amount in sats
 */
export function getAmountInSats(amount, cryptoUnit, lnInvoice) {
  if (lnInvoice) {
    const { satoshis, millisatoshis } = lnInvoice
    return (
      satoshis || convert('msats', 'sats', millisatoshis) || convert(cryptoUnit, 'sats', amount)
    )
  }

  return convert(cryptoUnit, 'sats', amount)
}

/**
 * getFeeRate - Returns fee rate based on speed required.
 *
 * @param {object} onchainFees Object containing fees for different transaction speeds.
 * @param {number} [onchainFees.slow] Fee for slow speed settlement
 * @param {number} [onchainFees.medium] Fee for medium speed settlement
 * @param {number} [onchainFees.fast] Fee for fast speed settlement
 * @param {string} speed Transaction confirmation speed required
 * @returns {number | undefined | null} Transaction fee rate
 */
export function getFeeRate(onchainFees, speed) {
  switch (speed) {
    case TRANSACTION_SPEED_SLOW:
      return get(onchainFees, 'slow', null)
    case TRANSACTION_SPEED_MEDIUM:
      return get(onchainFees, 'medium', null)
    case TRANSACTION_SPEED_FAST:
      return get(onchainFees, 'fast', null)
    default:
      return null
  }
}
