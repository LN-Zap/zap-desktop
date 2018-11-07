import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import get from 'lodash.get'
import { satoshisToFiat } from 'lib/utils/btc'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Dropdown, Spinner, Text, Truncate, Value } from 'components/UI'
import messages from './messages'

class PaySummaryOnChain extends React.Component {
  static propTypes = {
    /** Amount to send (in satoshis). */
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Onchain address of recipient. */
    address: PropTypes.string.isRequired,
    /** Currently selected cryptocurrency (key). */
    cryptoCurrency: PropTypes.string.isRequired,
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
    /** List of supported cryptocurrencies. */
    cryptoCurrencies: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    /** Current ticker data as provided by blockchain.info */
    currentTicker: PropTypes.object.isRequired,
    /** Current fee information as provided by bitcoinfees.earn.com */
    onchainFees: PropTypes.shape({
      fastestFee: PropTypes.number,
      halfHourFee: PropTypes.number,
      hourFee: PropTypes.number
    }),
    /** Currently selected fiat currency (key). */
    fiatCurrency: PropTypes.string.isRequired,
    /** Boolean indicating wether routing information is currently being fetched. */
    isQueryingFees: PropTypes.bool,

    /** Method to fetch fee information for onchain transactions. */
    queryFees: PropTypes.func.isRequired,
    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired
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
      cryptoCurrency,
      cryptoCurrencyTicker,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      onchainFees,
      isQueryingFees,
      setCryptoCurrency,
      ...rest
    } = this.props

    const fiatAmount = satoshisToFiat(amount, currentTicker[fiatCurrency].last)
    const fee = get(onchainFees, 'fastestFee', null)
    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <Flex flexWrap="wrap" alignItems="baseline">
                <Box>
                  <Text textAlign="left" fontSize={6}>
                    <Value value={amount} currency={cryptoCurrency} />
                  </Text>
                </Box>
                <Dropdown
                  activeKey={cryptoCurrency}
                  items={cryptoCurrencies}
                  onChange={setCryptoCurrency}
                  ml={2}
                />
              </Flex>
              <Text color="gray">
                {' ≈ '}
                <FormattedNumber currency={fiatCurrency} style="currency" value={fiatAmount} />
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
              <Value value={amount} currency={cryptoCurrency} /> {cryptoCurrencyTicker}
              {!isQueryingFees && fee && <Text fontSize="s">(+ {fee} satoshis per byte)</Text>}
            </React.Fragment>
          }
        />
      </Box>
    )
  }
}

export default PaySummaryOnChain
