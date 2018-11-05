import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Text } from 'components/UI'

const PaySummaryRow = ({ left, right }) => (
  <Box py={3}>
    <Flex alignItems="center">
      <Box width={1 / 2}>
        <Text fontWeight="normal">{left}</Text>
      </Box>
      <Box width={1 / 2}>
        <Text textAlign="right">{right}</Text>
      </Box>
    </Flex>
  </Box>
)

PaySummaryRow.propTypes = {
  left: PropTypes.any,
  right: PropTypes.any
}

export default PaySummaryRow
