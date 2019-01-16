import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Bar, Button, Text } from 'components/UI'

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
          <Flex mr={3} key={item.key} flexDirection="column" alignItems="center">
            <Button
              variant="secondary"
              size="small"
              onClick={() => this.handleClick(item.key)}
              px={3}
              active={item.key === activeKey}
            >
              <Text fontWeight="normal">{item.name}</Text>
            </Button>
            {item.key === activeKey && (
              <Bar
                width={1}
                borderColor="lightningOrange"
                opacity={1}
                css={{ 'max-width': '50px' }}
              />
            )}
          </Flex>
        ))}
      </Flex>
    )
  }
}

export default Tabs
