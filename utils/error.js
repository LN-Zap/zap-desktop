export const createError = (msg, code) => {
  const error = new Error(msg)
  if (code) {
    error.code = code
  }
  return error
}

export const UNSUPPORTED = 'UNSUPPORTED'
