import sb from 'satoshi-bitcoin'

export function btcToSatoshis(btc) {
  if (btc === undefined || btc === null || btc === '') return null

  return sb.toSatoshi(btc)
}

export function satoshisToBtc(satoshis) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  return sb.toBitcoin(satoshis).toFixed(8)
}

export function btcToUsd(btc, price) {
  const amount = parseFloat(btc * price).toFixed(2)
  return (btc > 0 && amount <= 0) ? '< 0.01' : amount.toLocaleString('en')
}

export function satoshisToUsd(satoshis, price) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  return btcToUsd(satoshisToBtc(satoshis), price)
}


export default {
  btcToSatoshis,
  satoshisToBtc,
  satoshisToUsd,
  btcToUsd
}
