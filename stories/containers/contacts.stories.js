/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { State, Store } from '@sambego/storybook-state'
import { Modal, Page } from 'components/UI'
import ConnectManually from 'components/Contacts/ConnectManually'
import SubmitChannelForm from 'components/Contacts/SubmitChannelForm'

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
  fiatCurrency: 'USD'
})

storiesOf('Containers.Contacts', module)
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
  .add('ConnectManually', () => {
    const dispatchProps = {
      closeManualForm: action('closeManualForm'),
      openSubmitChannelForm: action('openSubmitChannelForm'),
      setNode: action('setNode')
    }
    return <ConnectManually {...dispatchProps} width={9 / 16} mx="auto" />
  })
  .add('SubmitChannelForm', () => {
    const node = {
      alias: 'Jamie Dimon',
      pub_key: '0224d2b2c9b101bdcd941b7e6937d81fba6dfed271bf57121b6f001cd63594e2da',
      addresses: [{ addr: '0229a4b8ded6c7861208e1b438cba1f9e3c4aba7df56c990c46ea45d1850f5cadf' }]
    }
    const dispatchProps = {
      closeChannelForm: action('closeChannelForm'),
      closeContactsForm: action('closeContactsForm'),
      openChannel: action('openChanel'),
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
    return (
      <State store={store}>
        {state => {
          return (
            <SubmitChannelForm {...state} {...dispatchProps} node={node} width={9 / 16} mx="auto" />
          )
        }}
      </State>
    )
  })
