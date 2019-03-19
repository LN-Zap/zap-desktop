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
      <Flex alignItems="center" as="header" justifyContent="space-between" opacity={opacity}>
        <Text width={1 / 3}>
          <Heading.h4 fontWeight="normal">
            <FormattedMessage {...messages.local_balance} />
          </Heading.h4>
        </Text>
        <Text textAlign="center" width={1 / 3}>
          <Heading.h4 fontWeight="normal">
            <FormattedMessage {...messages.capacity} />
          </Heading.h4>
        </Text>
        <Text textAlign="right" width={1 / 3}>
          <Heading.h4 fontWeight="normal">
            <FormattedMessage {...messages.remote_balance} />
          </Heading.h4>
        </Text>
      </Flex>

      <Flex alignItems="center" as="header" justifyContent="space-between" my={2} opacity={opacity}>
        <Box width="calc(50% - 15px)">
          <ProgressBar progress={localBalancePercent} />
        </Box>
        <Text color="lightningOrange" textAlign="center" width={30}>
          <ZapSolid fill="currentColor" height="20px" />
        </Text>
        <Box width="calc(50% - 15px)">
          <ProgressBar color="superBlue" justify="right" progress={remoteBalancePercent} />
        </Box>
      </Flex>

      <Flex as="footer" justifyContent="space-between">
        <Text opacity={opacity} width={1 / 3.2}>
          <CryptoValue value={localBalance} />
        </Text>
        <Flex alignItems="center" justifyContent="center" width={1 / 2.6}>
          <Text lineHeight="1" opacity={opacity} textAlign="center">
            <CryptoValue value={totalBalance} />
          </Text>
          <CryptoSelector buttonOpacity={opacity} ml={1} />
        </Flex>

        <Text opacity={opacity} textAlign="right" width={1 / 3.2}>
          <CryptoValue value={remoteBalance} />
        </Text>
      </Flex>
    </Card>
  )
}

ChannelCapacity.propTypes = {
  localBalance: PropTypes.number.isRequired,
  opacity: PropTypes.number,
  remoteBalance: PropTypes.number.isRequired,
}

export default ChannelCapacity
