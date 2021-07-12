import { createSelector } from 'reselect'

import { networkSelectors } from 'reducers/network'
import { decorateRoute } from 'reducers/payment/utils'

/**
 * @typedef {import('../index').State} State
 */

const routesSelector = state => state.pay.routes
const nodesSelector = state => networkSelectors.nodes(state)

/**
 * routes - Routes relating to current payment probe.
 *
 * @param {State} state Redux state
 * @returns {object} Config overrides
 */
export const routes = createSelector(routesSelector, nodesSelector, (routes, nodes) =>
  routes.map(route => decorateRoute(route, nodes))
)

/**
 * isQueryingFees - Is querying fees.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if fees are being queried
 */
const isQueryingFees = state => state.pay.isQueryingFees

/**
 * isQueryingRoutes - Is querying routes.
 *
 * @param {State} state Redux state
 * @returns {boolean} Boolean indicating if routes are being probed
 */
const isQueryingRoutes = state => state.pay.isQueryingRoutes

/**
 * onchainFees - Onchain fee rates.
 *
 * @param {State} state Redux state
 * @returns {{fast:string|null, medium:string|null, slow:string|null}} Onchain fee rates
 */
const onchainFees = state => state.pay.onchainFees

/**
 * redirectPayReq - Payrequest injected from external source.
 *
 * @param {State} state Redux state
 * @returns {string|null} Payrequest injected from external source
 */
const redirectPayReq = state => state.pay.redirectPayReq

export default {
  isQueryingFees,
  isQueryingRoutes,
  onchainFees,
  redirectPayReq,
  routes,
}
