import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Message, Text } from 'components/UI'
import InputLabel from './InputLabel'

const Field = ({
  children,
  description,
  error,
  field,
  hasFocus,
  isDisabled,
  isReadOnly,
  isRequired,
  justifyContent,
  label,
  tooltip,
  ...rest
}) => (
  <Flex flexDirection="column" justifyContent={justifyContent} {...rest}>
    {label && (
      <InputLabel field={field} isRequired={isRequired} mb={2} tooltip={tooltip}>
        {label}
      </InputLabel>
    )}

    <Flex
      alignItems="center"
      opacity={isDisabled || isReadOnly ? '0.6' : 'inherit'}
      sx={{ position: 'relative' }}
    >
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
  </Flex>
)

Field.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.node,
  error: PropTypes.node,
  field: PropTypes.string.isRequired,
  hasFocus: PropTypes.bool,
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
