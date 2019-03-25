import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { convert } from '@zap/utils/btc'
import { decodePayReq, getNodeAlias } from '@zap/utils/crypto'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Spinner, Text } from 'components/UI'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'
import { Truncate } from 'components/Util'
import messages from './messages'

class PaySummaryLightning extends React.Component {
  static propTypes = {
    /** Amount to send (in satoshis). */
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Ticker symbol of the currently selected cryptocurrency. */
    cryptoCurrencyTicker: PropTypes.string.isRequired,
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
  }

  static defaultProps = {
    isQueryingRoutes: false,
    minFee: null,
    maxFee: null,
    nodes: [],
  }

  render() {
    const {
      amount,
      cryptoCurrencyTicker,
      isQueryingRoutes,
      maxFee,
      minFee,
      nodes,
      payReq,
      ...rest
    } = this.props

    let invoice
    try {
      invoice = decodePayReq(payReq)
    } catch (e) {
      return null
    }

    const { satoshis, millisatoshis, payeeNodeKey } = invoice
    const descriptionTag = invoice.tags.find(tag => tag.tagName === 'description') || {}
    const memo = descriptionTag.data
    const amountInSatoshis = satoshis || convert('msats', 'sats', millisatoshis) || amount
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
              <Flex alignItems="baseline" flexWrap="wrap">
                <Box>
                  <Text fontSize="xxl" textAlign="left">
                    <CryptoValue value={amountInSatoshis} />
                  </Text>
                </Box>
                <CryptoSelector ml={2} />
              </Flex>
              <Text color="gray">
                {'≈ '}
                <FiatValue style="currency" value={amountInSatoshis} />
              </Text>
            </Box>
            <Box width={1 / 11}>
              <Text color="lightningOrange" textAlign="center">
                <BigArrowRight height="28px" width="40px" />
              </Text>
            </Box>
            <Box width={5 / 11}>
              <Text className="hint--bottom-left" data-hint={payeeNodeKey} textAlign="right">
                {<Truncate maxlen={nodeAlias ? 30 : 15} text={nodeAlias || payeeNodeKey} />}
              </Text>
            </Box>
          </Flex>
        </Box>

        <Bar variant="light" />

        <DataRow
          left={<FormattedMessage {...messages.fee} />}
          right={
            isQueryingRoutes ? (
              <Flex alignItems="center" justifyContent="flex-end" ml="auto">
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

        <Bar variant="light" />

        <DataRow
          left={<FormattedMessage {...messages.total} />}
          right={
            <React.Fragment>
              <CryptoValue value={amountInSatoshis + maxFee} /> {cryptoCurrencyTicker}
            </React.Fragment>
          }
        />

        <Bar variant="light" />

        {memo && <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />}
      </Box>
    )
  }
}

export default PaySummaryLightning
