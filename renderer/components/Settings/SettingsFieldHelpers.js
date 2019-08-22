import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass/styled-components'
import { Text } from 'components/UI'
import { IntegerInput, Label } from 'components/Form'
import messages from './messages'

export const FieldLabel = ({ itemKey, ...rest }) => {
  const messageKey = itemKey.replace('.', '_')
  return (
    <Box {...rest}>
      <Label htmlFor={itemKey} mb={2}>
        <FormattedMessage {...messages[`${messageKey}_label`]} />
      </Label>
      <Text color="gray" fontWeight="light">
        <FormattedMessage {...messages[`${messageKey}_description`]} />
      </Text>
    </Box>
  )
}

FieldLabel.propTypes = {
  itemKey: PropTypes.string.isRequired,
}

export const PositiveIntegerField = props => (
  <IntegerInput
    highlightOnValid={false}
    isRequired
    justifyContent="flex-end"
    max={9999}
    min={1}
    step="1"
    textAlign="right"
    validateOnBlur
    validateOnChange
    width={100}
    {...props}
  />
)
