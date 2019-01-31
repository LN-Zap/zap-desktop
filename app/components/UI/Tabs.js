import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Bar, Button, Text } from 'components/UI'

const Tab = ({ itemKey, itemValue, isActive, onClick }) => (
  <Flex mr={3} flexDirection="column" alignItems="center">
    <Button
      variant="secondary"
      size="small"
      onClick={() => onClick(itemKey)}
      px={3}
      active={isActive}
    >
      <Text fontWeight="normal">{itemValue}</Text>
    </Button>
    {isActive && (
      <Bar width={1} borderColor="lightningOrange" opacity={1} css={{ 'max-width': '50px' }} />
    )}
  </Flex>
)
Tab.propTypes = {
  itemKey: PropTypes.string.isRequired,
  itemValue: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

class Tabs extends React.PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    activeKey: PropTypes.string,
    onClick: PropTypes.func
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
            itemKey={item.key}
            itemValue={item.name}
            isActive={item.key === activeKey}
            onClick={this.handleClick}
          />
        ))}
      </Flex>
    )
  }
}

export default Tabs
