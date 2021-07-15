import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { convert } from '@zap/utils/btc'
import { CoinBig } from '@zap/utils/coin'
import { decodePayReq, getNodeAlias, getTag } from '@zap/utils/crypto'
import { HtlcHops } from 'components/Activity/PaymentModal'
import BigArrowRight from 'components/Icon/BigArrowRight'
import { Bar, DataRow, Link, Spinner, Text, Tooltip } from 'components/UI'
import { Truncate } from 'components/Util'
import { CryptoSelector, CryptoValue, FiatValue } from 'containers/UI'

import messages from './messages'

const ConfigLink = ({ feeLimit, openModal, ...rest }) => (
  <Link onClick={() => openModal('SETTINGS')} {...rest}>
    {feeLimit}
  </Link>
)

ConfigLink.propTypes = {
  feeLimit: PropTypes.number.isRequired,
  openModal: PropTypes.func.isRequired,
}

class PaySummaryLightning extends React.Component {
  static propTypes = {
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    exactFee: PropTypes.string,
    feeLimit: PropTypes.number,
    isPubkey: PropTypes.bool,
    isQueryingRoutes: PropTypes.bool,
    maxFee: PropTypes.string,
    minFee: PropTypes.string,
    nodes: PropTypes.array,
    openModal: PropTypes.func.isRequired,
    payReq: PropTypes.string.isRequired,
    route: PropTypes.object,
  }

  static defaultProps = {
    nodes: [],
    maxFee: '0',
    minFee: '0',
  }

  renderApproximateFiatAmount = amountInSatoshis => (
    /* eslint-disable shopify/jsx-no-hardcoded-content */
    <Text color="gray">
      ≈&nbsp;
      <FiatValue style="currency" value={amountInSatoshis} />
    </Text>
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  )

  renderFee() {
    const { exactFee, feeLimit, maxFee, minFee, openModal } = this.props
    const hasExactFee = CoinBig(exactFee).isFinite()
    const hasMinFee = CoinBig(minFee).isFinite()
    const hasMaxFee = CoinBig(maxFee).isFinite()

    if (hasExactFee) {
      return (
        <Text>
          <CryptoSelector mr={2} />
          <CryptoValue value={exactFee} />
        </Text>
      )
    }

    // Select an appropriate fee message...
    let feeMessage
    if (hasMinFee || hasMaxFee) {
      // If thex max fee is 0 or 1 then show a message like "less than 1".
      if (hasMaxFee && maxFee >= 0 && maxFee < 1) {
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
    }

    if (feeMessage) {
      return <FormattedMessage {...feeMessage} values={{ minFee, maxFee }} />
    }

    return (
      <Flex alignItems="center">
        <Tooltip mr={1}>
          <FormattedMessage {...messages.no_route_tooltip} />
        </Tooltip>
        <FormattedMessage
          {...messages.fee_config_limit}
          values={{ maxFee: <ConfigLink feeLimit={feeLimit} mx={1} openModal={openModal} /> }}
        />
      </Flex>
    )
  }

  render() {
    const {
      amount,
      exactFee,
      isPubkey,
      isQueryingRoutes,
      maxFee,
      nodes,
      payReq,
      route,
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
      ;({ payeeNodeKey } = invoice)
      memo = getTag(invoice, 'description')
      const { satoshis, millisatoshis } = invoice
      amountInSatoshis = satoshis || convert('msats', 'sats', millisatoshis) || amount
    }

    const nodeAlias = getNodeAlias(payeeNodeKey, nodes)
    const totalAmountInSatoshis = CoinBig(exactFee).isFinite()
      ? CoinBig.sum(amountInSatoshis, exactFee).toString()
      : CoinBig.sum(amountInSatoshis, maxFee).toString()

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
              {route ? (
                <HtlcHops hops={route.hops} isAmountVisible={false} />
              ) : (
                <Text className="hint--bottom-left" data-hint={payeeNodeKey} textAlign="right">
                  <Truncate maxlen={nodeAlias ? 30 : 15} text={nodeAlias || payeeNodeKey} />
                </Text>
              )}
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
              this.renderFee()
            )
          }
        />

        <Bar variant="light" />

        <DataRow
          left={<FormattedMessage {...messages.total} />}
          right={
            isQueryingRoutes ? (
              <Flex alignItems="center" justifyContent="flex-end" ml="auto">
                <Text mr={2}>
                  <FormattedMessage {...messages.searching_routes} />
                </Text>
                <Spinner color="primaryAccent" />
              </Flex>
            ) : (
              <Flex alignItems="baseline">
                {totalAmountInSatoshis === 'NaN' ? (
                  <FormattedMessage {...messages.fee_unknown} />
                ) : (
                  <>
                    <CryptoSelector mr={2} />
                    <CryptoValue value={totalAmountInSatoshis} />
                  </>
                )}
              </Flex>
            )
          }
        />

        <Bar variant="light" />

        {memo && <DataRow left={<FormattedMessage {...messages.memo} />} right={memo} />}
      </Box>
    )
  }
}

export default PaySummaryLightning
