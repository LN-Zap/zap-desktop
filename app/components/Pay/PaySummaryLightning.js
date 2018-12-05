import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import { satoshisToFiat } from 'lib/utils/btc'
import { decodePayReq, getNodeAlias } from 'lib/utils/crypto'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Dropdown, Spinner, Text, Value } from 'components/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

class PaySummaryLightning extends React.PureComponent {
  static propTypes = {
    /** Current ticker data as provided by blockchain.info */
    currentTicker: PropTypes.object.isRequired,
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
    /** Currently selected fiat currency (key). */
    fiatCurrency: PropTypes.string.isRequired,
    /** Boolean indicating wether routing information is currently being fetched. */
    isQueryingRoutes: PropTypes.bool,
    /** Maximum fee for the payment */
    maxFee: PropTypes.number,
    /** Minimumfee for the payment */
    minFee: PropTypes.number,
    /** List of nodes as returned by lnd */
    nodes: PropTypes.array,
    /** Lightning Payment request */
    payReq: PropTypes.string.isRequired,

    /** Set the current cryptocurrency. */
    setCryptoCurrency: PropTypes.func.isRequired
  }

  static defaultProps = {
    isQueryingRoutes: false,
    minFee: null,
    maxFee: null,
    nodes: []
  }

  render() {
    const {
      cryptoCurrency,
      cryptoCurrencyTicker,
      cryptoCurrencies,
      currentTicker,
      fiatCurrency,
      isQueryingRoutes,
      maxFee,
      minFee,
      nodes,
      payReq,
      setCryptoCurrency,
      ...rest
    } = this.props

    let invoice
    try {
      invoice = decodePayReq(payReq)
    } catch (e) {
      return null
    }

    const { satoshis, payeeNodeKey } = invoice
    const descriptionTag = invoice.tags.find(tag => tag.tagName === 'description') || {}
    const memo = descriptionTag.data
    const fiatAmount = satoshisToFiat(satoshis, currentTicker[fiatCurrency])
    const nodeAlias = getNodeAlias(payeeNodeKey, nodes)

    // Select an appropriate fee message...
    // Default to unknown.
    let feeMessage = messages.fee_unknown

    // If thex max fee is 0 or 1 then show a message like "less than 1".
    if (maxFee === 0 || maxFee === 1) {
      feeMessage = messages.fee_less_than_1
    }
    // Otherwise, if we have both a min and max fee that are different, present the fee range.
    else if (minFee !== null && maxFee !== null && minFee !== maxFee) {
      feeMessage = messages.fee_range
    }
    // Finally, if we at least have a max fee then present it as upto that amount.
    else if (maxFee) {
      feeMessage = messages.fee_upto
    }

    return (
      <Box {...rest}>
        <Box py={3}>
          <Flex alignItems="center">
            <Box width={5 / 11}>
              <Flex flexWrap="wrap" alignItems="baseline">
                <Box>
                  <Text textAlign="left" fontSize={6}>
                    <Value value={satoshis} currency={cryptoCurrency} />
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
                {'≈ '}
                <FormattedNumber currency={fiatCurrency} style="currency" value={fiatAmount} />
              </Text>
            </Box>
            <Box width={1 / 11}>
              <Text textAlign="center" color="lightningOrange">
                <BigArrowRight width="40px" height="28px" />
              </Text>
            </Box>
            <Box width={5 / 11}>
              <Text textAlign="right" className="hint--bottom-left" data-hint={payeeNodeKey}>
                {<Truncate text={nodeAlias || payeeNodeKey} maxlen={nodeAlias ? 30 : 15} />}
              </Text>
            </Box>
          </Flex>
        </Box>

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.fee} />}
          right={
            isQueryingRoutes ? (
              <Flex ml="auto" alignItems="center" justifyContent="flex-end">
                <Text mr={2}>
                  <FormattedMessage {...messages.searching_routes} />
                  &hellip;
                </Text>
                <Spinner color="lightningOrange" />
              </Flex>
            ) : (
              feeMessage && <FormattedMessage {...feeMessage} values={{ minFee, maxFee }} />
            )
          }
        />

        <Bar />

        <DataRow
          left={<FormattedMessage {...messages.total} />}
          right={
            <React.Fragment>
              <Value value={satoshis + maxFee} currency={cryptoCurrency} /> {cryptoCurrencyTicker}
            </React.Fragment>
          }
        />

        <Bar />

        {memo && <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />}
      </Box>
    )
  }
}

export default PaySummaryLightning
