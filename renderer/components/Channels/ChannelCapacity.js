import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Card, Box, Flex as BaseFlex } from 'rebass/styled-components'
import styled from 'styled-components'
import { opacity } from 'styled-system'

import { CoinBig } from '@zap/utils/coin'
import ZapSolid from 'components/Icon/ZapSolid'
import { Heading, ProgressBar, Text as BaseText } from 'components/UI'
import { CryptoSelector, CryptoValue } from 'containers/UI'

import messages from './messages'

const Flex = styled(BaseFlex)(opacity)
const Text = styled(BaseText)(opacity)

const ChannelCapacity = ({ localBalance, remoteBalance, opacity, ...rest }) => {
  const local = CoinBig(localBalance)
  const remote = CoinBig(remoteBalance)
  const total = CoinBig.sum(local, remote)

  const totalBalance = total.toString()
  const localBalancePercent = local.dividedBy(total).toNumber()
  const remoteBalancePercent = remote.dividedBy(total).toNumber()

  return (
    <Card as="article" {...rest}>
      <Flex alignItems="center" as="header" justifyContent="space-between" opacity={opacity}>
        <Text width={1 / 3}>
          <Heading.H4 fontWeight="normal">
            <FormattedMessage {...messages.local_balance} />
          </Heading.H4>
        </Text>
        <Text textAlign="center" width={1 / 3}>
          <Heading.H4 fontWeight="normal">
            <FormattedMessage {...messages.capacity} />
          </Heading.H4>
        </Text>
        <Text textAlign="right" width={1 / 3}>
          <Heading.H4 fontWeight="normal">
            <FormattedMessage {...messages.remote_balance} />
          </Heading.H4>
        </Text>
      </Flex>

      <Flex alignItems="center" as="header" justifyContent="space-between" my={2} opacity={opacity}>
        <Box width="calc(50% - 15px)">
          <ProgressBar progress={localBalancePercent} />
        </Box>
        <Text color="primaryAccent" textAlign="center" width={30}>
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
  localBalance: PropTypes.string.isRequired,
  opacity: PropTypes.number,
  remoteBalance: PropTypes.string.isRequired,
}

export default ChannelCapacity
