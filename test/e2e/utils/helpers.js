import { ClientFunction } from 'testcafe'

export const getBaseUrl = () => '../../app/dist/index.html'

export const getPageUrl = ClientFunction(() => window.location.href)

export const getPageTitle = ClientFunction(() => document.title)

export const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages()
  await t.expect(error).eql([])
}

// Delete persistent data from indexeddb
export const deleteDatabase = async t => {
  await t.eval(() => window.indexedDB.deleteDatabase('ZapDesktop.production'))
}

// Delete wallets that may have been created in the tests.
export const deleteUserData = async t => {
  await t.eval(() => window.Zap.deleteLocalWallet('bitcoin', 'testnet', 'wallet-1', false))
}
