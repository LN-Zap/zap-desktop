import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Text } from 'components/UI'
import { CryptoValue } from 'containers/UI'

const ChannelLimits = ({ payLimitMsg, reqLimitMsg, currencyName, localBalance, remoteBalance }) => (
  <Flex justifyContent="space-between">
    <Flex width={1 / 2} flexDirection="column" alignItems="center">
      <Text fontWeight="normal">
        <FormattedMessage {...payLimitMsg} />
      </Text>
      <Text fontSize="s">
        <CryptoValue value={localBalance || 0} /> {currencyName}
      </Text>
    </Flex>
    <Flex width={1 / 2} flexDirection="column" alignItems="center">
      <Text fontWeight="normal">
        <FormattedMessage {...reqLimitMsg} />
      </Text>
      <Text fontSize="s">
        <CryptoValue value={remoteBalance || 0} /> {currencyName}
      </Text>
    </Flex>
  </Flex>
)

ChannelLimits.propTypes = {
  payLimitMsg: PropTypes.object.isRequired,
  reqLimitMsg: PropTypes.object.isRequired,
  currencyName: PropTypes.string.isRequired,
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired
}

export default ChannelLimits
