import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass/styled-components'

const InputContainer = withTheme(({ isDisabled, isReadOnly, ...rest }) => {
  const extraStyles = {}
  if (isDisabled || isReadOnly) {
    const inputStyles = themeGet('forms.input.normal')(rest)
    isDisabled && Object.assign(extraStyles, inputStyles['&:disabled'])
    isReadOnly && Object.assign(extraStyles, inputStyles['&:read-only'])
  }
  return <Flex alignItems="center" sx={extraStyles} variant="normal" {...rest} tx="forms.input" />
})

InputContainer.propTypes = {
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  variant: PropTypes.string,
}

InputContainer.defaultProps = {
  variant: 'normal',
}

export default InputContainer
