/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import { State, Store } from '@sambego/storybook-state'
import lightningPayReq from 'bolt11'
import { convert } from 'lib/utils/btc'
import { Modal, Page } from 'components/UI'
import { Request, RequestSummary } from 'components/Request'

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

const store = new Store({
  chain: 'bitcoin',
  network: 'testnet',
  cryptoName: 'Bitcoin',
  cryptoCurrency: 'btc',
  cryptoCurrencyTicker: 'BTC',
  cryptoCurrencies: [
    {
      key: 'btc',
      name: 'BTC'
    },
    {
      key: 'bits',
      name: 'bits'
    },
    {
      key: 'sats',
      name: 'satoshis'
    }
  ],

  fiatCurrency: 'USD',
  fiatCurrencies: ['USD', 'EUR', 'GBP'],

  currentTicker: {
    USD: 6477.78,
    EUR: 5656.01,
    GBP: 5052.73
  }
})

const mockCreateInvoice = async (amount, currency, memo = '') => {
  action('mockCreateInvoice')
  const satoshis = convert(currency, 'sats', amount)
  store.set({ isProcessing: true })
  await delay(500)
  var encoded = lightningPayReq.encode({
    coinType: 'bitcoin',
    satoshis,
    tags: [
      {
        tagName: 'purpose_commit_hash',
        data: '3925b6f67e2c340036ed12093dd44e0368df1b6ea26c53dbe4811f58fd5db8c1'
      },
      {
        tagName: 'payment_hash',
        data: '0001020304050607080900010203040506070809000102030405060708090102'
      },
      {
        tagName: 'expire_time',
        data: 30
      },
      {
        tagName: 'description',
        data: memo
      }
    ]
  })
  var privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
  var signed = lightningPayReq.sign(encoded, privateKeyHex)
  store.set({ payReq: signed.paymentRequest })
  store.set({ isProcessing: false })
}

const setCryptoCurrency = key => {
  const items = store.get('cryptoCurrencies')
  const item = items.find(i => i.key === key)
  store.set({ cryptoCurrency: item.key })
  store.set({ cryptoCurrencyTicker: item.name })
}

const setFiatCurrency = key => {
  store.set({ fiatCurrency: key })
}

storiesOf('Containers.Request', module)
  .add('Request', () => {
    return (
      <Page css={{ height: 'calc(100vh - 40px)' }}>
        <Modal onClose={action('clicked')}>
          <State store={store}>
            <Request
              width={9 / 16}
              mx="auto"
              // State
              cryptoCurrency={store.get('cryptoCurrency')}
              cryptoCurrencyTicker={store.get('cryptoCurrencyTicker')}
              cryptoCurrencies={store.get('cryptoCurrencies')}
              currentTicker={store.get('currentTicker')}
              cryptoName={store.get('cryptoName')}
              fiatCurrency={store.get('fiatCurrency')}
              fiatCurrencies={store.get('fiatCurrencies')}
              isProcessing={store.get('isProcessing')}
              isPaid={store.get('isPaid')}
              payReq={store.get('payReq')}
              // Dispatch
              createInvoice={mockCreateInvoice}
              setCryptoCurrency={setCryptoCurrency}
              setFiatCurrency={setFiatCurrency}
            />
          </State>
        </Modal>
      </Page>
    )
  })
  .add('RequestSummary', () => {
    store.set({
      payReq: text(
        'Lightning Invoice',
        'lntb10170n1pda7tarpp59kjlzct447ttxper43kek78lhwgxk4gy8nfvpjdr7yzkscu2ds5qdzy2pshjmt9de6zqen0wgsrzvp3xus8q6tcv4k8xgrpwss8xct5daeks6tn9ecxcctrv5hqxqzjccqp2yvpzcn2xazu9rt8nrhn2xf6nyrj8fsfw9hafsf0p80trypu4tp58km5mn7wz50uh06kxf4t8kdj64f86u6l5ksl75r500zl7urhacxspcm4ye9'
      )
    })
    return (
      <Page css={{ height: 'calc(100vh - 40px)' }}>
        <Modal onClose={action('clicked')}>
          <State store={store}>
            <RequestSummary
              // State
              cryptoCurrency={store.get('cryptoCurrency')}
              cryptoCurrencies={store.get('cryptoCurrencies')}
              currentTicker={store.get('currentTicker')}
              payReq={store.get('payReq')}
              // Dispatch
              setCryptoCurrency={setCryptoCurrency}
              setFiatCurrency={setFiatCurrency}
            />
          </State>
        </Modal>
      </Page>
    )
  })
