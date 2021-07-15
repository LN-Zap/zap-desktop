import { ipcMain } from 'electron'

import { mainLog } from '@zap/utils/log'

/**
 * createCRUD - Creates secure storage <-> ipc CRUD provider. `key` param is used to define IPC event names
 * that the CRUD provider emits:
 * get|set|has|delete${Key} for success case and get|set|has|delete${Key}Failure for exceptions.
 *
 * @param {object} storage Secure storage instance
 * @param {string} storageKey Secure storage key name that is used to persist `key` (can be the same as `key` or differ)
 * @param {string} key ipc event name body
 * @param {Function} send callback that is used to send messages to the renderer process.
 * Receives `eventName` as first parameter and `params` as a second
 * @returns {Function} CRUD ipc unsub callback. Call it during cleanup phase
 */
export default function createCRUD(storage, storageKey, key, send) {
  // generates an event name for the specified `op`. e.g getKey, setKey, hasKey, deleteKey.
  const getEvent = op => `${op}${key.charAt(0).toUpperCase() + key.slice(1)}`
  const getSuccessEvent = op => `${getEvent(op)}Success`
  const sendFailureEvent = op => send(`${getEvent(op)}Failure`)

  /**
   * on - Sets up ipcMain handler for the specified operation.
   *
   * @param {string} op operation (get, set, has, delete)
   * @param {Function} handler handler to invoke when ipc event is received
   * @returns {Function} ipc unsub callback. Call it on cleanup
   */
  const on = (op, handler) => {
    const eventName = getEvent(op)
    const listener = async (event, params) => {
      try {
        await handler(getSuccessEvent(op), params)
      } catch (e) {
        mainLog.warn(`Unable to invoke "${op}" operation on ${storageKey}: %o`, e)
        sendFailureEvent(op)
      }
    }
    ipcMain.on(eventName, listener)
    return () => ipcMain.removeListener(eventName, listener)
  }

  const removeGetListener = on('get', async event => {
    const value = await storage.getKey(storageKey)
    send(event, { [key]: value })
  })

  const removeDeleteListener = on('delete', async event => {
    await storage.deleteKey(storageKey)
    send(event)
  })

  const removeSetListener = on('set', async (event, { value }) => {
    await storage.setKey(storageKey, value)
    send(event)
  })

  const removeHasListener = on('has', async event => {
    const value = await storage.getKey(storageKey)
    send(event, { value: Boolean(value) })
  })

  return function cleanup() {
    removeGetListener()
    removeDeleteListener()
    removeSetListener()
    removeHasListener()
  }
}
