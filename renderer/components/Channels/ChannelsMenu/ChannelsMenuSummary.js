import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage } from 'react-intl'
import { Bar, Text } from 'components/UI'
import { CryptoValue } from 'containers/UI'
import messages from './messages'

const SummaryRow = ({ title, body, color, ...rest }) => (
  <Flex alignItems="center" justifyContent="space-between" {...rest}>
    <Text color={color} fontWeight="normal">
      {title}
    </Text>
    <Text color={color}>{body}</Text>
  </Flex>
)

SummaryRow.propTypes = {
  body: PropTypes.node.isRequired,
  color: PropTypes.string,
  title: PropTypes.node.isRequired,
}

const ChannelsMenuSummary = ({
  cryptoUnitName,
  lightningBalance,
  onchainBalance,
  pendingBalance,
  ...rest
}) => (
  <Box {...rest}>
    <SummaryRow
      body={
        <>
          <CryptoValue mr={1} value={lightningBalance} />
          {cryptoUnitName}
        </>
      }
      color="primaryAccent"
      title={<FormattedMessage {...messages.summary_row_lightning_title} />}
    />
    {pendingBalance > 0 && (
      <SummaryRow
        body={
          <>
            <CryptoValue mr={1} value={pendingBalance} />
            {cryptoUnitName}
          </>
        }
        color="gray"
        title={<FormattedMessage {...messages.summary_row_pending_title} />}
      />
    )}

    <Bar my={1} variant="light" />
    <SummaryRow
      body={
        <>
          <CryptoValue mr={1} value={onchainBalance} />
          {cryptoUnitName}
        </>
      }
      color="gray"
      opacity={0.5}
      title={<FormattedMessage {...messages.summary_row_onchain_title} />}
    />
  </Box>
)

ChannelsMenuSummary.propTypes = {
  cryptoUnitName: PropTypes.string.isRequired,
  lightningBalance: PropTypes.number.isRequired,
  onchainBalance: PropTypes.number.isRequired,
  pendingBalance: PropTypes.number.isRequired,
}

export default ChannelsMenuSummary
