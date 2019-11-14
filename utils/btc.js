/* eslint-disable curly */
import Coin, { CoinBig } from '@zap/utils/coin'

const isEmptyAmount = amount => amount === undefined || amount === null || amount === ''

// ------------------------------------
// BTC to things
// ------------------------------------

/**
 * btcToBits - Convert btc to bits.
 *
 * @param  {string|number} btc Amount in btc
 * @returns {string} Amount in bits
 */
export function btcToBits(btc) {
  if (isEmptyAmount(btc)) return null

  return Coin(btc)
    .multiply(1000000)
    .toString()
}

/**
 * btcToSatoshis - Convert btc to satoshis.
 *
 * @param  {string|number} btc Amount in btc
 * @returns {string} Amount in satoshis
 */
export function btcToSatoshis(btc) {
  if (isEmptyAmount(btc)) return null

  return Coin(btc)
    .multiply(100000000)
    .toString()
}

/**
 * btcToMillisatoshis - Convert btc to millisatoshis.
 *
 * @param  {string|number} btc Amount in btc
 * @returns {string} Amount in millisatoshis
 */
export function btcToMillisatoshis(btc) {
  if (isEmptyAmount(btc)) return null

  return Coin(btc, 11)
    .multiply(100000000000)
    .toString()
}

/**
 * btcToFiat - Convert btc to fiat.
 *
 * @param  {string|number} btc Amount in btc
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in fiat
 */
export function btcToFiat(btc, price) {
  if (isEmptyAmount(btc)) return null

  return Coin(btc)
    .multiply(price)
    .toPrecision(2)
    .toString()
}

// ------------------------------------
// Bits to things
// ------------------------------------

/**
 * bitsToBtc - Convert bits to btc.
 *
 * @param  {string|number} bits Amount in bits
 * @returns {string} Amount in btc
 */
export function bitsToBtc(bits) {
  if (isEmptyAmount(bits)) return null

  const btc = CoinBig(bits).dividedBy(1000000)
  return Coin(btc).toString()
}

/**
 * bitsToSatoshis - Convert bits to satoshis.
 *
 * @param  {string|number} bits Amount in bits
 * @returns {string} Amount in satoshis
 */
export function bitsToSatoshis(bits) {
  if (isEmptyAmount(bits)) return null

  const btc = bitsToBtc(bits)
  return btcToSatoshis(btc)
}

/**
 * bitsToMillisatoshis - Convert bits to msats.
 *
 * @param  {string|number} bits Amount in msats
 * @returns {string} Amount in msats
 */
export function bitsToMillisatoshis(bits) {
  if (isEmptyAmount(bits)) return null

  return CoinBig(bits)
    .multipliedBy(100000)
    .toString()
}

/**
 * bitsToFiat - Convert bits to fiat.
 *
 * @param  {string|number} bits Amount in bits
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in fiat
 */
export function bitsToFiat(bits, price) {
  if (isEmptyAmount(bits)) return null

  const btc = bitsToBtc(bits)
  return btcToFiat(btc, price)
}

// ------------------------------------
// Satoshi to things
// ------------------------------------

/**
 * satoshisToBtc - Convert satoshis to btc.
 *
 * @param  {string|number} satoshis Amount in satoshis
 * @returns {string} Amount in btc
 */
export function satoshisToBtc(satoshis) {
  if (isEmptyAmount(satoshis)) return null

  const btc = CoinBig(satoshis).dividedBy(100000000)
  return Coin(btc).toString()
}

/**
 * satoshisToBits - Convert satoshis to bits.
 *
 * @param  {string|number} satoshis Amount in satoshis
 * @returns {string} Amount in bits
 */
export function satoshisToBits(satoshis) {
  if (isEmptyAmount(satoshis)) return null

  const btc = satoshisToBtc(satoshis)
  return btcToBits(btc)
}

/**
 * satoshisToMillisatoshis - Convert satoshis to msats.
 *
 * @param  {string|number} satoshis Amount in satoshis
 * @returns {string} Amount in msats
 */
export function satoshisToMillisatoshis(satoshis) {
  if (isEmptyAmount(satoshis)) return null

  const btc = satoshisToBtc(satoshis)
  return btcToMillisatoshis(btc)
}

/**
 * satoshisToFiat - convert satoshis to fiat.
 *
 * @param  {string|number} satoshis Amount in satoshis
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in fiat
 */
export function satoshisToFiat(satoshis, price) {
  if (isEmptyAmount(satoshis)) return null

  const btc = satoshisToBtc(satoshis)
  return btcToFiat(btc, price) || 0
}

// ------------------------------------
// Millisatoshi to things
// ------------------------------------

/**
 * millisatoshisToBtc - Convert msats to btc.
 *
 * @param  {string|number} msats Amount in msats
 * @returns {string} Amount in btc
 */
export function millisatoshisToBtc(msats) {
  if (isEmptyAmount(msats)) return null

  const btc = CoinBig(msats).dividedBy(100000000000)
  return Coin(btc).toString()
}

/**
 * millisatoshisToBits - Convert msats to bits.
 *
 * @param  {string|number} msats Amount in msats
 * @returns {string} Amount in bits
 */
export function millisatoshisToBits(msats) {
  if (isEmptyAmount(msats)) return null

  const btc = millisatoshisToBtc(msats)
  return btcToBits(btc)
}

/**
 * millisatoshisToSatoshis - Convert msats to satoshis.
 *
 * @param  {string|number} msats Amount in msats
 * @returns {string} Amount in satoshis
 */
export function millisatoshisToSatoshis(msats) {
  if (isEmptyAmount(msats)) return null

  const btc = millisatoshisToBtc(msats)
  return btcToSatoshis(btc)
}

/**
 * millisatoshisToFiat - convert msats to fiat.
 *
 * @param  {string|number} msats Amount in msats
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in fiat
 */
export function millisatoshisToFiat(msats, price) {
  if (isEmptyAmount(msats)) return null

  const btc = millisatoshisToBtc(msats)
  return btcToFiat(btc, price) || 0
}

// ------------------------------------
// Fiat to things
// ------------------------------------

/**
 * fiatToBtc - Convert fiat to btc.
 *
 * @param  {string|number} fiat Amount in fiat
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in btc
 */
export function fiatToBtc(fiat, price) {
  if (isEmptyAmount(fiat) || !price) return null

  return CoinBig(fiat)
    .dividedBy(CoinBig(price))
    .toString()
}

/**
 * fiatToBtc - Convert fiat to bits.
 *
 * @param  {string|number} fiat Amount in fiat
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in bits
 */
export function fiatToBits(fiat, price) {
  const btc = fiatToBtc(fiat, price)
  return btcToBits(btc)
}

/**
 * fiatToBtc - Convert fiat to satoshis.
 *
 * @param  {string|number} fiat Amount in fiat
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in satoshis
 */
export function fiatToSatoshis(fiat, price) {
  const btc = fiatToBtc(fiat, price)
  return btcToSatoshis(btc)
}

/**
 * fiatToBtc - Convert fiat to msats.
 *
 * @param  {string|number} fiat Amount in fiat
 * @param  {string|number} price Exchange rate
 * @returns {string} Amount in msats
 */
export function fiatToMilliSatoshis(fiat, price) {
  const btc = fiatToBtc(fiat, price)
  return btcToMillisatoshis(btc)
}

/**
 * convert - Convert between units.
 *
 * @param  {'btc|bits|sats|msats|fiat'} from Base unit
 * @param  {'btc|bits|sats|msats|fiat'} to Target unit
 * @param  {string|number} amount Amount in base unit
 * @param  {string|number} price Exchange rate (used for fiat conversions)
 * @returns {string} Amount in target unit
 */
export function convert(from, to, amount, price) {
  switch (from) {
    case 'btc':
      switch (to) {
        case 'bits':
          return btcToBits(amount)
        case 'sats':
          return btcToSatoshis(amount)
        case 'msats':
          return btcToMillisatoshis(amount)
        case 'fiat':
          return btcToFiat(amount, price)
        case 'btc':
          return CoinBig(amount).toString()
        default:
          return undefined
      }

    case 'bits':
      switch (to) {
        case 'btc':
          return bitsToBtc(amount)
        case 'sats':
          return bitsToSatoshis(amount)
        case 'msats':
          return bitsToMillisatoshis(amount)
        case 'fiat':
          return bitsToFiat(amount, price)
        case 'bits':
          return CoinBig(amount).toString()
        default:
          return undefined
      }

    case 'sats':
      switch (to) {
        case 'btc':
          return satoshisToBtc(amount)
        case 'bits':
          return satoshisToBits(amount)
        case 'msats':
          return satoshisToMillisatoshis(amount)
        case 'fiat':
          return satoshisToFiat(amount, price)
        case 'sats':
          return CoinBig(amount).toString()
        default:
          return undefined
      }

    case 'msats':
      switch (to) {
        case 'btc':
          return millisatoshisToBtc(amount)
        case 'bits':
          return millisatoshisToBits(amount)
        case 'sats':
          return millisatoshisToSatoshis(amount)
        case 'fiat':
          return millisatoshisToFiat(amount, price)
        case 'msats':
          return CoinBig(amount).toString()
        default:
          return undefined
      }

    case 'fiat':
      switch (to) {
        case 'btc':
          return fiatToBtc(amount, price)
        case 'bits':
          return fiatToBits(amount, price)
        case 'sats':
          return fiatToSatoshis(amount, price)
        case 'msats':
          return fiatToMilliSatoshis(amount, price)
        case 'fiat':
          return CoinBig(amount).toString()
        default:
          return undefined
      }

    default:
      return undefined
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

  millisatoshisToBtc,
  millisatoshisToBits,
  millisatoshisToSatoshis,
  millisatoshisToFiat,

  convert,
}
