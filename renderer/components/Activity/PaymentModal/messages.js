import { defineMessages } from 'react-intl'

export default defineMessages({
  title_sent: 'Sent',
  subtitle: 'Lightning Payment',
  amount: 'Amount',
  destination: 'Destination',
  date_sent: 'Date sent',
  fee: 'Fee ({cryptoUnitName})',
  current_value: 'Current value',
  preimage: 'Payment preimage',
  memo: 'Memo',
  route: 'Route',
  htlc_title: 'HTLCs',
  htlc_description: 'This payment was sent with the following HTLCs',
  htlc_hop_hint: '{hopFee} {cryptoUnitName} fee',
})
