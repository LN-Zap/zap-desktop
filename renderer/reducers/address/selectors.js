import { createSelector } from 'reselect'
import { settingsSelectors } from '../settings'

export const addressesLoading = state => state.address.addressesLoading
export const currentAddresses = state => state.address.addresses
export const currentConfig = state => settingsSelectors.currentConfig(state)
export const currentAddress = createSelector(
  currentAddresses,
  currentConfig,
  (adresses, config) => adresses[config.address]
)
export const isAddressLoading = createSelector(
  addressesLoading,
  currentConfig,
  (adresses, config) => adresses[config.address]
)

export default {
  addressesLoading,
  currentAddress,
  currentAddresses,
  currentConfig,
  isAddressLoading,
}
