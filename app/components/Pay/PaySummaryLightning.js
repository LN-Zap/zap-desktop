import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import lightningPayReq from 'bolt11'
import { satoshisToFiat } from 'lib/utils/btc'
import { getNodeAlias } from 'lib/utils/crypto'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, Dropdown, Spinner, Text, Truncate } from 'components/UI'
import Value from 'components/Value'
import { PaySummaryRow } from '.'
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
      setCryptoCurrency
    } = this.props

    let invoice
    try {
      invoice = lightningPayReq.decode(payReq)
    } catch (e) {
      return null
    }

    const { satoshis, payeeNodeKey } = invoice
    const descriptionTag = invoice.tags.find(tag => tag.tagName === 'description') || {}
    const memo = descriptionTag.data
    const fiatAmount = satoshisToFiat(satoshis, currentTicker[fiatCurrency].last)
    const nodeAlias = getNodeAlias(payeeNodeKey, nodes)

    return (
      <React.Fragment>
        <Box pb={2}>
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
                {<Truncate text={nodeAlias || payeeNodeKey} />}
              </Text>
            </Box>
          </Flex>
        </Box>

        <Bar />

        <PaySummaryRow
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
            ) : minFee === null || maxFee === null ? (
              <FormattedMessage {...messages.unknown} />
            ) : (
              <FormattedMessage {...messages.fee_range} values={{ minFee, maxFee }} />
            )
          }
        />

        <Bar />

        <PaySummaryRow
          left={<FormattedMessage {...messages.total} />}
          right={
            <React.Fragment>
              <Value value={satoshis} currency={cryptoCurrency} /> {cryptoCurrencyTicker}
              {!isQueryingRoutes &&
                maxFee && (
                  <Text fontSize="s">
                    (+ <FormattedMessage {...messages.upto} /> {maxFee} msats)
                  </Text>
                )}
            </React.Fragment>
          }
        />

        <Bar />

        {memo && <PaySummaryRow left={<FormattedMessage {...messages.memo} />} right={memo} />}
      </React.Fragment>
    )
  }
}

export default PaySummaryLightning
