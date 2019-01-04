import React, { PureComponent } from 'react'
import { Box, Flex } from 'rebass'
import PropTypes from 'prop-types'

import ChainLink from 'components/Icon/ChainLink'
import Clock from 'components/Icon/Clock'
import Zap from 'components/Icon/Zap'
import { Text } from 'components/UI'
import Transaction from './Transaction'
import Invoice from './Invoice'
import Payment from './Payment'

const ActivityIcon = ({ activity }) => {
  switch (activity.type) {
    case 'transaction':
      return <ChainLink />
    case 'payment':
      return <Zap width="1.6em" height="1.6em" />
    case 'invoice':
      return <Clock />
    default:
      return null
  }
}

export default class ActivityListItem extends PureComponent {
  static propTypes = {
    currentTicker: PropTypes.object,
    showActivityModal: PropTypes.func.isRequired,
    currencyName: PropTypes.string,
    ticker: PropTypes.object.isRequired,
    network: PropTypes.object.isRequired,
    activity: PropTypes.object.isRequired
  }

  render() {
    const {
      activity,
      currencyName,
      currentTicker,
      network,
      ticker,
      showActivityModal,
      ...rest
    } = this.props
    return (
      <Flex justifyContent="space-between" alignItems="center" {...rest}>
        <Text width={24} ml={-35} color="gray" textAlign="center">
          <ActivityIcon activity={activity} />
        </Text>
        <Box width={1} css={!activity.sending ? { cursor: 'pointer' } : null}>
          {activity.type === 'transaction' && (
            <Transaction
              transaction={activity}
              ticker={ticker}
              currentTicker={currentTicker}
              showActivityModal={showActivityModal}
              currencyName={currencyName}
            />
          )}

          {activity.type === 'invoice' && (
            <Invoice
              invoice={activity}
              ticker={ticker}
              currentTicker={currentTicker}
              showActivityModal={showActivityModal}
              currencyName={currencyName}
            />
          )}

          {activity.type === 'payment' && (
            <Payment
              payment={activity}
              ticker={ticker}
              currentTicker={currentTicker}
              showActivityModal={showActivityModal}
              nodes={network.nodes}
              currencyName={currencyName}
            />
          )}
        </Box>
      </Flex>
    )
  }
}
