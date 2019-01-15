/* eslint-disable */

import sb from 'satoshi-bitcoin'

const isEmptyAmount = amount => amount === undefined || amount === null || amount === ''

//////////////////////
// BTC to things /////
/////////////////////
export function btcToBits(btc) {
  if (isEmptyAmount(btc)) return null

  return satoshisToBits(Number(sb.toSatoshi(btc))) || 0
}

export function btcToSatoshis(btc) {
  if (isEmptyAmount(btc)) return null

  return Number(sb.toSatoshi(btc)) || 0
}

export function btcToMillisatoshis(btc) {
  if (isEmptyAmount(btc)) return null

  const satoshiAmount = Number(sb.toSatoshi(btc))
  return satoshisToMillisatoshis(satoshiAmount) || 0
}

export function btcToFiat(btc, price) {
  if (isEmptyAmount(btc)) return null

  return parseFloat(btc * price) || 0
}

////////////////////////////
// bits to things /////////
//////////////////////////

export function bitsToBtc(bits, price) {
  if (isEmptyAmount(bits)) return null
  const sats = bits * 100

  return satoshisToBtc(sats) || 0
}

export function bitsToSatoshis(bits) {
  if (isEmptyAmount(bits)) return null

  return bits * 100 || 0
}

export function bitsToMillisatoshis(bits) {
  if (isEmptyAmount(bits)) return null

  return bits * 100 * 1000 || 0
}

export function bitsToFiat(bits, price) {
  if (isEmptyAmount(bits)) return null
  const sats = bits * 100

  return satoshisToFiat(sats, price) || 0
}

////////////////////////////
// satoshis to things /////
//////////////////////////

export function satoshisToBtc(satoshis) {
  if (isEmptyAmount(satoshis)) return null

  // Make sure we are not passing a non-whole number to sb.toBitcoin(). If the number isn't whole we round up
  const numSats = satoshis % 1 === 0 ? satoshis : Math.ceil(satoshis)

  return sb.toBitcoin(numSats) || 0
}

export function satoshisToBits(satoshis) {
  if (isEmptyAmount(satoshis)) return null

  return satoshis / 100 || 0
}

export function satoshisToMillisatoshis(satoshis) {
  if (isEmptyAmount(satoshis)) return null

  return satoshis * 1000 || 0
}

export function satoshisToFiat(satoshis, price) {
  if (isEmptyAmount(satoshis)) return null

  return btcToFiat(satoshisToBtc(satoshis), price) || 0
}

///////////////////////////////
// millisatoshis to things ////
///////////////////////////////

export function millisatoshisToBtc(msats) {
  if (isEmptyAmount(msats)) return null

  const satoshis = millisatoshisToSatoshis(msats)
  return sb.toBitcoin(satoshis) || 0
}

export function millisatoshisToBits(msats) {
  if (isEmptyAmount(msats)) return null

  const satsAmount = millisatoshisToSatoshis(msats)
  return satoshisToBits(satsAmount) || 0
}

export function millisatoshisToSatoshis(msats) {
  if (isEmptyAmount(msats)) return null

  return msats / 1000 || 0
}

export function millisatoshisToFiat(msats, price) {
  if (isEmptyAmount(msats)) return null

  return btcToFiat(millisatoshisToBtc(msats), price) || 0
}

////////////////////////////
// fiat to things /////
//////////////////////////
//////////////////////////
export function fiatToBtc(fiat, price) {
  if (isEmptyAmount(fiat) || !price) return null

  return Number(fiat / price)
}

export function fiatToBits(fiat, price) {
  return btcToBits(fiatToBtc(fiat, price))
}

export function fiatToSatoshis(fiat, price) {
  const btcAmount = fiatToBtc(fiat, price)
  return btcToSatoshis(btcAmount)
}

export function fiatToMilliSatoshis(fiat, price) {
  const btcAmount = fiatToBtc(fiat, price)
  return btcToMillisatoshis(btcAmount)
}

export function convert(from, to, amount, price) {
  switch (from) {
    case 'btc':
    case 'ltc':
      switch (to) {
        case 'bits':
        case 'phots':
          return btcToBits(amount)
        case 'sats':
        case 'lits':
          return btcToSatoshis(amount)
        case 'msats':
        case 'mlits':
          return btcToMillisatoshis(amount)
        case 'fiat':
          return btcToFiat(amount, price)
        case 'btc':
        case 'ltc':
          return amount
      }
      break
    case 'bits':
    case 'phots':
      switch (to) {
        case 'btc':
        case 'ltc':
          return bitsToBtc(amount)
        case 'sats':
        case 'lits':
          return bitsToSatoshis(amount)
        case 'msats':
        case 'mlits':
          return bitsToMillisatoshis(amount)
        case 'fiat':
          return bitsToFiat(amount, price)
        case 'bits':
        case 'phots':
          return amount
      }
      break
    case 'sats':
    case 'lits':
      switch (to) {
        case 'btc':
        case 'ltc':
          return satoshisToBtc(amount)
        case 'bits':
        case 'phots':
          return satoshisToBits(amount)
        case 'msats':
        case 'mlits':
          return satoshisToMillisatoshis(amount)
        case 'fiat':
          return satoshisToFiat(amount, price)
        case 'sats':
        case 'lits':
          return amount
      }
      break
    case 'msats':
    case 'mlits':
      switch (to) {
        case 'btc':
        case 'ltc':
          return millisatoshisToBtc(amount)
        case 'bits':
        case 'phots':
          return millisatoshisToBits(amount)
        case 'sats':
        case 'lits':
          return millisatoshisToSatoshis(amount)
        case 'fiat':
          return satoshisToFiat(amount, price)
        case 'msats':
        case 'mlits':
          return amount
      }
      break
    case 'fiat':
      switch (to) {
        case 'btc':
        case 'ltc':
          return fiatToBtc(amount, price)
        case 'bits':
        case 'phots':
          return fiatToBits(amount, price)
        case 'sats':
        case 'lits':
          return fiatToSatoshis(amount, price)
        case 'msats':
        case 'mlits':
          return fiatToMilliSatoshis(amount, price)
        case 'fiat':
          return amount
      }
    default:
      return ''
  }
}

export default {
  btcToBits,
  btcToSatoshis,
  btcToMillisatoshis,
  btcToFiat,

  bitsToBtc,
  bitsToSatoshis,
  bitsToMillisatoshis,
  bitsToFiat,

  satoshisToBtc,
  satoshisToBits,
  satoshisToMillisatoshis,
  satoshisToFiat,

  convert
}
