const userFriendlyErrors = {
  'Error: 11 OUT_OF_RANGE: EOF':
    "The person you're trying to connect to isn't available or rejected the connection.\
 Their public key may have changed or the server may no longer be responding."
}

const errorToUserFriendly = error => userFriendlyErrors[error] || error

export default errorToUserFriendly
