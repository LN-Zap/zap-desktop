export function usdToBtc(usd, rate) {
  if (usd === undefined || usd === '') return null

  return (usd / rate).toFixed(8)
}

export default {
  usdToBtc
}
