import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Bar } from 'components/UI'
import PayHeader from './PayHeader'
import messages from './messages'

const PayPanelHeader = props => {
  const { chainName, cryptoUnitName, isLn, isOnchain } = props

  return (
    <>
      <PayHeader
        title={
          <>
            <FormattedMessage {...messages.send} /> {chainName} ({cryptoUnitName})
          </>
        }
        type={isLn ? 'offchain' : isOnchain ? 'onchain' : null}
      />
      <Bar mt={2} />
    </>
  )
}

PayPanelHeader.propTypes = {
  chainName: PropTypes.string.isRequired,
  cryptoUnitName: PropTypes.string.isRequired,
  isLn: PropTypes.bool,
  isOnchain: PropTypes.bool,
}

PayPanelHeader.defaultProps = {
  isLn: null,
  isOnchain: null,
}

export default PayPanelHeader
