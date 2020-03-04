import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage } from 'react-intl'
import { CoinBig } from '@zap/utils/coin'
import { convert } from '@zap/utils/btc'
import { decodePayReq, getNodeAlias, getTag } from '@zap/utils/crypto'
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
    cryptoUnitName: PropTypes.string.isRequired,
    /** Boolean indicating whether payment is to pubkey (or bolt11) */
    isPubkey: PropTypes.bool,
    /** Boolean indicating whether routing information is currently being fetched. */
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
    nodes: [],
    maxFee: 0,
    minFee: 0,
  }

  renderApproximateFiatAmount = amountInSatoshis => (
    /* eslint-disable shopify/jsx-no-hardcoded-content */
    <Text color="gray">
      ≈&nbsp;
      <FiatValue style="currency" value={amountInSatoshis} />
    </Text>
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  )

  render() {
    const {
      amount,
      cryptoUnitName,
      isPubkey,
      isQueryingRoutes,
      maxFee,
      minFee,
      nodes,
      payReq,
      ...rest
    } = this.props

    let payeeNodeKey
    let memo
    let amountInSatoshis = amount
    if (isPubkey) {
      payeeNodeKey = payReq
    } else {
      let invoice
      try {
        invoice = decodePayReq(payReq)
      } catch (e) {
        return null
      }
      payeeNodeKey = invoice.payeeNodeKey // eslint-disable-line prefer-destructuring
      memo = getTag(invoice, 'description')
      const { satoshis, millisatoshis } = invoice
      amountInSatoshis = satoshis || convert('msats', 'sats', millisatoshis) || amount
    }

    const nodeAlias = getNodeAlias(payeeNodeKey, nodes)
    const hasMinFee = minFee || minFee === 0
    const hasMaxFee = maxFee || maxFee === 0

    // Select an appropriate fee message...
    // Default to unknown.
    let feeMessage = messages.fee_unknown

    // If thex max fee is 0 or 1 then show a message like "less than 1".
    if (CoinBig(maxFee).gte(0) && CoinBig(maxFee).lt(1)) {
      feeMessage = messages.fee_less_than_1
    }
    // Otherwise, if we have both a min and max fee that are different, present the fee range.
    else if (hasMinFee && hasMaxFee && minFee !== maxFee) {
      feeMessage = messages.fee_range
    }
    // Finally, if we at least have a max fee then present it as upto that amount.
    else if (hasMaxFee) {
      feeMessage = messages.fee_upto
    }

    const totalAmountInSatoshis = hasMaxFee
      ? CoinBig.sum(amountInSatoshis, maxFee).toString()
      : amountInSatoshis

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
              {this.renderApproximateFiatAmount(amountInSatoshis)}
            </Box>
            <Box width={1 / 11}>
              <Text color="primaryAccent" textAlign="center">
                <BigArrowRight height="28px" width="40px" />
              </Text>
            </Box>
            <Box width={5 / 11}>
              <Text className="hint--bottom-left" data-hint={payeeNodeKey} textAlign="right">
                <Truncate maxlen={nodeAlias ? 30 : 15} text={nodeAlias || payeeNodeKey} />
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
                </Text>
                <Spinner color="primaryAccent" />
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
            <Flex alignItems="baseline">
              <CryptoSelector mr={2} />
              <CryptoValue value={totalAmountInSatoshis} />
            </Flex>
          }
        />

        <Bar variant="light" />

        {memo && <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />}
      </Box>
    )
  }
}

export default PaySummaryLightning
