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

export function btcToUsd(btc, price) {
  const amount = parseFloat(btc * price).toFixed(2)
  return (btc > 0 && amount <= 0) ? '< 0.01' : amount.toLocaleString('en')
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

export function bitsToUsd(bits, price) {
  if (bits === undefined || bits === null || bits === '') return null
  const sats = bits * 100

  return satoshisToUsd(sats, price)
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

export function satoshisToUsd(satoshis, price) {
  if (satoshis === undefined || satoshis === null || satoshis === '') return null

  return btcToUsd(satoshisToBtc(satoshis), price)
}

////////////////////////////////
// millisatoshis to satoshis //
////////////////////////////// 

export function millisatoshisToSatoshis(millisatoshis) {
  if (millisatoshis === undefined || millisatoshis === null || millisatoshis === '') return null

  return Math.round(millisatoshis / 1000)
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
        case 'usd':
          return btcToUsd(amount, price)
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
        case 'usd':
          return bitsToUsd(amount, price)
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
        case 'usd':
          return satoshisToUsd(amount, price)
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
  btcToUsd,

  bitsToBtc,
  bitsToSatoshis,
  bitsToUsd,

  satoshisToBtc,
  satoshisToBits,
  satoshisToUsd,

  millisatoshisToSatoshis,

  renderCurrency,

  convert
}
