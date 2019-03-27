import errorToUserFriendly from '@zap/utils/userFriendlyErrors'

describe('userFriendlyErrors', () => {
  describe('errorToUserFriendly', () => {
    it('should handle defined user-friendly errors', () => {
      expect(errorToUserFriendly('Error: 11 OUT_OF_RANGE: EOF')).toBe(
        "The person you're trying to connect to isn't available or rejected the connection.\
 Their public key may have changed or the server may no longer be responding."
      )
    })

    it('should return the original error when there is no user-friendly error conversion', () => {
      expect(errorToUserFriendly('Error 12')).toBe('Error 12')
      expect(errorToUserFriendly('???')).toBe('???')
    })
  })
})
