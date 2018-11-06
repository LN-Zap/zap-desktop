/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { number, select, text } from '@storybook/addon-knobs'
import { State, Store } from '@sambego/storybook-state'
import { Modal, Page } from 'components/UI'
import { Pay, PayButtons, PayHeader, PaySummaryLightning, PaySummaryOnChain } from 'components/Pay'

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

const store = new Store({
  chain: 'bitcoin',
  network: 'testnet',
  cryptoName: 'Bitcoin',
  walletBalance: 10000000,
  channelBalance: 25000,
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

  onchainFees: {
    fastestFee: 100,
    halfHourFee: 70,
    hourFee: 30
  },

  nodes: [
    {
      pub_key: '03c856d2dbec7454c48f311031f06bb99e3ca1ab15a9b9b35de14e139aa663b463',
      alias: 'htlc.me'
    }
  ],
  routes: [],

  currentTicker: {
    USD: {
      last: 6477.78
    },
    EUR: {
      last: 5656.01
    },
    GBP: {
      last: 5052.73
    }
  },

  isProcessing: false
})

const mockPayInvoice = async () => {
  action('mockPayInvoice')
  store.set({ isProcessing: true })
  await delay(2000)
  store.set({ isProcessing: false })
}

const mockSendCoins = async () => {
  action('mockSendCoins')
  store.set({ isProcessing: true })
  await delay(2000)
  store.set({ isProcessing: false })
}

const mockQueryFees = async () => {
  action('mockQueryFees')
  store.set({ isQueryingFees: true })
  await delay(2000)
  store.set({
    onchainFees: {
      fastestFee: 8,
      halfHourFee: 8,
      hourFee: 4
    }
  })
  store.set({ isQueryingFees: false })
}

const mockQueryRoutes = async pubKey => {
  action('mockQueryRoutes', pubKey)
  store.set({ isQueryingRoutes: true })
  await delay(2000)
  const nodes = store.get('nodes')
  if (nodes.find(n => n.pub_key === pubKey)) {
    store.set({
      routes: [
        {
          total_time_lock: 547118,
          total_fees: '0',
          total_amt: '10000',
          hops: [
            {
              chan_id: '565542601916153857',
              chan_capacity: '15698',
              amt_to_forward: '10000',
              fee: '0',
              expiry: 546974,
              amt_to_forward_msat: '10000010',
              fee_msat: '21'
            }
          ],
          total_fees_msat: '21',
          total_amt_msat: '10000021'
        },
        {
          total_time_lock: 547118,
          total_fees: '0',
          total_amt: '10000',
          hops: [
            {
              chan_id: '565542601916153857',
              chan_capacity: '15698',
              amt_to_forward: '10000',
              fee: '0',
              expiry: 546974,
              amt_to_forward_msat: '10000010',
              fee_msat: '3'
            }
          ],
          total_fees_msat: '3',
          total_amt_msat: '10000021'
        }
      ]
    })
  } else {
    store.set({ routes: [] })
  }
  store.set({ isQueryingRoutes: false })
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

storiesOf('Containers.Pay', module)
  .add('Pay', () => {
    const network = select(
      'Network',
      {
        Testnet: 'testnet',
        Mainnet: 'mainnet'
      },
      'testnet'
    )

    return (
      <Page css={{ height: 'calc(100vh - 40px)' }}>
        <Modal onClose={action('clicked')}>
          <State store={store}>
            <Pay
              width={9 / 16}
              mx="auto"
              // State
              // initialPayReq="lntb100n1pdaetlfpp5rkj5acj5usdlqekv3548nx5zc58tsqghm8qy6pdkrn3h37ep5aqsdqqcqzysxqyz5vq7vsxfsnak9yd0rf0zxpg9tukykxjqwef72apfwq2meg7wlz8zg0nxh3fmmc0ayv8ac5xhnlwlxajatqwnh3qwdx6uruyqn47enq9w6qplzqccc"
              isProcessing={store.get('isProcessing')}
              chain={store.get('chain')}
              channelBalance={store.get('channelBalance')}
              network={network}
              cryptoCurrency={store.get('cryptoCurrency')}
              cryptoCurrencyTicker={store.get('cryptoCurrencyTicker')}
              cryptoCurrencies={store.get('cryptoCurrencies')}
              currentTicker={store.get('currentTicker')}
              cryptoName={store.get('cryptoName')}
              fiatCurrency={store.get('fiatCurrency')}
              fiatCurrencies={store.get('fiatCurrencies')}
              isQueryingFees={store.get('isQueryingFees')}
              isQueryingRoutes={store.get('isQueryingRoutes')}
              nodes={store.get('nodes')}
              walletBalance={store.get('walletBalance')}
              // Dispatch
              payInvoice={mockPayInvoice}
              setCryptoCurrency={setCryptoCurrency}
              setFiatCurrency={setFiatCurrency}
              sendCoins={mockSendCoins}
              queryFees={mockQueryFees}
              queryRoutes={mockQueryRoutes}
            />
          </State>
        </Modal>
      </Page>
    )
  })
  .addWithChapters('PayHeader', {
    chapters: [
      {
        sections: [
          {
            title: 'On-chain',
            sectionFn: () => <PayHeader title="Send Bitcoin" type="onchain" />
          },
          {
            title: 'Off-chain',
            sectionFn: () => <PayHeader title="Send Bitcoin" type="offchain" />
          },
          {
            title: 'Generic',
            sectionFn: () => <PayHeader title="Send Bitcoin" />
          }
        ]
      }
    ]
  })
  .addWithChapters('PaySummary', {
    chapters: [
      {
        sections: [
          {
            title: 'PaySummaryLightning',
            sectionFn: () => (
              <PaySummaryLightning
                // State
                cryptoCurrency={store.get('cryptoCurrency')}
                cryptoCurrencyTicker={store.get('cryptoCurrencyTicker')}
                cryptoCurrencies={store.get('cryptoCurrencies')}
                currentTicker={store.get('currentTicker')}
                fiatCurrency={store.get('fiatCurrency')}
                fiatCurrencies={store.get('fiatCurrencies')}
                minFee={12}
                maxFee={18}
                nodes={store.get('nodes')}
                payReq={text(
                  'Lightning Invoice',
                  'lntb100u1pdaxza7pp5x73t3j7xgvkzgcdvzgpdg74k4pn0uhwuxlxu9qssytjn77x7zs4qdqqcqzysxqyz5vqd20eaq5uferzgzwasu5te3pla7gv8tzk8gcdxlj7lpkygvfdwndhwtl3ezn9ltjejl3hsp36ps3z3e5pp4rzp2hgqjqql80ec3hyzucq4d9axl'
                )}
                // Dispatch
                setCryptoCurrency={setCryptoCurrency}
                setFiatCurrency={setFiatCurrency}
              />
            ),
            options: {
              decorator: story => <State store={store}>{story()}</State>
            }
          },
          {
            title: 'PaySummaryOnChain',
            sectionFn: () => {
              mockQueryFees()
              return (
                <PaySummaryOnChain
                  // State
                  address={text('Address', 'mmxyr3LNKbnbrf6jdGXZpCE4EDpMSZRf4c')}
                  amount={number('Amount (satoshis)', 10000)}
                  cryptoCurrency={store.get('cryptoCurrency')}
                  cryptoCurrencyTicker={store.get('cryptoCurrencyTicker')}
                  cryptoCurrencies={store.get('cryptoCurrencies')}
                  currentTicker={store.get('currentTicker')}
                  fiatCurrency={store.get('fiatCurrency')}
                  fiatCurrencies={store.get('fiatCurrencies')}
                  onchainFees={store.get('onchainFees')}
                  // Dispatch
                  queryFees={mockQueryFees}
                  setCryptoCurrency={setCryptoCurrency}
                  setFiatCurrency={setFiatCurrency}
                />
              )
            },
            options: {
              decorator: story => <State store={store}>{story()}</State>
            }
          }
        ]
      }
    ]
  })
  .addWithChapters('PayButtons', {
    chapters: [
      {
        sections: [
          {
            title: 'Default',
            sectionFn: () => <PayButtons previousStep={action('clicked')} />
          },
          {
            title: 'Disabled',
            sectionFn: () => <PayButtons previousStep={action('clicked')} disabled />
          },
          {
            title: 'Processing',
            sectionFn: () => <PayButtons previousStep={action('clicked')} processing />
          }
        ]
      }
    ]
  })
