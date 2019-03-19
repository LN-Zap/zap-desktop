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

const ZapIcon = () => <Zap height="1.6em" width="1.6em" />

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
  activity: PropTypes.object.isRequired,
}

export default class ActivityListItem extends PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    currencyName: PropTypes.string,
    currentTicker: PropTypes.object,
    showActivityModal: PropTypes.func.isRequired,
    ticker: PropTypes.object.isRequired,
  }

  render() {
    const { activity, currencyName, currentTicker, ticker, showActivityModal, ...rest } = this.props
    return (
      <Flex alignItems="center" justifyContent="space-between" {...rest}>
        <Text color="gray" mr={10} textAlign="center" width={24}>
          <ActivityIcon activity={activity} />
        </Text>
        <Box css={activity.sending ? null : { cursor: 'pointer' }} width={1}>
          {activity.type === 'transaction' && <Transaction transaction={activity} />}
          {activity.type === 'invoice' && <Invoice invoice={activity} />}
          {activity.type === 'payment' && <Payment payment={activity} />}
        </Box>
      </Flex>
    )
  }
}
