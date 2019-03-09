/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import lightningPayReq from 'bolt11'
import { convert } from 'lib/utils/btc'
import { RequestSummary } from 'components/Request'
import { Provider } from '../../Provider'

const mockCreateInvoice = async (amount, currency, memo = '') => {
  const satoshis = convert(currency, 'sats', amount)
  var encoded = lightningPayReq.encode({
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
  var privateKeyHex = 'e126f68f7eafcc8b74f54d269fe206be715000f94dac067d1c04a8ca3b2db734'
  var signed = lightningPayReq.sign(encoded, privateKeyHex)
  return signed.paymentRequest
}

const payReq = text(
  'Payment Request',
  'lntb10170n1pda7tarpp59kjlzct447ttxper43kek78lhwgxk4gy8nfvpjdr7yzkscu2ds5qdzy2pshjmt9de6zqen0wgsrzvp3xus8q6tcv4k8xgrpwss8xct5daeks6tn9ecxcctrv5hqxqzjccqp2yvpzcn2xazu9rt8nrhn2xf6nyrj8fsfw9hafsf0p80trypu4tp58km5mn7wz50uh06kxf4t8kdj64f86u6l5ksl75r500zl7urhacxspcm4ye9'
)

storiesOf('Containers.Request', module)
  .addParameters({ info: { disable: true } })
  .addDecorator(story => <Provider story={story()} />)
  .add('RequestSummary', () => {
    return (
      <RequestSummary
        invoice={mockCreateInvoice()}
        payReq={payReq}
        showNotification={action('showNotification')}
      />
    )
  })
