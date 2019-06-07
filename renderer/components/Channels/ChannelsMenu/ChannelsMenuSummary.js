import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
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
  currencyName,
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
          {currencyName}
        </>
      }
      color="lightningOrange"
      title={<FormattedMessage {...messages.summary_row_lightning_title} />}
    />
    {pendingBalance > 0 && (
      <SummaryRow
        body={
          <>
            <CryptoValue mr={1} value={pendingBalance} />
            {currencyName}
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
          {currencyName}
        </>
      }
      color="gray"
      css={`
        opacity: 0.5;
      `}
      title={<FormattedMessage {...messages.summary_row_onchain_title} />}
    />
  </Box>
)

ChannelsMenuSummary.propTypes = {
  currencyName: PropTypes.string.isRequired,
  lightningBalance: PropTypes.number.isRequired,
  onchainBalance: PropTypes.number.isRequired,
  pendingBalance: PropTypes.number.isRequired,
}

export default ChannelsMenuSummary
