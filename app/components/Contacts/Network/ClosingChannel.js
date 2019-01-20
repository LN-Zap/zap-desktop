import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import { Bar, Spinner } from 'components/UI'

const ClosingChannel = ({ message }) => (
  <Box as="footer">
    <Bar borderColor="primaryColor" borderBottom={2} my={3} />

    <Flex py={2} color="lightningOrange" alignItems="center" justifyContent="center">
      <Flex>
        <Spinner mr={2} />
        <FormattedMessage {...message} />
      </Flex>
    </Flex>
  </Box>
)

ClosingChannel.propTypes = {
  message: PropTypes.object.isRequired
}

export default ClosingChannel
