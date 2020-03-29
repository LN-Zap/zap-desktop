import config from 'config'
import { decodePayReq, getNodeAlias, getTag, generatePreimage } from '@zap/utils/crypto'
import { convert } from '@zap/utils/btc'
import { getIntl } from '@zap/i18n'
import { sha256digest } from '@zap/utils/sha256'
import truncateNodePubkey from '@zap/utils/truncateNodePubkey'
import { DEFAULT_CLTV_DELTA, KEYSEND_PREIMAGE_TYPE } from './constants'
import messages from './messages'

const PAYMENT_TIMEOUT = config.invoices.paymentTimeout

/**
 * decoratePayment - Decorate payment object with custom/computed properties.
 *
 * @param  {object} payment Payment
 * @param  {Array} nodes Nodes
 * @returns {object} Decorated payment
 */
export const decoratePayment = (payment, nodes = []) => {
  // Add basic type information.
  const decoration = {
    type: 'payment',
  }

  // Older versions of lnd provided the sat amount in `value`.
  // This is now deprecated in favor of `valueSat` and `valueMsat`.
  // Patch data returned from older clients to match the current format for consistency.
  const { value } = payment
  if (value && (!payment.valueSat || !payment.valueMsat)) {
    Object.assign(decoration, {
      valueSat: value,
      valueMsat: convert('sats', 'msats', value),
    })
  }

  // Convert the preimage to a hex string.
  if (!payment.paymentPreimage) {
    decoration.paymentPreimage =
      payment.rPreimage && Buffer.from(payment.rPreimage, 'hex').toString('hex')
  }

  // Convert the preimage to a hex string.
  if (!payment.paymentHash) {
    decoration.paymentHash = payment.rHash && Buffer.from(payment.rHash, 'hex').toString('hex')
  }

  // First try to get the pubkey from payment.path
  let pubkey = payment.path && payment.path[payment.path.length - 1]

  // If we don't have a pubkey, try to get it from the payment request.
  if (!pubkey && payment.paymentRequest) {
    const paymentRequest = decodePayReq(payment.paymentRequest)
    pubkey = paymentRequest.payeeNodeKey
  }

  // Try to add some info about the destination of the payment.
  if (pubkey) {
    Object.assign(decoration, {
      destNodePubkey: pubkey,
      destNodeAlias: getNodeAlias(pubkey, nodes),
    })
  }

  return {
    ...payment,
    ...decoration,
  }
}

/**
 * getPaymentConfig - Get common payment settings.
 *
 * @returns {object} common payment settings
 */
export const getPaymentConfig = () => {
  return {
    allowSelfPayment: true,
    timeoutSeconds: PAYMENT_TIMEOUT,
  }
}

/**
 * prepareKeysendPayload - Prepare a keysend payment.
 *
 * @param  {string} pubkey   Pubkey
 * @param  {number} amt      Amount in satoshi
 * @param  {number} feeLimit Fee limit (sats)
 * @returns {object} Keysnd payment
 */
export const prepareKeysendPayload = (pubkey, amt, feeLimit) => {
  const preimage = generatePreimage()

  return {
    ...getPaymentConfig(),
    dest: Buffer.from(pubkey, 'hex'),
    feeLimit: feeLimit ? { fixed: feeLimit } : null,
    paymentHash: sha256digest(preimage),
    amt,
    finalCltvDelta: DEFAULT_CLTV_DELTA,
    destCustomRecords: {
      [KEYSEND_PREIMAGE_TYPE]: preimage,
    },
  }
}

/**
 * prepareKeysendPayload - Prepare a bolt11 payment.
 *
 * @param  {string} payReq   Payment request
 * @param  {number} amt      Amount in satoshi
 * @param  {number} feeLimit Fee limit (sats)
 * @returns {object} bolt11 payment
 */
export const prepareBolt11Payload = (payReq, amt, feeLimit) => {
  const invoice = decodePayReq(payReq)
  const { millisatoshis } = invoice

  return {
    ...getPaymentConfig(),
    paymentRequest: invoice.paymentRequest,
    paymentHash: getTag(invoice, 'payment_hash'), // hash is not needed in the payload but store for convienience.
    feeLimit: feeLimit ? { fixed: feeLimit } : null,
    amt: millisatoshis ? null : amt,
  }
}

/**
 * getDisplayNodeName - Given a payment object devise the most appropriate display name.
 *
 * @param  {object} payment Payment
 * @returns {string} Display name
 */
export const getDisplayNodeName = payment => {
  const { destNodeAlias, destNodePubkey } = payment
  if (destNodeAlias) {
    return destNodeAlias
  }
  if (destNodePubkey) {
    return truncateNodePubkey(destNodePubkey)
  }

  // If all else fails, return the string 'unknown'.
  const intl = getIntl()
  return intl.formatMessage({ ...messages.unknown })
}
