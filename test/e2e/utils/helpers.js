import { ClientFunction } from 'testcafe'

// Get the path to the index page.
export const getBaseUrl = () => '../../app/dist/index.html'

// Get the current page title.
export const getPageTitle = ClientFunction(() => document.title)

// Kill the client's active lnd instance, if there is one
export const killLnd = ClientFunction(() => window.Zap.killLnd())

// Delete wallets that may have been created in the tests.
export const deleteUserData = ClientFunction(() =>
  window.Zap.deleteLocalWallet('bitcoin', 'testnet', 'wallet-1')
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
  await delay(1000)
  await deleteUserData()
  await delay(1000)
  await deleteDatabase()
  await delay(1000)
}
