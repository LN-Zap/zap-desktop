import mapValues from 'lodash/mapValues'
import merge from 'lodash/merge'

import { requestFees } from '@zap/utils/api'
import { CoinBig } from '@zap/utils/coin'
import { createError, UNSUPPORTED } from '@zap/utils/error'
import { mainLog } from '@zap/utils/log'
import { grpc } from 'workers'

/**
 * sanitizeFeeRange - Sanitize a fee rate object ensuring that all fees are at least 1.
 *
 * @param {object} fees Fee rate object
 * @returns {object} Sanitized fee rate object
 */
const sanitizeFeeRange = fees => mapValues(fees, fee => CoinBig.max(1, fee).toString())

/**
 * estimateLndFee - Returns fee estimation for the specified @address @amount & @targetConf using LND gRPC API.
 *
 * @param {string} address Address
 * @param {number} amount Amount in satoshis
 * @param {number} targetConf Desired confirmation time
 * @returns {{feeSat, feerateSatPerByte}|null} Fee data if success or null in case of any error
 */
export async function estimateLndFee(address, amount, targetConf) {
  // lnd fee estimator requires this params
  if (!address || !amount || !targetConf) {
    return null
  }

  try {
    mainLog.info('Fetching fees from lnd: %o', { address, amount, targetConf })
    if (!(await grpc.services.Lightning.hasMethod('estimateFee'))) {
      throw createError('Method "estimateFee" is not supported by this version of lnd', UNSUPPORTED)
    }

    const fees = await grpc.services.Lightning.estimateFee(address, amount, targetConf)

    // check if we actually got a meaningful response
    if (fees && fees.feeSat) {
      return sanitizeFeeRange(fees)
    }

    return null
  } catch (e) {
    mainLog.warn(`Unable to fetch fees from lnd: %o`, e)
    // something went wrong. potentially we are running LND <0.6 and this methods is unsupported
    // or tx output is dust or any other error. Use fallback instead
    return null
  }
}

/**
 * estimateFeeRange - Estimate fees for specified range.
 *
 * Expected range format is {fastestConfCount, halfHourConfCount, hourConfCount}
 * Fee estimation is based on LND endpoint. If it's unavailable then @fallback is used.
 *
 * @param {{address, amountInSats, range, asRate, fallback}} options Options
 * @returns {{fastestFee:number, halfHourFee:number, hourFee:number}} Fee data
 */
export async function estimateFeeRange({
  address,
  amountInSats,
  range,
  asRate = true,
  fallback = requestFees,
}) {
  const { fast, medium, slow } = range

  // lnd fee estimator requires this params
  if (!address || !amountInSats) {
    const feeRange = await fallback({ fast, medium, slow })
    mainLog.info('Estimated fee range as: %o', feeRange)
    return sanitizeFeeRange(feeRange)
  }

  const [fastestFee, mediumFee, slowFee] = await Promise.all([
    estimateLndFee(address, amountInSats, fast),
    estimateLndFee(address, amountInSats, medium),
    estimateLndFee(address, amountInSats, slow),
  ])

  // check if we have at least one estimate and fill the gap with fallback values otherwise
  const fallbackFees =
    !fastestFee || !mediumFee || !slowFee ? await fallback({ fast, medium, slow }) : {}

  // extracts fee from a lnd grpc response
  const getFee = feeObj => {
    if (feeObj) {
      return asRate ? feeObj.feerateSatPerByte : feeObj.feeSat
    }
    return undefined
  }

  // try to use any info from the gRPC call if it's available
  const feeRange = merge(
    {
      fast: getFee(fastestFee),
      medium: getFee(mediumFee),
      slow: getFee(slowFee),
    },
    fallbackFees
  )

  mainLog.info('Estimated fee range as: %o', feeRange)
  return sanitizeFeeRange(feeRange)
}
