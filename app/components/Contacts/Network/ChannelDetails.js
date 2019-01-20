import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Bar } from 'components/UI'
import { ClosingChannel, CloseChannel, ChannelLimits, ChannelPubkey } from '.'

const ChannelDetails = ({
  isClosing,
  payLimitMsg,
  reqLimitMsg,
  currencyName,
  localBalance,
  remoteBalance,
  currentTicker,
  currency,
  fiatTicker,
  closingMessage,
  status,
  onRemoveClick,
  canClose,
  pubkey
}) => (
  <Box as="section" py={2} bg="secondaryColor">
    <ChannelPubkey pubkey={pubkey} />

    <Bar borderColor="primaryColor" borderBottom={2} my={3} />
    <ChannelLimits
      payLimitMsg={payLimitMsg}
      reqLimitMsg={reqLimitMsg}
      currencyName={currencyName}
      localBalance={localBalance}
      remoteBalance={remoteBalance}
      currentTicker={currentTicker}
      currency={currency}
      fiatTicker={fiatTicker}
    />

    {isClosing && <ClosingChannel message={closingMessage} />}
    {canClose && <CloseChannel message={status} onCloseClick={onRemoveClick} />}
  </Box>
)

ChannelDetails.propTypes = {
  isClosing: PropTypes.bool.isRequired,
  payLimitMsg: PropTypes.object.isRequired,
  reqLimitMsg: PropTypes.object.isRequired,
  currencyName: PropTypes.string.isRequired,
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  fiatTicker: PropTypes.string.isRequired,
  closingMessage: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  canClose: PropTypes.bool.isRequired,
  pubkey: PropTypes.string.isRequired
}

export default ChannelDetails
