/* eslint-disable max-len */

import React from 'react'

import { action } from '@storybook/addon-actions'
import { number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { PayButtons, PayHeader, PaySummaryLightning, PaySummaryOnChain } from 'components/Pay'
import { tickerSelectors } from 'reducers/ticker'

import { Provider, store } from '../../Provider'

const data = {
  chainName: 'Bitcoin',
  walletBalance: 47238944,
  walletBalanceConfirmed: 37236599,
  walletBalanceUnconfirmed: 10002345,
  channelBalance: 25000,
  onchainFees: {
    fast: 100,
    medium: 70,
    slow: 30,
  },

  nodes: [
    {
      pubKey: '03c856d2dbec7454c48f311031f06bb99e3ca1ab15a9b9b35de14e139aa663b463',
      alias: 'htlc.me',
    },
  ],
  routes: [],

  currentTicker: {
    USD: 6477.78,
    EUR: 5656.01,
    GBP: 5052.73,
  },

  isProcessing: false,
}

const mockQueryFees = async () => {
  action('mockQueryFees')
}

storiesOf('Containers.Pay', module)
  .addDecorator(story => <Provider story={story()} />)
  .addWithChapters('PayHeader', {
    chapters: [
      {
        sections: [
          {
            title: 'On-chain',
            sectionFn: () => <PayHeader title="Send Bitcoin" type="onchain" />,
          },
          {
            title: 'Off-chain',
            sectionFn: () => <PayHeader title="Send Bitcoin" type="offchain" />,
          },
          {
            title: 'Generic',
            sectionFn: () => <PayHeader title="Send Bitcoin" />,
          },
        ],
      },
    ],
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
                  cryptoUnit={tickerSelectors.cryptoUnit(state)}
                  cryptoUnitName={tickerSelectors.cryptoUnitName(state)}
                  maxFee="18"
                  minFee="12"
                  nodes={data.nodes}
                  payReq={text(
                    'Payment Request',
                    'lntb100u1pdaxza7pp5x73t3j7xgvkzgcdvzgpdg74k4pn0uhwuxlxu9qssytjn77x7zs4qdqqcqzysxqyz5vqd20eaq5uferzgzwasu5te3pla7gv8tzk8gcdxlj7lpkygvfdwndhwtl3ezn9ltjejl3hsp36ps3z3e5pp4rzp2hgqjqql80ec3hyzucq4d9axl'
                  )}
                />
              )
            },
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
                  cryptoUnit={tickerSelectors.cryptoUnit(state)}
                  cryptoUnitName={tickerSelectors.cryptoUnitName(state)}
                  onchainFees={data.onchainFees}
                  // Dispatch
                  queryFees={mockQueryFees}
                />
              )
            },
          },
        ],
      },
    ],
  })
  .addWithChapters('PayButtons', {
    chapters: [
      {
        sections: [
          {
            title: 'Default',
            sectionFn: () => <PayButtons previousStep={action('clicked')} />,
          },
          {
            title: 'Disabled',
            sectionFn: () => <PayButtons disabled previousStep={action('clicked')} />,
          },
          {
            title: 'Processing',
            sectionFn: () => <PayButtons previousStep={action('clicked')} processing />,
          },
        ],
      },
    ],
  })
