import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Button } from 'components/UI'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const WalletButtons = ({ openModal }) => (
  <Box as="section">
    <Button mr={2} onClick={() => openModal('PAY_FORM')} width={145}>
      <FormattedMessage {...messages.pay} />
    </Button>
    <Button onClick={() => openModal('REQUEST_FORM')} width={145}>
      <FormattedMessage {...messages.request} />
    </Button>
  </Box>
)

WalletButtons.propTypes = {
  openModal: PropTypes.func.isRequired,
}

export default WalletButtons
