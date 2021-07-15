import React from 'react'

import PropTypes from 'prop-types'

import RowLabel from './RowLabel'

const FieldLabelFactory = messages => {
  const FieldLabel = ({ itemKey, tooltip, ...rest }) => {
    const messageKey = itemKey.replace('.', '_')
    return (
      <RowLabel
        {...rest}
        descMessage={messages[`${messageKey}_description`]}
        htmlFor={itemKey}
        nameMessage={messages[`${messageKey}_label`]}
        tooltipMessage={messages[tooltip]}
      />
    )
  }

  FieldLabel.propTypes = {
    itemKey: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
  }

  return FieldLabel
}

export default FieldLabelFactory
