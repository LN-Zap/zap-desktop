import { createSelector } from 'reselect'

import { networkSelectors } from 'reducers/network'

import { decoratePayment } from './utils'

const paymentsSelector = state => state.payment.payments
const paymentsSendingSelector = state => state.payment.paymentsSending
const nodesSelector = state => networkSelectors.nodes(state)

/**
 * payments - All payments.
 */
export const payments = createSelector(paymentsSelector, nodesSelector, (p, nodes) =>
  p.map(payment => decoratePayment(payment, nodes))
)

/**
 * paymentsSending - Payments in the process of sending or recently sent.
 */
export const paymentsSending = createSelector(paymentsSendingSelector, nodesSelector, (ps, nodes) =>
  ps.map(payment => decoratePayment(payment, nodes))
)

export default {
  payments,
  paymentsSending,
}
