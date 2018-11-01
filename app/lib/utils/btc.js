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

  // Make sure we are not passing a non-whole number to sb.toBitcoin(). If the number isn't whole we round up
  const numSats = satoshis % 1 === 0 ? satoshis : Math.ceil(satoshis)

  const btcAmount = sb.toBitcoin(numSats).toFixed(8)
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

////////////////////////////
// fiat to things /////
//////////////////////////
//////////////////////////
export function fiatToBtc(fiat, price) {
  if (fiat === undefined || fiat === null || fiat === '' || !price) return null

  return Number(fiat / price)
}

export function fiatToBits(fiat, price) {
  return btcToBits(fiatToBtc(fiat, price))
}

export function fiatToSatoshis(fiat, price) {
  return btcToSatoshis(fiatToBtc(fiat, price))
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
    case 'fiat':
      switch (to) {
        case 'btc':
          return fiatToBtc(amount, price)
        case 'bits':
          return fiatToBits(amount, price)
        case 'sats':
          return fiatToSatoshis(amount, price)
        case 'fiat':
          return amount
      }
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
