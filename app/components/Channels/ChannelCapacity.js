import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Dropdown, Heading, ProgressBar, Text, Value } from 'components/UI'
import ZapSolid from 'components/Icon/ZapSolid'
import messages from './messages'

const ChannelCapacity = ({
  cryptoCurrency,
  cryptoCurrencies,
  localBalance,
  remoteBalance,
  setCryptoCurrency
}) => {
  const totalBalance = localBalance + remoteBalance
  const localBalancePercent = localBalance / totalBalance
  const remoteBalancePercent = remoteBalance / totalBalance

  return (
    <Box as="article">
      <Flex as="header" justifyContent="space-between" alignItems="center">
        <Text width={1 / 3}>
          <Heading.h4 fontWeight="normal">
            <FormattedMessage {...messages.local_balance} />
          </Heading.h4>
        </Text>
        <Text width={1 / 3} textAlign="center">
          <Heading.h4 fontWeight="normal">
            <FormattedMessage {...messages.capacity} />
          </Heading.h4>
        </Text>
        <Text width={1 / 3} textAlign="right">
          <Heading.h4 fontWeight="normal">
            <FormattedMessage {...messages.remote_balance} />
          </Heading.h4>
        </Text>
      </Flex>

      <Flex as="section" justifyContent="space-between" alignItems="center" my={2}>
        <Box width="calc(50% - 15px)">
          <ProgressBar progress={localBalancePercent} />
        </Box>
        <Text width={30} textAlign="center" color="lightningOrange">
          <ZapSolid height="20px" fill="currentColor" />
        </Text>
        <Box width="calc(50% - 15px)">
          <ProgressBar progress={remoteBalancePercent} justify="right" color="superBlue" />
        </Box>
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        <Text width={1 / 3}>
          <Value value={localBalance} currency={cryptoCurrency} />
        </Text>
        <Text width={1 / 3} textAlign="center">
          <Value value={totalBalance} currency={cryptoCurrency} />
          <Dropdown
            items={cryptoCurrencies}
            activeKey={cryptoCurrency}
            onChange={setCryptoCurrency}
            ml={1}
          />
        </Text>
        <Text width={1 / 3} textAlign="right">
          <Value value={remoteBalance} currency={cryptoCurrency} />
        </Text>
      </Flex>
    </Box>
  )
}

ChannelCapacity.propTypes = {
  cryptoCurrency: PropTypes.string.isRequired,
  cryptoCurrencies: PropTypes.array.isRequired,
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired,
  setCryptoCurrency: PropTypes.func.isRequired
}

export default ChannelCapacity
