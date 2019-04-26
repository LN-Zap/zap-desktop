import parseSeed from '@zap/utils/parseSeed'

const SEEDWORDS = [
  'abstract',
  'win',
  'toilet',
  'oxygen',
  'culture',
  'march',
  'ladder',
  'runway',
  'cruel',
  'nut',
  'uniform',
  'deer',
  'fetch',
  'type',
  'attitude',
  'occur',
  'shy',
  'radar',
  'unit',
  'begin',
  'crater',
  'adult',
  'plastic',
  'fabric',
]

describe('parseSeed', () => {
  const allTests = [
    [
      /* eslint max-len: 0 */
      'abstract win toilet oxygen culture march ladder runway cruel nut uniform deer fetch type attitude occur shy radar unit begin crater adult plastic fabric',
      'delimited by spaces',
    ],
    [
      /* eslint max-len: 0 */
      'abstract, win, toilet, oxygen, culture, march, ladder, runway, cruel, nut, uniform, deer, fetch, type, attitude, occur, shy, radar, unit, begin, crater, adult, plastic, fabric',
      'delimited by commas',
    ],
    [
      /* eslint max-len: 0 */
      '   123.  abstract, win, toilet, oxygen, culture, march, ladder, runway, cruel, nut, uniform, deer, fetch, type, attitude, occur, shy, radar, unit, begin, crater, adult, plastic, fabric  ',
      'with leading and trailing characters',
    ],
    [
      `1. abstract   2. win     3. toilet     4. oxygen
5. culture    6. march   7. ladder     8. runway
9. cruel     10. nut    11. uniform   12. deer
13. fetch     14. type   15. attitude  16. occur
17. shy       18. radar  19. unit      20. begin
21. crater    22. adult  23. plastic   24. fabric`,
      'as output from lnd genSeed',
    ],
  ]

  allTests.forEach(test => {
    const [seed, description] = test
    it(`should parse a valid seed ${description}`, () => {
      expect(parseSeed(seed)).toEqual(SEEDWORDS)
    })
  })
})
