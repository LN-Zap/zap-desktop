import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { useIntl, FormattedNumber, FormattedMessage } from 'react-intl'
import { CoinBig } from '@zap/utils/coin'
import { getDisplayNodeName } from 'reducers/payment/utils'
import { Truncate } from 'components/Util'
import { CryptoSelector, CryptoValue } from 'containers/UI'
import { Bar, Text, Span } from 'components/UI'
import ArrowRight from 'components/Icon/ArrowRight'
import messages from './messages'

const HtlcHops = ({ hops, ...rest }) => {
  const { formatMessage } = useIntl()
  return (
    <Flex {...rest} flexDirection="column">
      {hops.map(hop => {
        const displayName = getDisplayNodeName(hop)
        return (
          <Flex
            key={hop.pubKey}
            alignItems="center"
            className="hint--top-left"
            data-hint={formatMessage(
              { ...messages.htlc_hop_hint },
              { hopFee: hop.feeMsat, cryptoUnitName: 'msat' }
            )}
            justifyContent="flex-end"
          >
            <Flex alignItems="center" color="gray" mx={2}>
              <ArrowRight />
            </Flex>
            <Truncate maxlen={50} text={displayName} />
          </Flex>
        )
      })}
    </Flex>
  )
}

HtlcHops.propTypes = {
  hops: PropTypes.array.isRequired,
}

const Htlc = ({ htlc, ...rest }) => {
  const amountExcludingFees = CoinBig(htlc.route.totalAmt)
    .minus(htlc.route.totalFees)
    .toString()
  return (
    <Flex alignItems="center" justifyContent="space-between" {...rest}>
      <Text width={4 / 12}>
        <CryptoValue value={amountExcludingFees} />
      </Text>
      <Text width={3 / 12}>
        <FormattedNumber value={htlc.route.totalFeesMsat} />
      </Text>
      <Text width={5 / 12}>
        <HtlcHops hops={htlc.route.hops} />
      </Text>
    </Flex>
  )
}

Htlc.propTypes = {
  htlc: PropTypes.object.isRequired,
}

const Header = () => (
  /* eslint-disable shopify/jsx-no-hardcoded-content */
  <Flex alignItems="center" justifyContent="space-between" width={1}>
    <Text fontWeight="normal" width={4 / 12}>
      <FormattedMessage {...messages.amount} />
      <Span ml={2}>
        (<CryptoSelector />)
      </Span>
    </Text>
    <Text fontWeight="normal" width={3 / 12}>
      <FormattedMessage {...messages.fee} values={{ cryptoUnitName: 'msat' }} />
    </Text>
    <Text fontWeight="normal" textAlign="right" width={5 / 12}>
      <FormattedMessage {...messages.route} />
    </Text>
  </Flex>
  /* eslint-enable shopify/jsx-no-hardcoded-content */
)

const Route = ({ htlcs, ...rest }) => {
  return (
    <Box {...rest}>
      <Text mb={3}>
        <FormattedMessage {...messages.htlc_description} />
      </Text>
      <Header />
      <Box py={2}>
        {htlcs.map(htlc => (
          <React.Fragment key={htlc.attemptTimeNs + htlc.resolveTimeNs}>
            <Bar opacity={0.2} variant="light" />
            <Htlc htlc={htlc} my={2} />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  )
}

Route.propTypes = {
  htlcs: PropTypes.array.isRequired,
}

export default Route
