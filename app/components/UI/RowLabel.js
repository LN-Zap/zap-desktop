import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Label, Text } from 'components/UI'

export default function RowLabel({ nameMessage, descMessage, htmlFor }) {
  return (
    <>
      <Label htmlFor={htmlFor} mb={2}>
        <FormattedMessage {...nameMessage} />
      </Label>
      <Text color="gray" fontWeight="light">
        <FormattedMessage {...descMessage} />
      </Text>
    </>
  )
}

RowLabel.propTypes = {
  nameMessage: PropTypes.object.isRequired,
  descMessage: PropTypes.object.isRequired,
  htmlFor: PropTypes.string
}
