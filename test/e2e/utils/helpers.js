import os from 'os'
import path from 'path'
import { promisify } from 'util'

import ps from 'ps-node'
import rimraf from 'rimraf'
import { ClientFunction } from 'testcafe'

const rimrafPromise = promisify(rimraf)
const psLookup = promisify(ps.lookup)

// Get the path to the index page.
export const getBaseUrl = () => '../../dist/index.html'

// Get the current page title.
export const getPageTitle = ClientFunction(() => document.title)

// Get the electron user data directory.
export const getUserDataDir = ClientFunction(() => window.Zap.getUserDataDir())

// Kill the client's active lnd instance, if there is one
export const killNeutrino = ClientFunction(signal => window.Zap.killNeutrino(signal))

// Delete persistent data from indexeddb.
export const deleteDatabase = ClientFunction(() => {
  // Catch unhandled errors, which can happen if an attempt to access the database is made after we have closed it.
  window.addEventListener('unhandledrejection', event => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
    event.preventDefault()
  })
  return window.db.delete()
})

// Ensure there are no errors in the console.
export const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages()
  await t.expect(error).eql([])
}

const printLndProcesses = async () => {
  // under windows platform psLookup may cause issues which results
  // in unpredictable behavior of e2e tests
  if (os.platform() !== 'win32') {
    const processes = await psLookup({ command: 'lnd' })
    console.log('lnd processes', processes)
  }
}

// Clean out test environment.
export const cleanTestEnvironment = async () => {
  console.log('cleanTestEnvironment')

  await printLndProcesses()
  console.log('killing lnd')
  await killNeutrino('SIGKILL')
  console.log('lnd killed')
  await printLndProcesses()

  console.log('deleting database')
  await deleteDatabase()
  console.log('database deleted')
}

// Clean out test environment.
export const cleanElectronEnvironment = async ctx => {
  console.log('cleanElectronEnvironment')
  if (ctx.userDataDir) {
    await rimrafPromise(path.join(ctx.userDataDir, 'lnd'), { disableGlob: false, maxBusyTries: 10 })
    console.log('env cleaned')
  }
}
