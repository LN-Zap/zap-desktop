import { formatUsd, usdToBtc } from 'lib/utils/usd'

describe('usd', () => {
  describe('formatUsd', () => {
    it('should handle a string value', () => {
      expect(formatUsd('42.0')).toBe('$42.00')
    })

    it('should handle a numerical value', () => {
      expect(formatUsd(42.0)).toBe('$42.00')
    })

    it('should round to two decimal places', () => {
      expect(formatUsd('42.416')).toBe('$42.42')
    })
  })

  describe('usdToBtc', () => {
    it('should convert USD to BTC using rate', () => {
      expect(usdToBtc(1, 50)).toBe('0.02000000')
    })

    it('should round to eight decimal places', () => {
      expect(usdToBtc(2, 3)).toBe('0.66666667')
    })
  })
})
