import sha256digest from '@zap/utils/sha256'

describe('sha256digest', () => {
  it('should produce correct sha256 hashes of a string', () => {
    expect(sha256digest('chancellor on the brink of second bailout for banks')).toEqual(
      '9fed463e7c26c0a742b137234e9bbea5fd7beacfa959ca5d54a57e7f41fa2255'
    )
  })
})
