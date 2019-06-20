import path from 'path'
import isSubDir from './isSubDir'

/**
 *
 *
 * @export
 * @param {object} backup
 * @returns
 */
export function toJSON(backup) {
  return JSON.stringify(backup)
}

/**
 *
 *
 * @export
 * @param {string} json
 * @returns {object|null}
 */
export function fromJSON(json) {
  try {
    const isBuffer = value =>
      value !== null && value.type === 'Buffer' && 'data' in value && Array.isArray(value.data)
    return JSON.parse(json, (key, value) => (isBuffer(value) ? Buffer.from(value.data) : value))
  } catch (e) {
    return null
  }
}

/**
 *
 *
 * @export
 * @param {*} nodePub
 * @param {*} dir
 * @returns
 */
export function normalizeBackupDir(nodePub, dir) {
  // use parent dir if we are already in backup folder
  if (isSubDir(dir, nodePub)) {
    return path.join(dir, '..')
  }

  return dir
}
