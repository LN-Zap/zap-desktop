import React from 'react'

import PropTypes from 'prop-types'
import { Flex, Text } from 'rebass/styled-components'

import CryptoSelector from './CryptoSelector'
import CryptoValue from './CryptoValue'

const CryptoValueSelector = ({ fontSize, value, ...rest }) => {
  return (
    <Flex alignItems="baseline" flexWrap="wrap" {...rest}>
      <Text fontSize={fontSize} textAlign="left">
        <CryptoValue value={value} />
      </Text>
      <CryptoSelector ml={2} />
    </Flex>
  )
}

CryptoValueSelector.propTypes = {
  fontSize: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default CryptoValueSelector
