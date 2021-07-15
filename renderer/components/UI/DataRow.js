import React from 'react'

import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'

import AngleDown from 'components/Icon/AngleDown'
import AngleRight from 'components/Icon/AngleRight'

import Text from './Text'

class DataRow extends React.PureComponent {
  state = {
    collapsed: true,
  }

  static propTypes = {
    body: PropTypes.any,
    left: PropTypes.any,
    right: PropTypes.any,
  }

  toggleBody = () => {
    this.setState(prevState => ({
      collapsed: !prevState.collapsed,
    }))
  }

  render() {
    const { left, right, body, ...rest } = this.props
    const { collapsed } = this.state

    return (
      <Box py={3} {...rest}>
        <Flex alignItems="center" justifyContent="space-between">
          {body ? (
            <Flex alignItems="center" css="cursor: pointer;" flex={1} onClick={this.toggleBody}>
              <Flex alignItems="center" flexDirection="column" mr={2} width={8}>
                {collapsed ? <AngleRight height="8px" /> : <AngleDown width="8px" />}
              </Flex>

              <Text fontWeight="normal">{left}</Text>
            </Flex>
          ) : (
            <Text flex={1} fontWeight="normal">
              {left}
            </Text>
          )}

          <Flex alignItems="flex-end" flexDirection="column">
            {right}
          </Flex>
        </Flex>
        {body && !collapsed && (
          <Text color="gray" mt={2}>
            {body}
          </Text>
        )}
      </Box>
    )
  }
}

export default DataRow
