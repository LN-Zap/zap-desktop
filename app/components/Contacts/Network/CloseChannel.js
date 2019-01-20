import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Text } from 'components/UI'

const CloseChannel = ({ message, onCloseClick }) => (
  <Box as="footer">
    <Bar borderColor="primaryColor" borderBottom={2} my={3} />

    <Text
      onClick={onCloseClick}
      py={2}
      color="superRed"
      textAlign="center"
      css={{ cursor: 'pointer', '&:hover': { opacity: 0.5 } }}
    >
      <FormattedMessage {...message} />
    </Text>
  </Box>
)

CloseChannel.propTypes = {
  message: PropTypes.object.isRequired,
  onCloseClick: PropTypes.func.isRequired
}

export default CloseChannel
