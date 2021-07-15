import delay from '@zap/utils/delay'
import createStorage from '@zap/utils/secureStorage'
// eslint-disable-next-line import/order
import { createCRUD } from '@zap/electron/secureStorage'

const { ipcMain } = require('../__mocks__/electron')

describe('secureStorage', () => {
  it('should add and retrieve the key', async () => {
    const storage = createStorage('zap-test')
    await storage.setKey('testKey', 'testValue')
    expect(await storage.getKey('testKey')).toEqual('testValue')
    await storage.deleteKey('testKey')
    expect(await storage.getKey('testKey')).toEqual(null)
  })
})

describe('createCRUD', () => {
  it('should correctly handle CRUD operations', async () => {
    const storage = createStorage('zap-test')
    const send = jest.fn((event, params) => ({ event, params }))
    const wait = () => delay(100)
    try {
      const cleanup = createCRUD(storage, 'testKey', 'testKey', send)
      const expectListenerCount = count => {
        expect(ipcMain.listenerCount('getTestKey')).toBe(count)
        expect(ipcMain.listenerCount('setTestKey')).toBe(count)
        expect(ipcMain.listenerCount('hasTestKey')).toBe(count)
        expect(ipcMain.listenerCount('deleteTestKey')).toBe(count)
      }
      expectListenerCount(1)

      ipcMain.emit('hasTestKey')
      await wait()
      // send was called and returned false because key wasn't set
      expect(send.mock.calls[0]).toEqual(['hasTestKeySuccess', { value: false }])

      ipcMain.emit('setTestKey', {}, { value: 'pass' })
      await wait()
      // send was called and value was set correctly
      expect(send.mock.calls[1]).toEqual(['setTestKeySuccess'])

      ipcMain.emit('getTestKey')
      await wait()
      // send was called and returned previously set password value
      expect(send.mock.calls[2]).toEqual(['getTestKeySuccess', { testKey: 'pass' }])

      ipcMain.emit('deleteTestKey')
      await wait()
      // send was called and delete has been executed correctly
      expect(send.mock.calls[3]).toEqual(['deleteTestKeySuccess'])

      ipcMain.emit('setTestKey')
      await wait()
      // set has failed (because no value was provided) and send has sent failure event
      expect(send.mock.calls[4]).toEqual(['setTestKeyFailure'])

      cleanup()

      // all listeners have been removed
      expectListenerCount(0)
    } finally {
      await storage.deleteKey('testKey')
    }
  })
})
