import { validateHost } from '@zap/utils/validateHost'

jest.mock('dns')

describe('Utils', function() {
  describe('validateHost', () => {
    it('should resolve true for valid hostnames', async () => {
      await expect(validateHost('example.com')).resolves.toBeTruthy()
      await expect(validateHost('localhost')).resolves.toBeTruthy()
      await expect(validateHost('192.168.0.1')).resolves.toBeTruthy()
      await expect(validateHost('11.111.11.111.rdns.example.com')).resolves.toBeTruthy()
    })
    it('should reject for invalid hostnames', async () => {
      await expect(validateHost('1+-000invlidhost')).rejects.toThrowErrorMatchingInlineSnapshot(
        `"1+-000invlidhost is not a valid IP address or hostname"`
      )
    })
  })
})
