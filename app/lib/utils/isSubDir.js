import { relative, isAbsolute } from 'path'

function isSubDir(parent, dir) {
  const isRelative = relative(parent, dir)
  return Boolean(isRelative) && !isRelative.startsWith('..') && !isAbsolute(isRelative)
}

export default isSubDir
