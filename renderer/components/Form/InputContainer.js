import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass/styled-components'

const InputContainer = ({ isDisabled, isReadOnly, ...rest }) => {
  const theme = useContext(ThemeContext)
  const extraStyles = {}
  if (isDisabled || isReadOnly) {
    const inputStyles = themeGet('forms.input.normal')({ theme })
    isDisabled && Object.assign(extraStyles, inputStyles['&:disabled'])
    isReadOnly && Object.assign(extraStyles, inputStyles['&:read-only'])
  }
  return <Flex alignItems="center" sx={extraStyles} variant="normal" {...rest} tx="forms.input" />
}

InputContainer.propTypes = {
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  variant: PropTypes.string,
}

InputContainer.defaultProps = {
  variant: 'normal',
}

export default InputContainer
