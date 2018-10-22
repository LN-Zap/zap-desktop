import React from 'react'
import { storiesOf } from '@storybook/react'
import { StateDecorator, Store } from '@sambego/storybook-state'
import Dropdown from 'components/UI/Dropdown'

const store = new Store({
  crypto: 'btc',
  fiat: 'usd',
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
  fiatCurrencies: [
    {
      key: 'usd',
      name: 'USD'
    },
    {
      key: 'eur',
      name: 'EUR'
    },
    {
      key: 'gbp',
      name: 'GBP'
    }
  ]
})

storiesOf('Components.Dropdown', module)
  .addDecorator(StateDecorator(store))
  .add('Crypto', () => {
    return (
      <Dropdown
        activeKey={store.get('crypto')}
        items={store.get('cryptoCurrencies')}
        onChange={crypto => store.set({ crypto })}
      />
    )
  })
  .add('Fiat', () => {
    return (
      <Dropdown
        activeKey={store.get('fiat')}
        items={store.get('fiatCurrencies')}
        onChange={fiat => store.set({ fiat })}
      />
    )
  })
