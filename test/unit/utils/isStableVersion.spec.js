import { isStableVersion } from 'lib/utils'

const STABLE_VERSION = '0.3.x'

describe('isStableVersion', () => {
  describe('positive matches', () => {
    const positiveTests = [
      ['0.3.0-beta', STABLE_VERSION, true],
      ['0.3.1-beta', STABLE_VERSION, true],
      ['0.3.2-alpha', STABLE_VERSION, true],
      ['0.3.0', STABLE_VERSION, true],
    ]

    positiveTests.map(test => {
      const [version, stable, expectation] = test
      const res = isStableVersion(version, stable)

      it(`should determine that ${version} is stable when current stable version is ${stable}`, () => {
        expect(res).toEqual(expectation)
      })
    })
  })

  describe('negative matches', () => {
    const negativeTests = [
      ['0.2.0-alpha', STABLE_VERSION, false],
      ['0.2.0', STABLE_VERSION, false],
      ['0.4.0-alpha', STABLE_VERSION, false],
      ['0.4.0-beta', STABLE_VERSION, false],
    ]

    negativeTests.map(test => {
      const [version, stable, expectation] = test
      const res = isStableVersion(version, stable)

      it(`should determine that ${version} is not stable when current stable version is ${stable}`, () => {
        expect(res).toEqual(expectation)
      })
    })
  })
})
