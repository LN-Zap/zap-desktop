import createSingletonFactory from '@zap/utils/singleton'

import Dropbox from './dropbox'
import GoogleDrive from './gdrive'
import Local from './local'

export const GOOGLE_DRIVE = 'gdrive'
export const DROPBOX = 'dropbox'
export const LOCAL = 'local'

const services = {
  [GOOGLE_DRIVE]: GoogleDrive,
  [DROPBOX]: Dropbox,
  [LOCAL]: Local,
}

const singletonGet = createSingletonFactory(services)

/**
 * getBackupService - Singleton backup factory.
 *
 * @param {('gdrive'|'dropbox'|'local')} provider Provider name
 * @returns {object|null} Backup service instance
 */
export default function getBackupService(provider) {
  const result = singletonGet(provider)
  if (result) {
    return result
  }

  throw new Error('not implemented')
}
