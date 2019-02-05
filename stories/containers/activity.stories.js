import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import lightningPayReq from 'bolt11'
import { Modal } from 'components/UI'
import { InvoiceModal } from 'components/Activity/InvoiceModal'
import { PaymentModal } from 'components/Activity/PaymentModal'
import { TransactionModal } from 'components/Activity/TransactionModal'
import { infoSelectors } from 'reducers/info'
import { Provider, store } from '../Provider'
import { Window } from '../helpers'

storiesOf('Containers.Activity', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => (
    <Window>
      <Modal>{story()}</Modal>
    </Window>
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
      <InvoiceModal
        width={9 / 16}
        mx="auto"
        item={invoice}
        showNotification={action('showNotification')}
      />
    )
  })
  .add('PaymentModal', () => {
    const payment = {
      value: 15000,
      creation_date: Math.round(new Date().getTime() / 1000),
      payment_preimage: '46914421ed5eafea1ec40726338bc5059e80e128660b9c7c8a5817e59429af30'
    }
    return <PaymentModal width={9 / 16} mx="auto" item={payment} />
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
      <TransactionModal
        width={9 / 16}
        mx="auto"
        item={transaction}
        networkInfo={infoSelectors.networkInfo(store.getState())}
      />
    )
  })
