import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box } from 'rebass'
import { Input, Label, Text } from 'components/UI'
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

export const NumberField = props => (
  <Input
    highlightOnValid={false}
    isRequired
    justifyContent="flex-end"
    min="1"
    step="1"
    textAlign="right"
    type="number"
    width={100}
    {...props}
  />
)
