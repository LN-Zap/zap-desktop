import { ClientFunction } from 'testcafe'
import path from 'path'
import rimraf from 'rimraf'
import delay from '../../../utils/delay'

// Get the path to the index page.
export const getBaseUrl = () => '../../dist/index.html'

// Get the current page title.
export const getPageTitle = ClientFunction(() => document.title)

// Get the electron user data directory.
export const getUserDataDir = ClientFunction(() => window.Zap.getUserDataDir())

// Kill the client's active lnd instance, if there is one
export const killLnd = ClientFunction(() => window.Zap.killLnd())

// Delete persistent data from indexeddb.
export const deleteDatabase = ClientFunction(() => {
  // Catch unhandled errors, which can happen if an attempt to access the database is made after we have closed it.
  window.addEventListener('unhandledrejection', event => {
    event.preventDefault()
  })
  return window.db.delete()
})

// Ensure there are no errors in the console.
export const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages()
  await t.expect(error).eql([])
}

// Clean out test environment.
export const cleanTestEnvironment = async () => {
  console.log('cleanTestEnvironment')
  console.log('waiting 3 seconds for app state to settle')
  await delay(3000)
  await killLnd()
  await deleteDatabase()
}

// Clean out test environment.
export const cleanElectronEnvironment = async ctx => {
  if (ctx.userDataDir) {
    rimraf.sync(path.join(ctx.userDataDir, 'lnd'), { disableGlob: false, maxBusyTries: 10 })
  }
}
