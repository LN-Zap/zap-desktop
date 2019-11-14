// Adapted from from https://www.npmjs.com/package/@popenkomaksim/coinmath

import BigNumber from 'bignumber.js'

const PRECISION = 8
const getCurrencyPrecision = code => {
  switch (code) {
    case 'CHF':
    case 'EUR':
    case 'GBP':
    case 'JPY':
    case 'PLN':
    case 'LTL':
    case 'SEK':
    case 'SKK':
    case 'UAH':
    case 'USD':
      return 2
    default:
      return PRECISION
  }
}

// create own constructor to have separate config
export const CoinBig = BigNumber.clone()

CoinBig.config({
  DECIMAL_PLACES: PRECISION,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  EXPONENTIAL_AT: 1e+9 // prettier-ignore
})

/**
 * @param {number|string|Coin|BigNumber} value Value
 * @param {number} precision Decimal precision
 * @returns {Coin} Coin instance
 * @class
 */
function Coin(value, precision) {
  if (!(this instanceof Coin)) {
    return new Coin(value, precision)
  }
  const p = precision || PRECISION
  const big = CoinBig(value).decimalPlaces(p)

  /**
   *
   * @param {number|string|Coin} v Value
   * @returns {Coin} Coin instance
   */
  this.add = v => Coin(big.plus(v))

  /**
   *
   * @param {number|string|Coin} v Value
   * @returns {Coin} Coin instance
   */
  this.subtract = v => Coin(big.minus(v))

  /**
   *
   * @param {number|string|Coin} v Value
   * @returns {Coin} Coin instance
   */
  this.multiply = v => Coin(big.multipliedBy(v))

  /**
   *
   * @param {number|string|Coin} v Value
   * @returns {Coin} Coin instance
   */
  this.div = v => Coin(big.dividedBy(v))

  /**
   * @returns {string} String representation of value
   */
  this.toString = () => big.decimalPlaces(p).toPrecision()

  /**
   * returns a string that represents value, truncated to the specified precision
   *
   * @param {number} digits Digits
   * @returns {string} String representation of value
   */
  this.toPrecision = digits => big.decimalPlaces(Math.min(Math.max(0, digits), p)).toPrecision()

  /**
   * returns a string that represents value, truncated to the specified precision per given code of currency
   *
   * @param {string} currencyCode Currency code
   * @returns {string} String representation of value
   */
  this.formatPerCurrency = currencyCode => this.toPrecision(getCurrencyPrecision(currencyCode))

  /**
   *
   * @returns {boolean} Boolean
   */
  this.isZero = () => big.isZero()

  /**
   * @returns {boolean} Boolean
   */
  this.isFinite = () => big.isFinite()

  /**
   * @param {number|string|Coin} v Value
   * @returns {boolean} Boolean
   */
  this.isEqualTo = v => big.isEqualTo(Coin(v).toString())

  /**
   * @param {number|string|Coin} v Value
   * @returns {boolean} Boolean
   */
  this.gt = v => big.gt(Coin(v).toString())

  /**
   * @param {number|string|Coin} v Value
   * @returns {boolean} Boolean
   */
  this.gte = v => big.gte(Coin(v).toString())

  /**
   * @param {number|string|Coin} v Value
   * @returns {boolean} Boolean
   */
  this.lt = v => big.lt(Coin(v).toString())

  /**
   * @param {number|string|Coin} v Value
   * @returns {boolean} Boolean
   */
  this.lte = v => big.lte(Coin(v).toString())

  // TODO: isPositive
  // TODO: isNegative
  // TODO: percent
  // TODO: toPrecisionFloor
  // TODO: toPrecisionRound
}

/**
 * @param {...(number|string|Coin)} amounts Amounts to compare
 * @returns {Coin} Coin instance
 */
Coin.maximum = (...amounts) => Coin(CoinBig.max(amounts))

/**
 * @param {...(number|string|Coin)} amounts Amounts to compare
 * @returns {Coin} Coin instance
 */
Coin.minimum = (...amounts) => Coin(CoinBig.min(amounts))

export default Coin
