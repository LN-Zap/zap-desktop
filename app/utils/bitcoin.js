import sb from 'satoshi-bitcoin'

export function btcToSatoshis(btc) {
	if (btc == undefined || btc === '') return

  return sb.toSatoshi(btc)
}

export function satoshisToBtc(satoshis) {
  if (satoshis == undefined || satoshis === '') return

  return sb.toBitcoin(satoshis).toFixed(8)
}

export function satoshisToUsd(satoshis, price) {
  if (satoshis == undefined || satoshis === '') return

  return btcToUsd(satoshisToBtc(satoshis), price)
}

export function btcToUsd(btc, price) {
	return parseFloat((btc * price).toFixed(2)).toLocaleString('en')
}