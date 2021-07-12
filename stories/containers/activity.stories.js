import React from 'react'

import lightningPayReq from '@ln-zap/bolt11'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { InvoiceModal } from 'components/Activity/InvoiceModal'
import { PaymentModal } from 'components/Activity/PaymentModal'
import { TransactionModal } from 'components/Activity/TransactionModal'
import { Modal } from 'components/UI'
import { infoSelectors } from 'reducers/info'

import { Window } from '../helpers'
import { Provider, store } from '../Provider'

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
      isSettled: boolean('Settled', false),
      creationDate: Math.round(Date.now() / 1000),
      settleDate: Math.round(Date.now() / 1000),
      paymentRequest: signed.paymentRequest,
      memo: signed.tags.find(t => t.tagName === 'description').data,
      txHash: '1ae44a23c141a2892c55eb3fe9de45195d88e89b36b5070e10df92d4130e4028',
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
      paymentHash: '31b4220da61c55bd350cb6d2c1a80af8fa0db53e93da56b0517788e343d85a48',
      value: 150,
      creationDate: 1564242488,
      fee: 0,
      paymentPreimage: '1430c6f29ebe6d6e9ab17c45b87851f815fafb6f4d2f5e3047ed5d97872867aa',
      valueSat: 150,
      valueMsat: 150000,
      paymentRequest:
        'lntb1500n1pwncu3npp5xx6zyrdxr32m6dgvkmfvr2q2lraqmdf7j0d9dvz3w7ywxs7ctfyqdqa2fjkzep6yp6x2um5ypc82unsdaek2cqzpgxqr23sgdyj3pdv2v8qqx9zhgcg7e6g3j5pxqpuzcawxvaayjsvakjuqnghn9pepax34djtnu9u3ham9qzdsal0vh0fpju9m9mpdx40sf9hqzcpzad5wg',
      status: 'SUCCEEDED',
      feeSat: 0,
      feeMsat: 0,
      type: 'payment',
      destNodePubkey: '027455aef8453d92f4706b560b61527cc217ddf14da41770e8ed6607190a1851b8',
      destNodeAlias: 'testnet.yalls.org',
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
      totalFees: 1000,
      received: boolean('Received', true),
      timeStamp: Math.round(Date.now() / 1000),
      destAddresses: ['2NEEBwPWMQ2CDurRzWgCETwuXvzgZ6pqzY8'],
      blockHeight: 555466,
      blockHash: '000000000012ac9338c1b53499dfcd6c44c4b96b40e038f4536639d3c3852169',
      txHash: '1ae44a23c141a2892c55eb3fe9de45195d88e89b36b5070e10df92d4130e4028',
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
