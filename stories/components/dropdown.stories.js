import React from 'react'
import { storiesOf } from '@storybook/react'
import { State, Store } from '@sambego/storybook-state'
import { Dropdown } from 'components/UI'

storiesOf('Components', module).addWithChapters('Dropdown', {
  chapters: [
    {
      sections: [
        {
          title: 'Left justify (default)',
          sectionFn: () => {
            const store = new Store({
              crypto: 'btc',
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
            return (
              <State store={store}>
                <Dropdown
                  activeKey={store.get('crypto')}
                  items={store.get('cryptoCurrencies')}
                  onChange={crypto => store.set({ crypto })}
                />
              </State>
            )
          }
        },
        {
          title: 'Right justify',
          sectionFn: () => {
            const store = new Store({
              fiat: 'usd',
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
            return (
              <State store={store}>
                <Dropdown
                  activeKey={store.get('fiat')}
                  items={store.get('fiatCurrencies')}
                  onChange={fiat => store.set({ fiat })}
                  justify="right"
                />
              </State>
            )
          }
        }
      ]
    }
  ]
})
