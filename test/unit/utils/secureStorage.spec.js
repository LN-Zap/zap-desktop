import createStorage from '@zap/utils/secureStorage'

describe('secureStorage', () => {
  it('should add and retrieve the key', async () => {
    const storage = createStorage('zap-test')
    await storage.setKey('testKey', 'testValue')
    expect(await storage.getKey('testKey')).toEqual('testValue')
    await storage.deleteKey('testKey')
    expect(await storage.getKey('testKey')).toEqual(null)
  })
})
