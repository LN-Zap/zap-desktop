import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { TransactionSpeedDesc } from 'components/Form'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Spinner, Text } from 'components/UI'
import { Truncate } from 'components/Util'
import { CryptoValueSelector, FiatValue } from 'containers/UI'

import messages from './messages'

class PaySummaryOnChain extends React.Component {
  static propTypes = {
    /** Onchain address of recipient. */
    address: PropTypes.string.isRequired,
    /** Amount to send (in satoshis). */
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoUnitName: PropTypes.string.isRequired,
    /** Fee in sats per byte */
    fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Boolean indicating whether transaction is a coin sweep. */
    isCoinSweep: PropTypes.bool,
    /** Boolean indicating whether routing information is currently being fetched. */
    isQueryingFees: PropTypes.bool,
    lndTargetConfirmations: PropTypes.object.isRequired,
    /** Current fee information as provided by bitcoinfees.earn.com */
    onchainFees: PropTypes.shape({
      fast: PropTypes.string,
      medium: PropTypes.string,
      slow: PropTypes.string,
    }),
    /** Method to fetch fee information for onchain transactions. */
    queryFees: PropTypes.func.isRequired,
    /** Confirmation speed */
    speed: PropTypes.string,
  }

  static defaultProps = {
    onchainFees: {},
  }

  componentDidMount() {
    const { queryFees, address, amount } = this.props
    queryFees(address, amount)
  }

  renderFee() {
    const { isQueryingFees, lndTargetConfirmations, fee, speed } = this.props
    if (isQueryingFees) {
      return (
        <Flex alignItems="center" justifyContent="flex-end" ml="auto">
          <Text mr={2}>
            <FormattedMessage {...messages.calculating} />
          </Text>
          <Spinner color="primaryAccent" />
        </Flex>
      )
    }
    if (fee) {
      return (
        <>
          <Flex>
            <CryptoValueSelector mr={2} value={fee} />
            <Text>
              <FormattedMessage {...messages.fee_per_byte} />
            </Text>
          </Flex>

          <TransactionSpeedDesc
            fontSize="s"
            lndTargetConfirmations={lndTargetConfirmations}
            speed={speed}
          />
        </>
      )
    }
    return <FormattedMessage {...messages.fee_unknown} />
  }

  renderApproximateFiatAmount = () => {
    const { amount } = this.props

    /* eslint-disable shopify/jsx-no-hardcoded-content */
    return (
      <Text color="gray">
        ≈&nbsp;
        <FiatValue style="currency" value={amount} />
      </Text>
    )
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  }

  render() {
    const { amount, address, isCoinSweep, ...rest } = this.props
    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <CryptoValueSelector fontSize="xxl" value={amount} />
              {this.renderApproximateFiatAmount()}
            </Box>
            <Box width={1 / 11}>
              <Text color="primaryAccent" textAlign="center">
                <BigArrowRight height="28px" width="40px" />
              </Text>
            </Box>
            <Box width={5 / 11}>
              <Text className="hint--bottom-left" data-hint={address} textAlign="right">
                <Truncate text={address} />
              </Text>
            </Box>
          </Flex>
        </Box>

        <Bar variant="light" />

        <DataRow
          left={
            <Box>
              <Text>
                <FormattedMessage {...messages.fee} />
              </Text>
              <Text color="gray" fontWeight="light">
                <FormattedMessage {...messages[isCoinSweep ? 'fee_subtraction' : 'fee_addition']} />
              </Text>
            </Box>
          }
          right={this.renderFee()}
        />
      </Box>
    )
  }
}

export default PaySummaryOnChain
