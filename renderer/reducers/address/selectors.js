import { createSelector } from 'reselect'

import { settingsSelectors } from 'reducers/settings'

/**
 * @typedef {import('../index').State} State
 */

/**
 * currentConfigSelector - Current config.
 *
 * @param {State} state Redux state
 * @returns {object} Config.
 */
export const currentConfigSelector = state => settingsSelectors.currentConfig(state)

/**
 * addressesLoadingSelector - Details of addresses loading.
 *
 * @param {State} state Redux state
 * @returns {object<string, boolean>} Details of address that are loading
 */
export const addressesLoadingSelector = state => state.address.addressesLoading

/**
 * currentAddresses - Current addresses.
 *
 * @param {State} state Redux state
 * @returns {object<string, string|null>} List of current addresses
 */
export const currentAddresses = state => state.address.addresses

/**
 * currentAddress - Current address of default address type.
 */
export const currentAddress = createSelector(
  currentAddresses,
  currentConfigSelector,
  (adresses, config) => adresses[config.address]
)

/**
 * isAddressLoading - Boolean indicating if default address type is loading.
 */
export const isAddressLoading = createSelector(
  addressesLoadingSelector,
  currentConfigSelector,
  (adresses, config) => adresses[config.address]
)

export default {
  currentAddresses,
  isAddressLoading,
  currentAddress,
}
