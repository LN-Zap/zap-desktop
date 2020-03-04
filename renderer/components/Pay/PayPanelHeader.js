import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar } from 'components/UI'
import PayHeader from './PayHeader'
import messages from './messages'
import { PAY_HEADER_TYPES } from './constants'

const PayPanelHeader = props => {
  const { chainName, cryptoUnitName, isBolt11, isOnchain, isPubkey } = props
  let headerType = null
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
  isBolt11: PropTypes.bool,
  isOnchain: PropTypes.bool,
  isPubkey: PropTypes.bool,
}

export default PayPanelHeader
