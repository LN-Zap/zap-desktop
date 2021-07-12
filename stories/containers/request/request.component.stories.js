/* eslint-disable max-len */

import React from 'react'

import lightningPayReq from '@ln-zap/bolt11'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { convert } from '@zap/utils/btc'
import { RequestSummary } from 'components/Request'

import { Provider } from '../../Provider'

const mockCreateInvoice = async (amount, currency, memo = '') => {
  const satoshis = convert(currency, 'sats', amount)
  const encoded = lightningPayReq.encode({
    coinType: 'bitcoin',
    satoshis,
    tags: [
      {
        tagName: 'purpose_commit_hash',
        data: '3925b6f67e2c340036ed12093dd44e0368df1b6ea26c53dbe4811f58fd5db8c1',
      },
      {
        tagName: 'payment_hash',
        data: '0001020304050607080900010203040506070809000102030405060708090102',
      },
      {
        tagName: 'expire_time',
        data: 30,
      },
      {
        tagName: 'description',
        data: memo,
      },
    ],
  })
  const privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
  const signed = lightningPayReq.sign(encoded, privateKeyHex)
  return signed.paymentRequest
}

storiesOf('Containers.Request', module)
  .addDecorator(story => <Provider story={story()} />)
  .add('RequestSummary', () => {
    return (
      <RequestSummary invoice={mockCreateInvoice()} showNotification={action('showNotification')} />
    )
  })
