export function formatUsd(usd) {
  return `$${(+usd).toFixed(2)}`
}

export function usdToBtc(usd, rate) {
  if (usd === undefined || usd === null || usd === '') {
    return null
  }

  return (usd / rate).toFixed(8)
}

export default {
  formatUsd,
  usdToBtc
}
