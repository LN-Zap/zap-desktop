import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Bar from './Bar'
import Button from './Button'
import Text from './Text'

const Tab = ({ itemKey, itemValue, isActive, onClick }) => (
  <Flex alignItems="center" flexDirection="column" mr={3}>
    <Button
      active={isActive}
      onClick={() => onClick(itemKey)}
      px={3}
      size="small"
      variant="secondary"
    >
      <Text fontWeight="normal">{itemValue}</Text>
    </Button>
    {isActive && (
      <Bar bg="lightningOrange" style={{ maxWidth: '50px', width: '100%', height: '2px' }} />
    )}
  </Flex>
)
Tab.propTypes = {
  isActive: PropTypes.bool.isRequired,
  itemKey: PropTypes.string.isRequired,
  itemValue: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

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
