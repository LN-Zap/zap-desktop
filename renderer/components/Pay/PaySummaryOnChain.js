import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Spinner, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

class PaySummaryOnChain extends React.Component {
  static propTypes = {
    /** Onchain address of recipient. */
    address: PropTypes.string.isRequired,
    /** Amount to send (in satoshis). */
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
    /** Fee in sats per byte */
    fee: PropTypes.number,
    /** Boolean indicating wether routing information is currently being fetched. */
    isQueryingFees: PropTypes.bool,
    /** Current fee information as provided by bitcoinfees.earn.com */
    onchainFees: PropTypes.shape({
      fastestFee: PropTypes.number,
      halfHourFee: PropTypes.number,
      hourFee: PropTypes.number,
    }),
    /** Method to fetch fee information for onchain transactions. */
    queryFees: PropTypes.func.isRequired,
    /** Confirmation speed */
    speed: PropTypes.string,
  }

  static defaultProps = {
    isQueryingFees: false,
    onchainFees: {},
  }

  componentDidMount() {
    const { queryFees } = this.props
    queryFees()
  }

  render() {
    const {
      amount,
      address,
      cryptoCurrencyTicker,
      onchainFees,
      isQueryingFees,
      fee,
      speed,
      ...rest
    } = this.props

    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <Flex alignItems="baseline" flexWrap="wrap">
                <Box>
                  <Text fontSize="xxl" textAlign="left">
                    <CryptoValue value={amount} />
                  </Text>
                </Box>
                <CryptoSelector ml={2} />
              </Flex>
              <Text color="gray">
                {' ≈ '}
                <FiatValue style="currency" value={amount} />
              </Text>
            </Box>
            <Box width={1 / 11}>
              <Text color="lightningOrange" textAlign="center">
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
          left={<FormattedMessage {...messages.fee} />}
          right={
            isQueryingFees ? (
              <Flex alignItems="center" justifyContent="flex-end" ml="auto">
                <Text mr={2}>
                  <FormattedMessage {...messages.calculating} />
                  &hellip;
                </Text>
                <Spinner color="lightningOrange" />
              </Flex>
            ) : fee ? (
              <React.Fragment>
                <Text>
                  {fee} satoshis <FormattedMessage {...messages.fee_per_byte} />
                </Text>
                <Text fontSize="s">
                  <FormattedMessage {...messages[speed.toLowerCase() + '_description']} />
                </Text>
              </React.Fragment>
            ) : (
              <FormattedMessage {...messages.fee_unknown} />
            )
          }
        />

        <Bar variant="light" />

        <DataRow
          left={<FormattedMessage {...messages.total} />}
          right={
            <React.Fragment>
              <CryptoValue value={amount} /> {cryptoCurrencyTicker}
              {!isQueryingFees && fee && <Text fontSize="s">(+ {fee} satoshis per byte)</Text>}
            </React.Fragment>
          }
        />
      </Box>
    )
  }
}

export default PaySummaryOnChain
