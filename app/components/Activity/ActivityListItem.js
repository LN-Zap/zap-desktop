import React, { PureComponent } from 'react'
import { Box, Flex } from 'rebass'
import PropTypes from 'prop-types'

import Invoice from 'containers/Activity/Invoice'
import Payment from 'containers/Activity/Payment'
import Transaction from 'containers/Activity/Transaction'

import ChainLink from 'components/Icon/ChainLink'
import Clock from 'components/Icon/Clock'
import Zap from 'components/Icon/Zap'
import { Text } from 'components/UI'

const ZapIcon = () => <Zap width="1.6em" height="1.6em" />

const ActivityIcon = ({ activity }) => {
  switch (activity.type) {
    case 'transaction':
      return <ChainLink />
    case 'payment':
      return <ZapIcon />
    case 'invoice':
      return activity.settled ? <ZapIcon /> : <Clock />
    default:
      return null
  }
}

ActivityIcon.propTypes = {
  activity: PropTypes.object.isRequired
}

export default class ActivityListItem extends PureComponent {
  static propTypes = {
    currentTicker: PropTypes.object,
    showActivityModal: PropTypes.func.isRequired,
    currencyName: PropTypes.string,
    ticker: PropTypes.object.isRequired,
    activity: PropTypes.object.isRequired
  }

  render() {
    const { activity, currencyName, currentTicker, ticker, showActivityModal, ...rest } = this.props
    return (
      <Flex justifyContent="space-between" alignItems="center" {...rest}>
        <Text width={24} color="gray" textAlign="center" mr={10}>
          <ActivityIcon activity={activity} />
        </Text>
        <Box width={1} css={!activity.sending ? { cursor: 'pointer' } : null}>
          {activity.type === 'transaction' && <Transaction transaction={activity} />}
          {activity.type === 'invoice' && <Invoice invoice={activity} />}
          {activity.type === 'payment' && <Payment payment={activity} />}
        </Box>
      </Flex>
    )
  }
}
