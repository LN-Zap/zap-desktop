import semver from 'semver'

/**
 * isStableVersion - Check if app is running the current stable version.
 *
 * @param  {string}  version Version to check
 * @param  {string}  stableVersion Current stable version
 * @returns {boolean} Boolean indicating whether version has the same major and minor version as stableVersion
 */
const isStableVersion = (version, stableVersion) => {
  const current = semver.coerce(version)
  const stable = semver.coerce(stableVersion)

  const currentBase = `${semver.major(current)}.${semver.minor(current)}.0`
  const stableBase = `${semver.major(stable)}.${semver.minor(stable)}.0`

  return semver.eq(currentBase, stableBase)
}

export default isStableVersion
