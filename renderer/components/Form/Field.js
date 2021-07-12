import React from 'react'

import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'

import { Message, Text } from 'components/UI'

import Label from './Label'

const Field = ({
  children,
  description,
  error,
  field,
  hasFocus,
  hasMessageSpacer,
  isRequired,
  justifyContent,
  label,
  tooltip,
  ...rest
}) => (
  <Flex flexDirection="column" justifyContent={justifyContent} {...rest}>
    {label && (
      <Label htmlFor={field} isRequired={isRequired} mb={2} tooltip={tooltip}>
        {label}
      </Label>
    )}

    <Flex alignItems="center" sx={{ position: 'relative' }}>
      {children}
    </Flex>

    {description && (
      <Text color="gray" fontSize="s" mt={1}>
        {description}
      </Text>
    )}

    {error && (
      <Message mt={1} variant={hasFocus ? 'warning' : 'error'}>
        {error}
      </Message>
    )}

    {hasMessageSpacer && !error && (
      <Box fontSize="s" fontWeight="normal" height="16px" mt={1}>
        &nbsp;
      </Box>
    )}
  </Flex>
)

Field.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.node,
  error: PropTypes.node,
  field: PropTypes.string.isRequired,
  hasFocus: PropTypes.bool,
  hasMessageSpacer: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  justifyContent: PropTypes.string,
  label: PropTypes.node,
  tooltip: PropTypes.string,
  variant: PropTypes.string,
}

Field.defaultProps = {
  justifyContent: 'flex-start',
}

export default Field
