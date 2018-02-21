import sb from 'satoshi-bitcoin'

export function btcToSatoshis(btc) {
  if (btc === undefined || btc === null || btc === '') return null

  return sb.toSatoshi(btc)
}

export function satoshisToBtc(satoshis) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  const btcAmount = sb.toBitcoin(satoshis).toFixed(8)
  return btcAmount > 0 ? btcAmount : btcAmount * -1
}

export function satoshisToBits(satoshis) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  const bitsAmount = satoshis / 100
  return bitsAmount > 0 ? bitsAmount : bitsAmount * -1
}

export function btcToUsd(btc, price) {
  const amount = parseFloat(btc * price).toFixed(2)
  return (btc > 0 && amount <= 0) ? '< 0.01' : amount.toLocaleString('en')
}

export function satoshisToUsd(satoshis, price) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  return btcToUsd(satoshisToBtc(satoshis), price)
}

export function renderCurrency(currency) {
  switch (currency) {
    case 'btc':
      return 'BTC'
    case 'bits':
      return 'bits'
    case 'sats':
      return 'satoshis'
    default:
      return 'satoshis'
  }  
}

export default {
  btcToSatoshis,
  satoshisToBtc,
  satoshisToBits,
  satoshisToUsd,
  btcToUsd,
  renderCurrency
}
