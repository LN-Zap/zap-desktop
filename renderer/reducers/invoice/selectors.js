import { createSelector } from 'reselect'

import { decorateInvoice } from './utils'

/**
 * @typedef {import('../index').State} State
 * @typedef {import('./reducer').Invoice} Invoice
 */

/**
 * invoicesSelector - List of invoices.
 *
 * @param {State} state Redux state
 * @returns {Invoice[]} List of invoices
 */
const invoicesSelector = state => state.invoice.invoices

/**
 * isInvoiceCancelling - Invoice cancellation status.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if invoice is being cancelled.
 */
const isInvoiceCancelling = state => state.invoice.isInvoiceCancelling

/**
 * isInvoiceCreating - Invoices loading status.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if invoices are loading.
 */
const isInvoiceCreating = state => state.invoice.isInvoiceCreating

/**
 * isInvoiceSettling - Invoice cancellation status.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if invoice is being settled.
 */
const isInvoiceSettling = state => state.invoice.isInvoiceSettling

/**
 * settleInvoiceError - Settle invoice error.
 *
 * @param {State} state Redux state
 * @returns {string|null} Error from settling invoice.
 */
const settleInvoiceError = state => state.invoice.settleInvoiceError

/**
 * invoices - List of decorated invoices.
 *
 * @param {State} state Redux state
 * @returns {Invoice[]} List of decorated invoices
 */
const invoices = createSelector(invoicesSelector, item => item.map(decorateInvoice))

export default {
  invoices,
  isInvoiceCancelling,
  isInvoiceSettling,
  isInvoiceCreating,
  settleInvoiceError,
}
