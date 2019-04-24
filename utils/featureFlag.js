import config from 'config'

export function isAutopayEnabled() {
  return config.features.autopay
}
