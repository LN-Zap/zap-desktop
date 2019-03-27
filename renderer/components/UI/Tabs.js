import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Tab from './Tab'

class Tabs extends React.PureComponent {
  static propTypes = {
    activeKey: PropTypes.string,
    items: PropTypes.array.isRequired,
    onClick: PropTypes.func,
  }

  handleClick = key => {
    const { onClick } = this.props

    if (onClick) {
      return onClick(key)
    }
  }

  render() {
    const { items, activeKey, onClick, ...rest } = this.props

    return (
      <Flex alignItems="center" {...rest}>
        {items.map(item => (
          <Tab
            key={item.key}
            isActive={item.key === activeKey}
            itemKey={item.key}
            itemValue={item.name}
            onClick={this.handleClick}
          />
        ))}
      </Flex>
    )
  }
}

export default Tabs
