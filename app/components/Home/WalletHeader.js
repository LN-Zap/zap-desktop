import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Heading, Truncate } from 'components/UI'

const WalletHeader = ({ title }) => (
  <Box>
    <Heading.h1 fontSize="xxl">
      <Truncate text={title} maxlen={25} />
    </Heading.h1>
  </Box>
)

WalletHeader.propTypes = {
  title: PropTypes.string.isRequired
}

export default WalletHeader
