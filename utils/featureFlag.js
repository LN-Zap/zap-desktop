import config from 'config'

/**
 * isAutopayEnabled - Check if autopay feature is enabled.
 *
 * @returns {boolean} Boolean indicating wether autopay is enabled
 */
export function isAutopayEnabled() {
  return config.features.autopay
}

/**
 * isMainnetAsDefault - Check if default network is mainnet.
 *
 * @returns {boolean}  Boolean indicating wether default network is mainnet
 */
export function isMainnetAsDefault() {
  return config.network === 'mainnet'
}

/**
 * isMainnetAutopilot - Check if mainet autopilot feature is enabled.
 *
 * @returns {boolean}  Boolean indicating wether onboarding autopilot selection is enabled for mainnet
 */
export function isMainnetAutopilot() {
  return config.features.mainnetAutopilot
}

/**
 * isNetworkSelectionEnabled - Check if network selection feature is enabled.
 *
 * @returns {boolean}  Boolean indicating wether onboarding network selection is enabled
 */
export function isNetworkSelectionEnabled() {
  return config.features.networkSelection
}

/**
 * isSCBRestoreEnabled - Check if SCB restore feature is enabled.
 *
 * @export
 * @returns
 */
export function isSCBRestoreEnabled() {
  return config.features.scbRestore
}
