import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'
import AngleRight from 'components/Icon/AngleRight'
import AngleDown from 'components/Icon/AngleDown'

class DataRow extends React.PureComponent {
  state = {
    collapsed: true
  }

  static propTypes = {
    left: PropTypes.any,
    right: PropTypes.any,
    body: PropTypes.any
  }

  toggleBody = () => {
    this.setState(prevState => ({
      collapsed: !prevState.collapsed
    }))
  }

  render() {
    const { left, right, body, ...rest } = this.props
    const { collapsed } = this.state

    return (
      <Box py={3} {...rest}>
        <Flex alignItems="center" justifyContent="space-between">
          {body ? (
            <Flex alignItems="center" css={{ cursor: 'pointer' }} onClick={this.toggleBody}>
              <Flex width={8} alignItems="center" flexDirection="column" mr={2}>
                {collapsed ? <AngleRight height="8px" /> : <AngleDown width="8px" />}
              </Flex>

              <Text fontWeight="normal">{left}</Text>
            </Flex>
          ) : (
            <Text fontWeight="normal">{left}</Text>
          )}

          <Text textAlign="right">{right}</Text>
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
