import difference from '@zap/utils/difference'

describe('difference', () => {
  const allTests = [
    [{}, {}, {}],
    [{ color: 'red', name: 'alice' }, { color: 'red', name: 'bob' }, { name: 'bob' }],
    [
      { color: 'red', item: { shape: 'square' } },
      { color: 'red', item: { shape: 'circle' } },
      { item: { shape: 'circle' } },
    ],
    [
      { color: 'red', item: { shape: 'square' }, results: [1] },
      { color: 'red', item: { shape: 'circle' }, results: [2] },
      { item: { shape: 'circle' }, results: [2] },
    ],
  ]

  it(`should return a difference of two objects`, () => {
    allTests.forEach(test => {
      const [baseVal, updatedval, res] = test
      expect(difference(updatedval, baseVal)).toEqual(res)
    })
  })
})
