import config from 'config'

export function isAutopayEnabled() {
  return config.features.autopay
}

export function isMainnetAsDefault() {
  return config.network === 'mainnet'
}

export function isMainnetAutopilot() {
  return config.features.mainnetAutopilot
}
