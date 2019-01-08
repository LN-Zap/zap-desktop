import os from 'os'
import fs from 'fs'
import { Application } from 'spectron'
import electronPath from 'electron'
import path from 'path'

jest.setTimeout(50000)
jest.unmock('electron')

// Before running tests, create a new temporary directory that we will use for the electron userDir.
const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zap-'))

export const startApp = async () => {
  const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..', '..', 'app')],
    waitTimeout: 10000,
    startTimeout: 10000,
    quitTimeout: 2000,
    // Use requre that we reference in preload.js
    requireName: 'electronRequire',
    // Tell the app to use a custom Electron userDir.
    env: {
      USER_DIR: userDir
    }
  })

  await app.start()

  await app.client.waitUntilWindowLoaded()
  return app
}

export const stopApp = async app => {
  if (app && app.isRunning()) {
    await app.stop()
  }
}
