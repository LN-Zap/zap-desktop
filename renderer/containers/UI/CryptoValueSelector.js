import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Text } from 'rebass/styled-components'
import CryptoValue from './CryptoValue'
import CryptoSelector from './CryptoSelector'

/**
 * CryptValueSelector - Crypto value with denomination selector.
 *
 * @param {object} { fontSize, value }
 * @returns {object} Component
 */
export default function CryptoValueSelector({ fontSize, value, ...rest }) {
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
  value: PropTypes.number.isRequired,
}
