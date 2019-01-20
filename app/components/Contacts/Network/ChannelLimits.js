import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Text } from 'components/UI'
import { Ticker } from '.'

const ChannelLimits = ({
  payLimitMsg,
  reqLimitMsg,
  currencyName,
  localBalance,
  remoteBalance,
  currentTicker,
  currency,
  fiatTicker
}) => (
  <Flex justifyContent="space-between">
    <Flex width={1 / 2} flexDirection="column" alignItems="center">
      <Text fontWeight="normal">
        <FormattedMessage {...payLimitMsg} />
      </Text>
      <Ticker
        size="s"
        currencyName={currencyName}
        channelBalance={localBalance}
        currentTicker={currentTicker}
        currency={currency}
        fiatTicker={fiatTicker}
      />
    </Flex>
    <Flex width={1 / 2} flexDirection="column" alignItems="center">
      <Text fontWeight="normal">
        <FormattedMessage {...reqLimitMsg} />
      </Text>
      <Ticker
        size="s"
        currencyName={currencyName}
        channelBalance={remoteBalance}
        currentTicker={currentTicker}
        currency={currency}
        fiatTicker={fiatTicker}
      />
    </Flex>
  </Flex>
)

ChannelLimits.propTypes = {
  payLimitMsg: PropTypes.object.isRequired,
  reqLimitMsg: PropTypes.object.isRequired,
  currencyName: PropTypes.string.isRequired,
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired,
  currentTicker: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  fiatTicker: PropTypes.string.isRequired
}

export default ChannelLimits
