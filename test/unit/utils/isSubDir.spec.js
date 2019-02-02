import { isSubDir } from 'lib/utils'

describe('btc.btcToBits', () => {
  const tests = [
    ['/foo', '/foo'],
    ['/foo', '/bar'],
    ['/foo', '/foobar'],
    ['/foo', '/foo/bar'],
    ['/foo', '/foo/../bar'],
    ['/foo', '/foo/./bar'],
    ['/bar/../foo', '/foo/bar'],
    ['/foo', './bar'],
    ['C:\\Foo', 'C:\\Foo\\Bar'],
    ['C:\\Foo', 'C:\\Bar'],
    ['C:\\Foo', 'D:\\Foo\\Bar']
  ]

  const result = tests.map(([parent, dir]) => isSubDir(parent, dir))

  it('should correctly detect subdirs', () => {
    expect(result).toEqual([
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false
    ])
  })
})
