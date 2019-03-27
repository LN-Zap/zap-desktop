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
export const deleteDatabase = ClientFunction(() => window.db.delete())

// Ensure there are no errors in the console.
export const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages()
  await t.expect(error).eql([])
}

// Simple delay.
export const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

// Clean out test environment.
export const cleanTestEnvironment = async () => {
  await killLnd()
  await delay(3000)
  await killLnd()
  await deleteDatabase()
  await delay(3000)
}

// Clean out test environment.
export const cleanElectronEnvironment = async ctx => {
  if (ctx.userDataDir) {
    rimraf.sync(path.join(ctx.userDataDir, 'lnd'), { disableGlob: false, maxBusyTries: 10 })
  }
}
