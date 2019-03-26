import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Bar from './Bar'
import Button from './Button'
import Text from './Text'

class Tab extends React.PureComponent {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    itemKey: PropTypes.string.isRequired,
    itemValue: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const { itemKey, itemValue, isActive, onClick } = this.props

    return (
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
  }
}

export default Tab
