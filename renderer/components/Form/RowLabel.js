import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text } from 'components/UI'
import Label from './Label'

const RowLabel = ({ nameMessage, descMessage, htmlFor }) => {
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
  descMessage: PropTypes.object.isRequired,
  htmlFor: PropTypes.string,
  nameMessage: PropTypes.object.isRequired,
}

export default RowLabel
