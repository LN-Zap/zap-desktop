import React, { useCallback } from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import Tab from './Tab'

const Tabs = ({ items, activeKey, onClick, ...rest }) => {
  const handleClick = useCallback(
    key => {
      if (onClick) {
        onClick(key)
      }
    },
    [onClick]
  )

  return (
    <Flex alignItems="center" {...rest}>
      {items.map(item => {
        const { key, name } = item
        return (
          <Tab
            isActive={key === activeKey}
            itemKey={key}
            itemValue={name}
            key={key}
            onClick={handleClick}
          />
        )
      })}
    </Flex>
  )
}

Tabs.propTypes = {
  activeKey: PropTypes.string,
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func,
}

export default Tabs
