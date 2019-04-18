import { ClientFunction } from 'testcafe'
import path from 'path'
import rimraf from 'rimraf'

// Get the path to the index page.
export const getBaseUrl = () => '../../dist/index.html'

// Get the current page title.
export const getPageTitle = ClientFunction(() => document.title)

// Get the electron user data directory.
export const getUserDataDir = ClientFunction(() => window.Zap.getUserDataDir())

// Kill the client's active lnd instance, if there is one
export const killLnd = ClientFunction(() => window.Zap.killLnd())

// Delete wallets that may have been created in the tests.
export const deleteUserData = ClientFunction(() =>
  window.Zap.deleteLocalWallet({ chain: 'bitcoin', network: 'testnet', wallet: 'wallet-1' })
)

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

// Simple delay.
export const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

// Clean out test environment.
export const cleanTestEnvironment = async (options = {}) => {
  const tasks = { lnd: true, db: true, ...options }
  if (tasks.lnd) {
    await killLnd()
    await delay(3000)
  }
  if (tasks.db) {
    await deleteDatabase()
    await delay(3000)
  }
}

// Clean out test environment.
export const cleanElectronEnvironment = async ctx => {
  if (ctx.userDataDir) {
    rimraf.sync(path.join(ctx.userDataDir, 'lnd'), { disableGlob: false, maxBusyTries: 10 })
  }
}
