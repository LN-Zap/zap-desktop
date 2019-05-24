import { isIpV6, splitIpV6, stripIpV6Port } from '@zap/utils/ipv6'

describe('ipv6 utils', () => {
  it('Detect valid ipv6 addresses', () => {
    expect(isIpV6('1fff:0:a88:85a3::ac1f')).toBe(true)
    expect(isIpV6('::1')).toBe(true)
    expect(isIpV6('192.168.1.1')).toBe(false)
    expect(isIpV6('localhost')).toBe(false)
  })

  it('Detect valid ipv6 addresses in port notation', () => {
    expect(isIpV6('[1fff:0:a88:85a3::ac1f]:1')).toBe(true)
    expect(isIpV6('[::1]:1')).toBe(true)
    expect(isIpV6('[192.168.1.1]:8080')).toBe(false)
    expect(isIpV6('localhost:10009')).toBe(false)
  })

  it('Split ipv6 addresses correctly', () => {
    expect(splitIpV6('[1fff:0:a88:85a3::ac1f]:1')).toEqual(['1fff:0:a88:85a3::ac1f', '1'])
    expect(splitIpV6('1fff:0:a88:85a3::ac1f')).toEqual(['1fff:0:a88:85a3::ac1f'])
  })

  it('Strip port from ipv6 addresses correctly', () => {
    expect(stripIpV6Port('[1fff:0:a88:85a3::ac1f]:1')).toEqual('1fff:0:a88:85a3::ac1f')
    expect(stripIpV6Port('1fff:0:a88:85a3::ac1f')).toEqual('1fff:0:a88:85a3::ac1f')
    expect(stripIpV6Port('localhost')).toEqual('localhost')
    // For a not valid ipv6 with port, should just received initial string
    expect(stripIpV6Port('localhost:10009')).toEqual('localhost:10009')
  })
})
