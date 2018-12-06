import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import SuggestedNodes from 'components/Contacts/SuggestedNodes'

storiesOf('Containers.Network', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .add('SuggestedNodes', () => {
    const hasNodes = boolean('Has nodes', true)
    const suggestedNodesLoading = boolean('Is loading', false)

    const stateProps = {
      suggestedNodesLoading,
      suggestedNodes: hasNodes
        ? [
            {
              pubkey: '03e50492eab4107a773141bb419e107bda3de3d55652e6e1a41225f06a0bbf2d56',
              host: 'mainnet-lnd.yalls.org',
              nickname: 'Yalls',
              description:
                'Top up prepaid mobile phones with bitcoin and altcoins in USA and around the world'
            },
            {
              pubkey: '024655b768ef40951b20053a5c4b951606d4d86085d51238f2c67c7dec29c792ca',
              host: '88.98.213.235',
              nickname: 'Satoshis Place',
              description: 'Pay per pixel'
            },
            {
              pubkey: '0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b',
              host: '159.203.125.125',
              nickname: 'Lightning Faucet',
              description: 'Lightning Network Faucet'
            }
          ]
        : []
    }

    const dispatchProps = {
      setNode: action('setNode'),
      openSubmitChannelForm: action('openSubmitChannelForm')
    }

    return <SuggestedNodes {...stateProps} {...dispatchProps} />
  })
