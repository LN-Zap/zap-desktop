import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Text } from 'components/UI'

const DataRow = ({ left, right, ...rest }) => (
  <Flex alignItems="center" py={3} {...rest} justifyContent="space-between">
    <Text width={2 / 5} fontWeight="normal">
      {left}
    </Text>
    <Text width={3 / 5} textAlign="right">
      {right}
    </Text>
  </Flex>
)

DataRow.propTypes = {
  left: PropTypes.any,
  right: PropTypes.any
}

export default DataRow
