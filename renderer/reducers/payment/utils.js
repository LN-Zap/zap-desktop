import { chanNumber } from 'bolt07'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'

import { getIntl } from '@zap/i18n'
import { convert } from '@zap/utils/btc'
import {
  getTag,
  decodePayReq,
  getNodeAlias,
  generatePreimage,
  generateProbeHash,
} from '@zap/utils/crypto'
import { sha256digest } from '@zap/utils/sha256'
import truncateNodePubkey from '@zap/utils/truncateNodePubkey'

import { DEFAULT_CLTV_DELTA, KEYSEND_PREIMAGE_TYPE } from './constants'
import messages from './messages'

/**
 * decoratePayment - Decorate payment object with custom/computed properties.
 *
 * @param {object} payment Payment
 * @param {Array} nodes Nodes
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

  // Convert the payment hash to a hex string.
  if (!payment.paymentHash) {
    decoration.paymentHash = payment.rHash && Buffer.from(payment.rHash, 'hex').toString('hex')
  }

  // Keysend payments will have destination pubkey set here.
  let pubkey = payment.dest
  // First try to get the pubkey from payment.htlcs list (lnd 0.9+)
  // Fallback to looking in the legacy payment.path property.
  if (payment.htlcs) {
    const hops = get(payment, 'htlcs[0].route.hops', [])
    const lasthop = hops[hops.length - 1]
    if (lasthop) {
      pubkey = lasthop.pubKey
    }
  } else if (payment.path) {
    pubkey = payment.path[payment.path.length - 1]
  }

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

  // Try to add some info about the nodes involved in payment htlcs.
  if (payment.htlcs) {
    decoration.htlcs = decorateHtlcs(payment.htlcs, nodes)
  }

  return {
    ...payment,
    ...decoration,
  }
}

/**
 * decorateHtlcs - Decorate htlcs list with custom/computed properties.
 *
 * @param {object[]} htlcs Htlcs
 * @param {object[]} nodes Nodes
 * @returns {object} Decorated htlcs
 */
export const decorateHtlcs = (htlcs, nodes = []) => {
  const decoratedHtlcs = cloneDeep(htlcs)
  decoratedHtlcs.map(htlc => {
    htlc.route = decorateRoute(htlc.route, nodes)
    return htlc
  })
  return decoratedHtlcs
}

/**
 * decorateRoute - Decorate route object with custom/computed properties.
 *
 * @param {object} route Route
 * @param {object[]} nodes Nodes
 * @returns {object} Decorated route
 */
export const decorateRoute = (route, nodes = []) => {
  const decoratedRoute = cloneDeep(route)
  decoratedRoute.hops = decoratedRoute.hops.map(hop => {
    hop.alias = getNodeAlias(hop.pubKey, nodes)
    return hop
  })
  return decoratedRoute
}

/**
 * prepareKeysendPayload - Prepare a keysend payment.
 *
 * @param {string} pubkey Pubkey
 * @param {number} amt Amount in satoshi
 * @param {number} feeLimit Fee limit (sats)
 * @returns {object} Keysnd payment payload
 */
export const prepareKeysendPayload = (pubkey, amt, feeLimit) => {
  const preimage = generatePreimage()

  return {
    dest: Buffer.from(pubkey, 'hex'),
    feeLimitSat: feeLimit,
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
 * @param {string} payReq Payment request
 * @param {number} amt Amount in satoshi
 * @param {number} feeLimit Fee limit (sats)
 * @returns {object} Bolt11 payment payload
 */
export const prepareBolt11Payload = (payReq, amt, feeLimit) => {
  const invoice = decodePayReq(payReq)
  const { millisatoshis } = invoice

  return {
    paymentRequest: invoice.paymentRequest,
    feeLimitSat: feeLimit,
    amt: millisatoshis ? null : amt,
  }
}

/**
 * prepareKeysendProbe - Prepare a keysend probe.
 *
 * @param {string} pubkey Pubkey
 * @param {number} amt Amount in satoshi
 * @param {number} feeLimit Fee limit (sats)
 * @returns {object} Keysend probe payload
 */
export const prepareKeysendProbe = (pubkey, amt, feeLimit) => {
  const preimage = generatePreimage()

  return {
    dest: Buffer.from(pubkey, 'hex'),
    feeLimitSat: feeLimit,
    amt,
    finalCltvDelta: DEFAULT_CLTV_DELTA,
    paymentHash: sha256digest(preimage),
    destCustomRecords: {
      [KEYSEND_PREIMAGE_TYPE]: preimage,
    },
  }
}

/**
 * prepareBolt11Probe - Prepare a bolt11 probe.
 *
 * @param {string} payReq Payment request
 * @param {number} feeLimit Fee limit (sats)
 * @returns {object} Bolt11 probe payload
 */
export const prepareBolt11Probe = (payReq, feeLimit) => {
  const invoice = decodePayReq(payReq)
  const { millisatoshis, payeeNodeKey: pubkey } = invoice

  // Extract route hints from the invoice.
  const routingInfo = getTag(invoice, 'routing_info') || []
  const paymentHash = getTag(invoice, 'payment_hash')
  const paymentAddress = getTag(invoice, 'payment_secret')

  const hopHints = routingInfo.map(hint => ({
    nodeId: hint.pubkey,
    chanId: chanNumber({ id: hint.short_channel_id }).number,
    feeBaseMsat: hint.fee_base_msat,
    feeProportionalMillionths: hint.fee_proportional_millionths,
    cltvExpiryDelta: hint.cltv_expiry_delta,
  }))

  return {
    dest: Buffer.from(pubkey, 'hex'),
    feeLimitSat: feeLimit,
    amtMsat: millisatoshis,
    finalCltvDelta: getTag(invoice, 'min_final_cltv_expiry') || DEFAULT_CLTV_DELTA,
    routeHints: [{ hopHints }],
    paymentHash: generateProbeHash(paymentHash),
    paymentAddr: paymentAddress && Buffer.from(paymentAddress, 'hex'),
  }
}

/**
 * getDisplayNodeName - Given a payment object devise the most appropriate display name.
 *
 * @param {object} payment Payment
 * @returns {string} Display name
 */
export const getDisplayNodeName = payment => {
  const { destNodeAlias, destNodePubkey, alias, pubKey } = payment
  if (destNodeAlias || alias) {
    return destNodeAlias || alias
  }
  if (destNodePubkey || pubKey) {
    return truncateNodePubkey(destNodePubkey || pubKey)
  }

  // If all else fails, return the string 'unknown'.
  const intl = getIntl()
  return intl.formatMessage({ ...messages.unknown })
}

/**
 * errorCodeToMessage - Convert an error code to an error message.
 *
 * @param {string} code Error code
 * @returns {string|null} error message
 */
export const errorCodeToMessage = code => {
  const intl = getIntl()
  const msg = messages[code.toLowerCase()]
  return msg ? intl.formatMessage({ ...msg }) : null
}
