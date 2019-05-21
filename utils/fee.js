import merge from 'lodash.merge'
import { grpcService } from 'workers'
import { requestFees } from '@zap/utils/api'
import { mainLog } from '@zap/utils/log'

/**
 * Returns fee estimation for the specified @address  @amount @targetConf
 * using LND gRPC API.
 *
 * @export
 * @param {string} address
 * @param {number} amount amount in satoshis
 * @param {number} targetConf desired confirmation time
 * @returns {Object} {fee_sat, feerate_sat_per_byte} if success or null in case of any error
 */
export async function estimateLndFee(address, amount, targetConf) {
  // lnd fee estimator requires this params
  if (!address || !amount || !targetConf) {
    return null
  }

  try {
    const grpc = await grpcService
    const fees = await grpc.services.Lightning.estimateFee(address, amount, targetConf)
    // check if we actually got a meaningful response
    if (fees && fees.fee_sat) {
      return fees
    }

    return null
  } catch (e) {
    mainLog.warn(`estimate fee error: ${e}`)
    // something went wrong. potentially we are running LND <0.6 and this methods is unsupported
    // or tx output is dust or any other error. Use fallback instead
    return null
  }
}

/**
 * Returns fee estimation for the specified range
 * Expected range format is {fast, medium, slow}
 * Fee estimation is based on LND endpoint. If it's unavailable then @fallback is used
 * @export
 * @param {*} { address, amountInSats, range, asRate = true, fallback = requestFees }
 * @returns
 */
export async function estimateFeeRange({
  address,
  amountInSats,
  range,
  asRate = true,
  fallback = requestFees,
}) {
  // lnd fee estimator requires this params
  if (!address || !amountInSats) {
    return fallback()
  }

  const { fast, medium, slow } = range
  const [fastestFee, mediumFee, slowFee] = await Promise.all([
    estimateLndFee(address, amountInSats, fast),
    estimateLndFee(address, amountInSats, medium),
    estimateLndFee(address, amountInSats, slow),
  ])

  // check if we have at least one estimate and fill the gap with fallback values otherwise
  const fallbackFees = !fastestFee || !mediumFee || !slowFee ? await fallback() : {}

  // extracts fee from a lnd grpc response
  const getFee = feeObj => {
    if (feeObj) {
      return asRate ? feeObj.feerate_sat_per_byte : feeObj.fee_sat
    }
    return undefined
  }

  // try to use any info from the gRPC call if it's available
  return merge(
    {
      fast: getFee(fastestFee),
      medium: getFee(mediumFee),
      slow: getFee(slowFee),
    },
    fallbackFees
  )
}
