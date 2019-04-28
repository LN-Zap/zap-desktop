import config from 'config'

export function isAutopayEnabled() {
  return config.features.autopay
}

export function isMainnetAsDefault() {
  return config.network === 'mainnet'
}

/**
 * enables/disables mainnet lnd autopilot setting selection
 * if false, autopilot selection won't be available
 */
export function isMainnetAutopilot() {
  return config.features.mainnetAutopilot
}

export function isNetworkSelectionEnabled() {
  return config.features.networkSelection
}
