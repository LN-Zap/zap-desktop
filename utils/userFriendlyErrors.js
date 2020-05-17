const userFriendlyErrors = {
  /* eslint-disable max-len */
  'Error: 11 OUT_OF_RANGE: EOF':
    "The person you're trying to connect to isn't available or rejected the connection. Their public key may have changed or the server may no longer be responding.",
  IN_FLIGHT: 'Payment is still in flight.',
  SUCCEEDED: 'Payment completed successfully.',
  FAILED_TIMEOUT: 'There are more routes to try, but the payment timeout was exceeded.',
  FAILED_NO_ROUTE:
    'All possible routes were tried and failed permanently. Or were no routes to the destination at all.',
  FAILED_ERROR: 'A non-recoverable error has occured.',
  FAILED_INCORRECT_PAYMENT_DETAILS:
    'Payment details incorrect (unknown hash, invalid amt or invalid final cltv delta).',
  FAILED_INSUFFICIENT_BALANCE: 'Insufficient local balance.',
  FAILURE_REASON_NONE: "Payment isn't failed (yet).",
  FAILURE_REASON_TIMEOUT: 'There are more routes to try, but the payment timeout was exceeded.',
  FAILURE_REASON_NO_ROUTE:
    'All possible routes were tried and failed permanently. Or were no routes to the destination at all.',
  FAILURE_REASON_ERROR: ' A non-recoverable error has occured.',
  FAILURE_REASON_INCORRECT_PAYMENT_DETAILS:
    'Payment details incorrect (unknown hash, invalid amt or invalid final cltv delta).',
  FAILURE_REASON_INSUFFICIENT_BALANCE: 'Insufficient local balance.',
}

/**
 * errorToUserFriendly - Convert a hard to understand error message into a more user friendly message.
 *
 * @param {string} error Error message
 * @returns {string} Converted error message
 */
const errorToUserFriendly = (error = '') => {
  const errorString = userFriendlyErrors[error] || error || ''

  // ucfirst.
  return errorString.charAt(0).toUpperCase() + errorString.slice(1)
}

export default errorToUserFriendly
