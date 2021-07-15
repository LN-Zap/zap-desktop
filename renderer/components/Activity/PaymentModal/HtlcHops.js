import React from 'react'

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { CoinBig } from '@zap/utils/coin'
import ArrowRight from 'components/Icon/ArrowRight'
import { Truncate } from 'components/Util'
import { getDisplayNodeName } from 'reducers/payment/utils'

import messages from './messages'

const HtlcHops = ({ hops, ...rest }) => {
  const { formatMessage, formatNumber } = useIntl()
  return (
    <Flex {...rest} flexDirection="column">
      {hops.map((hop, index) => {
        const displayName = getDisplayNodeName(hop)
        const hasFee = CoinBig(hop.feeMsat).gt(0)
        const isLast = index === hops.length - 1
        const multiHop = hops.length > 1
        return (
          <Flex
            alignItems="center"
            className="hint--top-left"
            color={isLast ? null : 'grey'}
            data-hint={formatMessage(
              { ...messages[hasFee ? 'htlc_hop_fee' : 'htlc_hop_no_fee'] },
              { hopFee: formatNumber(hop.feeMsat), cryptoUnitName: 'msat' }
            )}
            justifyContent="flex-end"
            key={hop.pubKey}
            my={1}
          >
            {multiHop && (
              <Flex alignItems="center" color="gray" mx={2} opacity={isLast ? 1 : 0.5}>
                <ArrowRight />
              </Flex>
            )}
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

export default HtlcHops
