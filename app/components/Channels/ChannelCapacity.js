import React from 'react'
import PropTypes from 'prop-types'
import { opacity } from 'styled-system'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Card, Box, Flex as BaseFlex } from 'rebass'
import { Heading, ProgressBar, Text as BaseText } from 'components/UI'
import { CryptoSelector, CryptoValue } from 'containers/UI'
import ZapSolid from 'components/Icon/ZapSolid'
import messages from './messages'

const Flex = styled(BaseFlex)(opacity)
const Text = styled(BaseText)(opacity)

const ChannelCapacity = ({ localBalance, remoteBalance, opacity, ...rest }) => {
  const totalBalance = localBalance + remoteBalance
  const localBalancePercent = localBalance / totalBalance
  const remoteBalancePercent = remoteBalance / totalBalance

  return (
    <Card as="article" {...rest}>
      <Flex as="header" justifyContent="space-between" alignItems="center" opacity={opacity}>
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

      <Flex as="header" justifyContent="space-between" alignItems="center" my={2} opacity={opacity}>
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
        <Text width={1 / 3.2} opacity={opacity}>
          <CryptoValue value={localBalance} />
        </Text>
        <Flex width={1 / 2.6} justifyContent="center" alignItems="center">
          <Text textAlign="center" lineHeight="1" opacity={opacity}>
            <CryptoValue value={totalBalance} />
          </Text>
          <CryptoSelector ml={1} buttonOpacity={opacity} />
        </Flex>

        <Text width={1 / 3.2} textAlign="right" opacity={opacity}>
          <CryptoValue value={remoteBalance} />
        </Text>
      </Flex>
    </Card>
  )
}

ChannelCapacity.propTypes = {
  localBalance: PropTypes.number.isRequired,
  remoteBalance: PropTypes.number.isRequired,
  opacity: PropTypes.number
}

export default ChannelCapacity
