import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import random from 'lodash/random'
import genId from '@zap/utils/genId'
import ActivityListItem from './ActivityListItem'

const createItem = type => ({
  type,
  id: genId(),
})

const createItemGroup = limit => {
  // Create intiial list of items.
  const items = [
    createItem('placeholderGroup'),
    ...Array.from(Array(limit).keys()).map(() => createItem('placeholderItem')),
  ]
  // Insert one new group item for every 3 items.
  if (limit > 2) {
    items.splice(random(2, limit - 1), 0, createItem('placeholderGroup'))
  }
  return items
}

const numberOfItemsByFilter = {
  ALL_ACTIVITY: 6,
  SENT_ACTIVITY: 2,
  RECEIVED_ACTIVITY: 2,
  PENDING_ACTIVITY: 1,
  EXPIRED_ACTIVITY: 3,
  INTERNAL_ACTIVITY: 1,
}

const ActivityPlaceholderList = ({ filter, ...rest }) => {
  // const cache = useRef(cacheBin)
  const [cache, setCache] = useState({})
  const items = useMemo(() => {
    if (cache[filter]) {
      return cache[filter]
    }
    cache[filter] = createItemGroup(numberOfItemsByFilter[filter] || 2)
    setCache(cache)
    return cache[filter]
  }, [cache, filter])

  return (
    <Box {...rest}>
      {items.map(activity => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}
    </Box>
  )
}

export default React.memo(ActivityPlaceholderList)

ActivityPlaceholderList.propTypes = {
  filter: PropTypes.string,
}
