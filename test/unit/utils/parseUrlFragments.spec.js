import parseUrlFragments from '@zap/utils/parseUrlFragments'

describe('parseUrlFragments util', () => {
  it('works with non empty hash string', async () => {
    const hash = '#param1=value1&param2=value2'
    const map = parseUrlFragments(hash)
    expect(map).toEqual({
      param1: 'value1',
      param2: 'value2',
    })
  })

  it('works with no hash params', async () => {
    const hash = '#'
    const map = parseUrlFragments(hash)
    expect(map).toEqual({})
  })

  it('works with empty hash', async () => {
    const hash = ''
    const map = parseUrlFragments(hash)
    expect(map).toEqual({})
  })
})
