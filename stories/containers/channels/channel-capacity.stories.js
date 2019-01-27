import React from 'react'
import { storiesOf } from '@storybook/react'
import { number } from '@storybook/addon-knobs'
import { State, Store } from '@sambego/storybook-state'
import ChannelCapacity from 'components/Channels/ChannelCapacity'

const store = new Store({
  /** Currently selected cryptocurrency (key). */
  cryptoCurrency: 'sats',
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
  ]
})

const setCryptoCurrency = key => {
  const items = store.get('cryptoCurrencies')
  const item = items.find(i => i.key === key)
  store.set({ cryptoCurrency: item.key })
  store.set({ cryptoCurrencyTicker: item.name })
}

storiesOf('Containers.Channels', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .add('ChannelCapacity', () => {
    const localBalance = number('Local Balance', 150000)
    const remoteBalance = number('Remote Balance', 75000)

    const stateProps = {
      localBalance,
      remoteBalance
    }

    const dispatchProps = {
      setCryptoCurrency
    }

    return (
      <State store={store}>
        {state => {
          return <ChannelCapacity {...state} {...stateProps} {...dispatchProps} />
        }}
      </State>
    )
  })
