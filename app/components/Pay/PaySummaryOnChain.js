import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import get from 'lodash.get'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Spinner, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

class PaySummaryOnChain extends React.Component {
  static propTypes = {
    /** Amount to send (in satoshis). */
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Onchain address of recipient. */
    address: PropTypes.string.isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
    /** Current fee information as provided by bitcoinfees.earn.com */
    onchainFees: PropTypes.shape({
      fastestFee: PropTypes.number,
      halfHourFee: PropTypes.number,
      hourFee: PropTypes.number
    }),
    /** Boolean indicating wether routing information is currently being fetched. */
    isQueryingFees: PropTypes.bool,

    /** Method to fetch fee information for onchain transactions. */
    queryFees: PropTypes.func.isRequired
  }

  static defaultProps = {
    isQueryingFees: false,
    onchainFees: {}
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
      ...rest
    } = this.props

    const fee = get(onchainFees, 'fastestFee', null)
    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <Flex flexWrap="wrap" alignItems="baseline">
                <Box>
                  <Text textAlign="left" fontSize={6}>
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
              <Text textAlign="center" color="lightningOrange">
                <BigArrowRight width="40px" height="28px" />
              </Text>
            </Box>
            <Box width={5 / 11}>
              <Text textAlign="right" className="hint--bottom-left" data-hint={address}>
                <Truncate text={address} />
              </Text>
            </Box>
          </Flex>
        </Box>

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.fee} />}
          right={
            isQueryingFees ? (
              <Flex ml="auto" alignItems="center" justifyContent="flex-end">
                <Text mr={2}>
                  <FormattedMessage {...messages.calculating} />
                  &hellip;
                </Text>
                <Spinner color="lightningOrange" />
              </Flex>
            ) : !fee ? (
              <FormattedMessage {...messages.fee_unknown} />
            ) : (
              <React.Fragment>
                <Text>
                  {fee} satoshis <FormattedMessage {...messages.fee_per_byte} />
                </Text>
                <Text fontSize="s">
                  (<FormattedMessage {...messages.next_block_confirmation} />)
                </Text>
              </React.Fragment>
            )
          }
        />

        <Bar />

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
