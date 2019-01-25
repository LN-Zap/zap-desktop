const { relative, isAbsolute } = require('path')

function isSubDir(parent, dir) {
  const isRelative = relative(parent, dir)
  return Boolean(isRelative) && !isRelative.startsWith('..') && !isAbsolute(isRelative)
}

module.exports = isSubDir
