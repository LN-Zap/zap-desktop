import splitHostname from '@zap/utils/splitHostname'

describe('splitHostname', () => {
  it('Correctly sanitize host names', () => {
    const hosts = [
      '[1fff:0:a88:85a3::ac1f]:1',
      '[1fff:0:a88:85a3::ac1f]',
      '192.168.1.1:10009',
      'www.example.com:10009',
    ]

    const sanitized = hosts.map(splitHostname)

    expect(sanitized).toEqual([
      { host: '1fff:0:a88:85a3::ac1f', port: '1' },
      { host: '1fff:0:a88:85a3::ac1f', port: null },
      { host: '192.168.1.1', port: '10009' },
      { host: 'www.example.com', port: '10009' },
    ])
  })
})
