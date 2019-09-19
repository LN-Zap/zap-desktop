import React from 'react'
import PropTypes from 'prop-types'
import RowLabel from './RowLabel'

const FieldLabelFactory = messages => {
  const FieldLabel = ({ itemKey, ...rest }) => {
    const messageKey = itemKey.replace('.', '_')
    return (
      <RowLabel
        {...rest}
        descMessage={messages[`${messageKey}_description`]}
        htmlFor={itemKey}
        nameMessage={messages[`${messageKey}_label`]}
      />
    )
  }

  FieldLabel.propTypes = {
    itemKey: PropTypes.string.isRequired,
  }

  return FieldLabel
}

export default FieldLabelFactory
