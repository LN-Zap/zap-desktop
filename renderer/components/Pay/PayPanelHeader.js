import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Bar } from 'components/UI'

import { PAY_HEADER_TYPES, PAYMENT_TYPES } from './constants'
import messages from './messages'
import PayHeader from './PayHeader'

const PayPanelHeader = props => {
  const { chainName, cryptoUnitName, paymentType } = props
  let headerType = null
  const isBolt11 = paymentType === PAYMENT_TYPES.bolt11
  const isPubkey = paymentType === PAYMENT_TYPES.pubkey
  const isOnchain = paymentType === PAYMENT_TYPES.onchain
  if (isBolt11 || isPubkey) {
    headerType = PAY_HEADER_TYPES.offchain
  } else if (isOnchain) {
    headerType = PAY_HEADER_TYPES.onchain
  }

  return (
    <>
      <PayHeader
        title={
          <>
            <FormattedMessage {...messages.send} /> {chainName} ({cryptoUnitName})
          </>
        }
        type={headerType}
      />
      <Bar mt={2} />
    </>
  )
}

PayPanelHeader.propTypes = {
  chainName: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  paymentType: PropTypes.oneOf(Object.values(PAYMENT_TYPES)),
}

export default PayPanelHeader
