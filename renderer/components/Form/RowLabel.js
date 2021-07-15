import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { Text, Tooltip } from 'components/UI'

import Label from './Label'

const RowLabel = ({ tooltipMessage, nameMessage, descMessage, htmlFor, ...rest }) => {
  return (
    <Box {...rest}>
      <Flex>
        <Label htmlFor={htmlFor} mb={2}>
          <FormattedMessage {...nameMessage} />
        </Label>
        {tooltipMessage && (
          <Tooltip ml={1} mt="2px">
            <FormattedMessage {...tooltipMessage} />
          </Tooltip>
        )}
      </Flex>

      <Text color="gray" fontWeight="light">
        <FormattedMessage {...descMessage} />
      </Text>
    </Box>
  )
}

RowLabel.propTypes = {
  descMessage: PropTypes.object.isRequired,
  htmlFor: PropTypes.string,
  nameMessage: PropTypes.object.isRequired,
  tooltipMessage: PropTypes.object,
}

export default RowLabel
