import React from 'react'
import { Box, Flex } from 'rebass'
import PropTypes from 'prop-types'
import Invoice from 'containers/Activity/Invoice'
import Payment from 'containers/Activity/Payment'
import Transaction from 'containers/Activity/Transaction'
import ChainLink from 'components/Icon/ChainLink'
import Clock from 'components/Icon/Clock'
import Zap from 'components/Icon/Zap'
import { Text } from 'components/UI'
import ActivityPlaceholderItem from './ActivityPlaceholderItem'
import ActivityPlaceholderGroup from './ActivityPlaceholderGroup'

const ZapIcon = () => <Zap height="1.6em" width="1.6em" />

const ACTIVITY_ITEM_TYPES = {
  transaction: Transaction,
  invoice: Invoice,
  payment: Payment,
  placeholderItem: ActivityPlaceholderItem,
  placeholderGroup: ActivityPlaceholderGroup,
}

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

const ActivityListItem = ({ activity, ...rest }) => {
  const ListItem = ACTIVITY_ITEM_TYPES[activity.type]
  const listItemProps = { [activity.type]: activity }
  return (
    <Flex alignItems="center" justifyContent="space-between" {...rest}>
      <Text color="gray" mr={10} textAlign="center" width={24}>
        <ActivityIcon activity={activity} />
      </Text>
      <Box css={activity.sending ? null : { cursor: 'pointer' }} width={1}>
        <ListItem {...listItemProps} />
      </Box>
    </Flex>
  )
}

ActivityListItem.propTypes = {
  activity: PropTypes.object.isRequired,
}

export default React.memo(ActivityListItem)
