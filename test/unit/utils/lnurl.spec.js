import nock from 'nock'

import { fetchLnurlParams, parseLnUrl } from '@zap/utils/lnurl'

describe('lnurl', () => {
  describe('lnurl withdrawRequest', () => {
    it('should correctly parse LN url and fetch withdraw params', async () => {
      const url =
        'LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0M385EK' +
        'VCENXC6R2C35XVUKXEFCV5MKVV34X5EKZD3EV56NYD3HXQURZEP' +
        'EXEJXXEPNXSCRVWFNV9NXZCN9XQ6XYEFHVGCXXCMYXYMNSERXFQ5FNS'

      nock('https://service.com')
        .get('/api?q=3fc3645b439ce8e7f2553a69e5267081d96dcd340693afabe04be7b0ccd178df')
        .reply(200, {
          callback: 'cb',
          k1: 'secret',
          maxWithdrawable: 10000,
          defaultDescription: 'lnurl withdrawal',
          minWithdrawable: 10,
          tag: 'withdrawRequest',
        })

      const params = await fetchLnurlParams(parseLnUrl(url))
      expect(params).toEqual({
        lnurl:
          'https://service.com/api?q=3fc3645b439ce8e7f2553a69e5267081d96dcd340693afabe04be7b0ccd178df',
        tag: 'withdrawRequest',
        callback: 'cb',
        secret: 'secret',
        maxWithdrawable: 10000,
        defaultDescription: 'lnurl withdrawal',
        minWithdrawable: 10,
      })
    })
  })
})
