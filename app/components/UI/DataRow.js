import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Text } from 'components/UI'

const DataRow = ({ left, right }) => (
  <Flex alignItems="center" py={3}>
    <Text width={1 / 2} fontWeight="normal">
      {left}
    </Text>
    <Text width={1 / 2} textAlign="right">
      {right}
    </Text>
  </Flex>
)

DataRow.propTypes = {
  left: PropTypes.any,
  right: PropTypes.any
}

export default DataRow
