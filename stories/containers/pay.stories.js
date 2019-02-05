/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean, number, select, text } from '@storybook/addon-knobs'
import { Modal } from 'components/UI'
import { Pay, PayButtons, PayHeader, PaySummaryLightning, PaySummaryOnChain } from 'components/Pay'
import { tickerSelectors } from 'reducers/ticker'
import { Provider, store } from '../Provider'
import { Window, mockCreateInvoice } from '../helpers'

const data = {
  cryptoName: 'Bitcoin',
  walletBalance: 10000000,
  channelBalance: 25000,
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
    USD: 6477.78,
    EUR: 5656.01,
    GBP: 5052.73
  },

  isProcessing: false
}

const mockPayInvoice = async () => {
  action('mockPayInvoice')
}

const mockSendCoins = async () => {
  action('mockSendCoins')
}

const mockQueryFees = async () => {
  action('mockQueryFees')
}

const mockQueryRoutes = async pubKey => {
  action('mockQueryRoutes', pubKey)
}

const mockSetPayReq = async payReq => {
  action('mockSetPayReq', payReq)
}

storiesOf('Containers.Pay', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => (
    <Window>
      <Modal onClose={action('clicked')}>{story()}</Modal>
    </Window>
  ))
  .add('Pay', () => {
    const hasInvoicePreset = boolean('Use invoice preset', false)
    const coinType = select(
      'Coin Type',
      {
        'Bitcoin mainnet': 'bitcoin',
        'Bitcoin testnet': 'testnet',
        'Litecoin mainnet': 'litecoin',
        'Litecoin testnet': 'litecoin_testnet'
      },
      'bitcoin'
    )
    const unit = select(
      'Unit',
      {
        Satoshis: 'satoshis',
        Millisatoshis: 'millisatoshis'
      },
      'satoshis'
    )
    const amount = number('Amount')
    const memo = text('Memo')
    const payReq = hasInvoicePreset ? mockCreateInvoice(coinType, amount, unit, memo) : null

    const chain = ['bitcoin', 'testnet'].includes(coinType) ? 'bitcoin' : 'litecoin'
    const network = ['bitcoin', 'testnet'].includes(coinType) ? 'mainnet' : 'testnet'

    const state = store.getState()

    return (
      <Pay
        width={9 / 16}
        mx="auto"
        // State
        // initialPayReq="lntb100n1pdaetlfpp5rkj5acj5usdlqekv3548nx5zc58tsqghm8qy6pdkrn3h37ep5aqsdqqcqzysxqyz5vq7vsxfsnak9yd0rf0zxpg9tukykxjqwef72apfwq2meg7wlz8zg0nxh3fmmc0ayv8ac5xhnlwlxajatqwnh3qwdx6uruyqn47enq9w6qplzqccc"
        isProcessing={data.isProcessing}
        chain={chain}
        network={network}
        channelBalance={data.channelBalance}
        cryptoCurrency={state.ticker.currency}
        cryptoCurrencyTicker={tickerSelectors.currencyName(state)}
        cryptoName={data.cryptoName}
        walletBalance={data.walletBalance}
        payReq={payReq}
        // Dispatch
        payInvoice={mockPayInvoice}
        sendCoins={mockSendCoins}
        queryRoutes={mockQueryRoutes}
        setPayReq={mockSetPayReq}
      />
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
            sectionFn: () => {
              const state = store.getState()
              return (
                <PaySummaryLightning
                  // State
                  cryptoCurrency={state.ticker.currency}
                  cryptoCurrencyTicker={tickerSelectors.currencyName(state)}
                  minFee={12}
                  maxFee={18}
                  nodes={data.nodes}
                  payReq={text(
                    'Payment Request',
                    'lntb100u1pdaxza7pp5x73t3j7xgvkzgcdvzgpdg74k4pn0uhwuxlxu9qssytjn77x7zs4qdqqcqzysxqyz5vqd20eaq5uferzgzwasu5te3pla7gv8tzk8gcdxlj7lpkygvfdwndhwtl3ezn9ltjejl3hsp36ps3z3e5pp4rzp2hgqjqql80ec3hyzucq4d9axl'
                  )}
                />
              )
            }
          },
          {
            title: 'PaySummaryOnChain',
            sectionFn: () => {
              mockQueryFees()
              const state = store.getState()
              return (
                <PaySummaryOnChain
                  // State
                  address={text('Address', 'mmxyr3LNKbnbrf6jdGXZpCE4EDpMSZRf4c')}
                  amount={number('Amount (satoshis)', 10000)}
                  cryptoCurrency={state.ticker.currency}
                  cryptoCurrencyTicker={tickerSelectors.currencyName(state)}
                  onchainFees={data.onchainFees}
                  // Dispatch
                  queryFees={mockQueryFees}
                />
              )
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
