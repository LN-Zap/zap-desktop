/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { State, Store } from '@sambego/storybook-state'
import lightningPayReq from 'bolt11'
import { Modal, Page } from 'components/UI'
import { InvoiceModal } from 'components/Activity/InvoiceModal'
import { PaymentModal } from 'components/Activity/PaymentModal'
import { TransactionModal } from 'components/Activity/TransactionModal'

// Mock globals from preload.
window.Zap = {
  openExternal: uri => window.open(uri, '_blank')
}

const store = new Store({
  /** Current ticker data as provided by blockchain.info */
  currentTicker: {
    USD: 6477.78,
    EUR: 5656.01,
    GBP: 5052.73
  },
  /** Currently selected cryptocurrency (key). */
  cryptoCurrency: 'btc',
  /** List of supported cryptocurrencies. */
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
  /** List of supported fiat currencies. */
  fiatCurrencies: ['USD', 'EUR', 'GBP'],
  /** Currently selected fiat currency (key). */
  fiatCurrency: 'USD',
  /** Network info  */
  network: {
    id: 'testnet',
    name: 'Testnet',
    explorerUrl: 'https://blockstream.info/testnet',
    unitPrefix: 't'
  }
})

const dispatchProps = {
  setCryptoCurrency: key => {
    const items = store.get('cryptoCurrencies')
    const item = items.find(i => i.key === key)
    store.set({ cryptoCurrency: item.key })
    store.set({ cryptoCurrencyTicker: item.name })
  },
  setFiatCurrency: key => {
    store.set({ fiatCurrency: key })
  }
}

storiesOf('Containers.Activity', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .addDecorator(story => (
    <Page css={{ height: 'calc(100vh - 40px)' }}>
      <Modal>{story()}</Modal>
    </Page>
  ))
  .add('InvoiceModal', () => {
    const encoded = lightningPayReq.encode({
      coinType: 'testnet',
      satoshis: 15000,
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
          data: 15
        },
        {
          tagName: 'description',
          data: 'Some items'
        }
      ]
    })
    const privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
    const signed = lightningPayReq.sign(encoded, privateKeyHex)
    const invoice = {
      finalAmount: 15000,
      settled: boolean('Settled', false),
      creation_date: Math.round(new Date().getTime() / 1000),
      settle_date: Math.round(new Date().getTime() / 1000),
      payment_request: signed.paymentRequest,
      memo: signed.tags.find(t => t.tagName === 'description').data,
      tx_hash: '1ae44a23c141a2892c55eb3fe9de45195d88e89b36b5070e10df92d4130e4028'
    }
    return (
      <State store={store}>
        {state => {
          return (
            <InvoiceModal width={9 / 16} mx="auto" {...state} {...dispatchProps} item={invoice} />
          )
        }}
      </State>
    )
  })
  .add('PaymentModal', () => {
    const payment = {
      value: 15000,
      creation_date: Math.round(new Date().getTime() / 1000),
      payment_preimage: '46914421ed5eafea1ec40726338bc5059e80e128660b9c7c8a5817e59429af30'
    }
    return (
      <State store={store}>
        {state => {
          return (
            <PaymentModal width={9 / 16} mx="auto" {...state} {...dispatchProps} item={payment} />
          )
        }}
      </State>
    )
  })
  .add('TransactionModal', () => {
    const transaction = {
      amount: 15000,
      total_fees: 1000,
      received: boolean('Received', true),
      time_stamp: Math.round(new Date().getTime() / 1000),
      dest_addresses: ['2NEEBwPWMQ2CDurRzWgCETwuXvzgZ6pqzY8'],
      block_height: 555466,
      block_hash: '000000000012ac9338c1b53499dfcd6c44c4b96b40e038f4536639d3c3852169',
      tx_hash: '1ae44a23c141a2892c55eb3fe9de45195d88e89b36b5070e10df92d4130e4028'
    }
    return (
      <State store={store}>
        {state => {
          return (
            <TransactionModal
              width={9 / 16}
              mx="auto"
              {...state}
              {...dispatchProps}
              item={transaction}
            />
          )
        }}
      </State>
    )
  })
