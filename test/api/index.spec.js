import { callApi } from '../../app/api'

describe('API', () => {
  describe('getinfo', () => {
    it('is synced to the chain', async () => {
      const info = await callApi('info')
      expect(info.data.synced_to_chain).toEqual(true)
    })

    it('only supports 1 chain at a time', async () => {
      const info = await callApi('info')
      expect(info.data.chains.length).toEqual(1)
    })
  })

  describe('balance', () => {
    it('returns wallet balance', async () => {
      const wallet_balances = await callApi('wallet_balance')
      expect(typeof (wallet_balances.data.balance)).toEqual('string')
    })

    it('returns channel balance', async () => {
      const channel_balances = await callApi('channel_balance')
      expect(typeof (channel_balances.data.balance)).toEqual('string')
    })
  })

  describe('peers', () => {
    it('peers is an array', async () => {
      const peers = await callApi('peers')
      expect(Array.isArray(peers.data.peers)).toEqual(true)
    })
  })

  describe('channels', () => {
    it('channels is an array', async () => {
      const channels = await callApi('channels')
      expect(Array.isArray(channels.data.channels)).toEqual(true)
    })
  })

  describe('invoices', () => {
    it('invoices is an array', async () => {
      const invoices = await callApi('invoices')
      expect(Array.isArray(invoices.data.invoices)).toEqual(true)
    })
  })

  describe('payments', () => {
    it('payments is an array', async () => {
      const payments = await callApi('payments')
      expect(Array.isArray(payments.data.payments)).toEqual(true)
    })
  })
})
