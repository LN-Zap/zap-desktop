import React from 'react'

import PropTypes from 'prop-types'

import Invoice from 'containers/Activity/Invoice'
import Payment from 'containers/Activity/Payment'
import Transaction from 'containers/Activity/Transaction'

const ACTIVITY_ITEM_TYPES = {
  transaction: Transaction,
  invoice: Invoice,
  payment: Payment,
}

const ActivityListItem = ({ activity, ...rest }) => {
  const ListItem = ACTIVITY_ITEM_TYPES[activity.type]
  return (
    <ListItem
      activity={activity}
      {...rest}
      sx={activity.isSending ? null : { cursor: 'pointer' }}
      width={1}
    />
  )
}

ActivityListItem.propTypes = {
  activity: PropTypes.object.isRequired,
}

export default React.memo(ActivityListItem)
