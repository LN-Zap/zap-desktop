import semver from 'semver'

const isStableVersion = (version, stableVersion) => {
  const current = semver.coerce(version)
  const stable = semver.coerce(stableVersion)

  const currentBase = `${semver.major(current)}.${semver.minor(current)}.0`
  const stableBase = `${semver.major(stable)}.${semver.minor(stable)}.0`

  return semver.eq(currentBase, stableBase)
}

export default isStableVersion
