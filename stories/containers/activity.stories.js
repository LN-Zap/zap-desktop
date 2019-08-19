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
  .addDecorator(story => <Provider story={story()} />)
  .addDecorator(story => <Window>{story()}</Window>)
  .add('InvoiceModal', () => {
    const encoded = lightningPayReq.encode({
      coinType: 'testnet',
      satoshis: 15000,
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
          data: 15,
        },
        {
          tagName: 'description',
          data: 'Some items',
        },
      ],
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
      tx_hash: '1ae44a23c141a2892c55eb3fe9de45195d88e89b36b5070e10df92d4130e4028',
    }
    return (
      <Modal p={4}>
        <InvoiceModal
          item={invoice}
          mx="auto"
          showNotification={action('showNotification')}
          width={9 / 16}
        />
      </Modal>
    )
  })
  .add('PaymentModal', () => {
    const payment = {
      /* eslint-disable max-len */
      path: ['027455aef8453d92f4706b560b61527cc217ddf14da41770e8ed6607190a1851b8'],
      payment_hash: '31b4220da61c55bd350cb6d2c1a80af8fa0db53e93da56b0517788e343d85a48',
      value: 150,
      creation_date: 1564242488,
      fee: 0,
      payment_preimage: '1430c6f29ebe6d6e9ab17c45b87851f815fafb6f4d2f5e3047ed5d97872867aa',
      value_sat: 150,
      value_msat: 150000,
      payment_request:
        'lntb1500n1pwncu3npp5xx6zyrdxr32m6dgvkmfvr2q2lraqmdf7j0d9dvz3w7ywxs7ctfyqdqa2fjkzep6yp6x2um5ypc82unsdaek2cqzpgxqr23sgdyj3pdv2v8qqx9zhgcg7e6g3j5pxqpuzcawxvaayjsvakjuqnghn9pepax34djtnu9u3ham9qzdsal0vh0fpju9m9mpdx40sf9hqzcpzad5wg',
      status: 'SUCCEEDED',
      fee_sat: 0,
      fee_msat: 0,
      type: 'payment',
      dest_node_pubkey: '027455aef8453d92f4706b560b61527cc217ddf14da41770e8ed6607190a1851b8',
      dest_node_alias: 'testnet.yalls.org',
    }

    return (
      <Modal p={4}>
        <PaymentModal item={payment} mx="auto" width={9 / 16} />
      </Modal>
    )
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
      tx_hash: '1ae44a23c141a2892c55eb3fe9de45195d88e89b36b5070e10df92d4130e4028',
    }
    return (
      <Modal p={4}>
        <TransactionModal
          item={transaction}
          mx="auto"
          networkInfo={infoSelectors.networkInfo(store.getState())}
          width={9 / 16}
        />
      </Modal>
    )
  })
