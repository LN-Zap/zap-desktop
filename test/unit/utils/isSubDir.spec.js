import { isSubDir } from '@zap/utils'
import os from 'os'

describe('isSubDir', () => {
  const mapSamples = samples => samples.map(([parent, dir]) => isSubDir(parent, dir))

  if (os.platform() === 'win32') {
    const tests = [['C:\\Foo', 'C:\\Foo\\Bar'], ['C:\\Foo', 'C:\\Bar'], ['C:\\Foo', 'D:\\Foo\\Bar']]
    const result = mapSamples(tests)
    it('should correctly detect subdirs on windows', () => {
      expect(result).toEqual([true, false, false])
    })
  }

  const tests = [
    ['/foo', '/foo'],
    ['/foo', '/bar'],
    ['/foo', '/foobar'],
    ['/foo', '/foo/bar'],
    ['/foo', '/foo/../bar'],
    ['/foo', '/foo/./bar'],
    ['/bar/../foo', '/foo/bar'],
    ['/foo', './bar'],
  ]

  const result = mapSamples(tests)

  it('should correctly detect subdirs', () => {
    expect(result).toEqual([false, false, false, true, false, true, true, false])
  })
})
