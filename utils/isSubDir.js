const { relative, isAbsolute } = require('path')

/**
 * isSubDir - Check if a directory has a given subdirectory.
 *
 * @param  {string}  parent Parent directory
 * @param  {string}  dir    Subdirectory to check for
 * @returns {boolean}       Boolean indicating wether dir is a subdirectory of parent
 */
const isSubDir = (parent, dir) => {
  const isRelative = relative(parent, dir)
  return Boolean(isRelative) && !isRelative.startsWith('..') && !isAbsolute(isRelative)
}

export default isSubDir
