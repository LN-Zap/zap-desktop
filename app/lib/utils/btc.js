/* eslint-disable */

import sb from 'satoshi-bitcoin'

//////////////////////
// BTC to things /////
/////////////////////
export function btcToSatoshis(btc) {
  if (btc === undefined || btc === null || btc === '') return null

  return sb.toSatoshi(btc)
}

export function btcToBits(btc) {
  if (btc === undefined || btc === null || btc === '') return null

  return satoshisToBits(sb.toSatoshi(btc))
}

export function btcToFiat(btc, price) {
  if (btc === undefined || btc === null || btc === '') return null

  return parseFloat(btc * price)
}

////////////////////////////
// bits to things /////////
//////////////////////////

export function bitsToBtc(bits, price) {
  if (bits === undefined || bits === null || bits === '') return null
  const sats = bits * 100

  return satoshisToBtc(sats, price)
}

export function bitsToSatoshis(bits, price) {
  if (bits === undefined || bits === null || bits === '') return null

  return bits * 100
}

export function bitsToFiat(bits, price) {
  if (bits === undefined || bits === null || bits === '') return null
  const sats = bits * 100

  return satoshisToFiat(sats, price)
}

////////////////////////////
// satoshis to things /////
//////////////////////////

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

export function satoshisToFiat(satoshis, price) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  return btcToFiat(satoshisToBtc(satoshis), price)
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

export function convert(from, to, amount, price) {
  switch (from) {
    case 'btc':
      switch (to) {
        case 'bits':
          return btcToBits(amount)
        case 'sats':
          return btcToSatoshis(amount)
        case 'fiat':
          return btcToFiat(amount, price)
        case 'btc':
          return amount
      }
      break
    case 'bits':
      switch (to) {
        case 'btc':
          return bitsToBtc(amount)
        case 'sats':
          return bitsToSatoshis(amount)
        case 'fiat':
          return bitsToFiat(amount, price)
        case 'bits':
          return amount
      }
      break
    case 'sats':
      switch (to) {
        case 'btc':
          return satoshisToBtc(amount)
        case 'bits':
          return satoshisToBits(amount)
        case 'fiat':
          return satoshisToFiat(amount, price)
        case 'sats':
          return amount
      }
      break
    default:
      return ''
  }
}

export default {
  btcToSatoshis,
  btcToBits,
  btcToFiat,

  bitsToBtc,
  bitsToSatoshis,
  bitsToFiat,

  satoshisToBtc,
  satoshisToBits,
  satoshisToFiat,

  renderCurrency,

  convert
}
