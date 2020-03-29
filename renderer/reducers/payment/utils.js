import { decodePayReq, getNodeAlias } from '@zap/utils/crypto'
import { convert } from '@zap/utils/btc'

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
