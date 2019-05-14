import getGDrive from './gdrive'

export const GOOGLE_DRIVE = 'gdrive'
export const DROPBOX = 'dropbox'
export const LOCAL = 'local'

export default function getBackupService(provider) {
  switch (provider) {
    case GOOGLE_DRIVE:
      return getGDrive()
    case DROPBOX:
      throw new Error('not implemented')
    case LOCAL:
      throw new Error('not implemented')
    default:
      throw new Error('not implemented')
  }
}
