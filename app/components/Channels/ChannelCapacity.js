import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Card, Box, Flex } from 'rebass'
import { Heading, ProgressBar, Text } from 'components/UI'
import { CryptoSelector, CryptoValue } from 'containers/UI'
import ZapSolid from 'components/Icon/ZapSolid'
import messages from './messages'

const ChannelCapacity = ({ localBalance, remoteBalance, ...rest }) => {
  const totalBalance = localBalance + remoteBalance
  const localBalancePercent = localBalance / totalBalance
  const remoteBalancePercent = remoteBalance / totalBalance

  return (
    <Card as="article" {...rest}>
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
        <Text width={1 / 3.2}>
          <CryptoValue value={localBalance} />
        </Text>
        <Text width={1 / 2.6} textAlign="center">
          <CryptoValue value={totalBalance} />
          <CryptoSelector ml={1} />
        </Text>
        <Text width={1 / 3.2} textAlign="right">
          <CryptoValue value={remoteBalance} />
        </Text>
      </Flex>
    </Card>
  )
}

ChannelCapacity.propTypes = {
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired
}

export default ChannelCapacity
