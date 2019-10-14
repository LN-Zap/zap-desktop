import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'components/UI'
import messages from './messages'

const WalletButtons = ({ openModal, totalBalance }) => {
  const intl = useIntl()

  return (
    <Box as="section">
      <Button mr={2} onClick={() => openModal('PAY_FORM')} width={145}>
        <FormattedMessage {...messages.pay} />
      </Button>
      <Button
        className="hint--bottom-left"
        data-hint={totalBalance ? null : intl.formatMessage({ ...messages.request_disabled_memo })}
        isDisabled={!totalBalance}
        onClick={() => openModal('REQUEST_FORM')}
        width={145}
      >
        <FormattedMessage {...messages.request} />
      </Button>
    </Box>
  )
}

WalletButtons.propTypes = {
  openModal: PropTypes.func.isRequired,
  totalBalance: PropTypes.number,
}

export default WalletButtons
