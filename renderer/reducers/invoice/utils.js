import { convert } from '@zap/utils/btc'

/**
 * @typedef {import('./reducer').Invoice} Invoice
 */

/**
 * @typedef {object} Decoration Invoice decorated with additional useful properties.
 * @property {'invoice'} type Activity type
 * @property {number} expiryDate Expiry date
 * @property {boolean} isExpired Boolean indicating if the invoice is expired
 * @property {boolean} isCancelled Boolean indicating if the invoice is cancelled
 * @property {boolean} isHoldInvoice Boolean indicating if the invoice is a Hold invoice
 * @property {boolean} isSettled Boolean indicating if the invoice is settled
 * @property {string} finalAmount Actual amount paid against the invoice
 * @property {string} amtPaidSat Actual amount paid against the invoice in satoshi
 * @property {string} amtPaidMsat Actual amount paid against the invoice in milisatoshi
 * /
 
/**
 * @typedef {Invoice & Decoration} DecoratedInvoice
 */

/**
 * decorateInvoice - Decorate invoice object with custom/computed properties.
 *
 * @param {Invoice} invoice Invoice
 * @returns {DecoratedInvoice} Decorated invoice
 */
export const decorateInvoice = invoice => {
  const { amtPaid, creationDate, value, expiry, rPreimage } = invoice
  let { amtPaidSat, amtPaidMsat } = invoice

  // Older versions of lnd provided the sat amount in `value`.
  // This is now deprecated in favor of `valueSat` and `valueMsat`.
  // Patch data returned from older clients to match the current format for consistency.
  if (amtPaid && (!amtPaidSat || !amtPaidMsat)) {
    amtPaidSat = amtPaid
    amtPaidMsat = convert('sats', 'msats', amtPaid)
  }

  const finalAmount = amtPaidSat && amtPaidSat !== '0' ? amtPaidSat : value

  // Add an `isExpired` prop which shows whether the invoice is expired or not.
  const expiryDate = parseInt(creationDate, 10) + parseInt(expiry, 10)
  const isExpired = expiryDate < Math.round(Date.now() / 1000)

  // Older versions of lnd provided the settled state in `settled`
  // This is now deprecated in favor of `state=SETTLED
  // Add an `isSettled` prop  which shows whether the invoice is settled or not.
  const isSettled = invoice.state ? invoice.state === 'SETTLED' : invoice.settled

  const isCancelled = invoice.state === 'CANCELED'

  // Hold invoices do not have a preimage.
  const isHoldInvoice = rPreimage.length === 0

  /** @type {DecoratedInvoice} */
  return {
    ...invoice,
    type: 'invoice',
    expiryDate,
    isSettled,
    isExpired,
    isCancelled,
    isHoldInvoice,
    finalAmount,
    amtPaidSat,
    amtPaidMsat,
  }
}
