import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import { CoinBig } from '@zap/utils/coin'
import { Text } from 'components/UI'
import { CryptoSelector, CryptoValue } from 'containers/UI'

import HtlcHops from './HtlcHops'

const Htlc = ({ route, isAmountVisible = true, ...rest }) => {
  const amountExcludingFees = CoinBig(route.totalAmt)
    .minus(route.totalFees)
    .toString()
  return (
    <Flex alignItems="center" justifyContent="space-between" {...rest}>
      {isAmountVisible && (
        <Text fontWeight="normal">
          <CryptoValue value={amountExcludingFees} />
          <CryptoSelector ml={2} />
        </Text>
      )}
      <HtlcHops hops={route.hops} />
    </Flex>
  )
}

Htlc.propTypes = {
  isAmountVisible: PropTypes.bool,
  route: PropTypes.object.isRequired,
}

export default Htlc
