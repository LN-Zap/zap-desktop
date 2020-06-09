import { byteToHexString, hexStringToByte } from '@zap/utils/byteutils'

describe('byteutils', () => {
  describe('byteToHexString', () => {
    const tests = [
      [new Uint8Array(32), '0000000000000000000000000000000000000000000000000000000000000000'],
      [
        new Uint8Array([
          127,
          85,
          26,
          112,
          162,
          212,
          93,
          237,
          45,
          245,
          111,
          221,
          199,
          22,
          38,
          120,
          190,
          126,
          235,
          197,
          235,
          136,
          230,
          38,
          54,
          2,
          138,
          253,
          209,
          206,
          27,
          173,
        ]),
        '7F551A70A2D45DED2DF56FDDC7162678BE7EEBC5EB88E62636028AFDD1CE1BAD',
      ],
    ]

    tests.forEach(test => {
      const [from, to] = test
      const res = byteToHexString(from)

      it(`should convert uint ${from} to hext string ${to}`, () => {
        expect(res).toEqual(to)
      })
    })
  })

  describe('hexStringToByte', () => {
    const tests = [
      ['0000000000000000000000000000000000000000000000000000000000000000', new Uint8Array(32)],
      [
        '7F551A70A2D45DED2DF56FDDC7162678BE7EEBC5EB88E62636028AFDD1CE1BAD',

        new Uint8Array([
          127,
          85,
          26,
          112,
          162,
          212,
          93,
          237,
          45,
          245,
          111,
          221,
          199,
          22,
          38,
          120,
          190,
          126,
          235,
          197,
          235,
          136,
          230,
          38,
          54,
          2,
          138,
          253,
          209,
          206,
          27,
          173,
        ]),
      ],
    ]

    tests.forEach(test => {
      const [from, to] = test
      const res = hexStringToByte(from)

      it(`should convert uint ${from} to hext string ${to}`, () => {
        expect(res).toEqual(to)
      })
    })
  })
})
