import React from 'react'
import PropTypes from 'prop-types'
import { Input, Textarea } from '@rebass/forms'

/**
 * isFieldValid - Check wether a field is valid or not.
 *
 * @param  {{value, error, asyncError, touched}} fieldState Informed field state.
 * @returns {boolean} Boolean indicating wether field is valie.
 */
export const isFieldValid = ({ value, error, asyncError, touched }) => {
  return value && !error && !asyncError && touched
}

/**
 * mapDefaultBorderColor - Determine the most appropriate border color for an input (normal state).
 *
 * @param  {object} props Props
 * @returns {string} Color
 */
export const mapDefaultBorderColor = props => {
  const {
    isDisabled,
    isReadOnly,
    fieldState,
    fieldState: { error, asyncError },
    theme: {
      colors: { gray, superGreen, superRed },
    },
  } = props
  let borderColor = gray

  if (isFieldValid(fieldState) && !props.highlightOnValid) {
    return borderColor
  }

  if (isReadOnly || isDisabled) {
    borderColor = gray
  } else if (error || asyncError) {
    borderColor = superRed
  } else if (isFieldValid(fieldState)) {
    borderColor = superGreen
  }
  return borderColor
}

/**
 * mapFocusBorderColor - Determine the most appropriate border color for an input (focus state).
 *
 * @param  {object} props Props
 * @returns {string} Color
 */
export const mapFocusBorderColor = props => {
  const {
    fieldState,
    theme: {
      colors: { lightningOrange, superGreen },
    },
  } = props

  if (!props.highlightOnValid) {
    return lightningOrange
  }

  return fieldState.touched && isFieldValid(fieldState) ? superGreen : lightningOrange
}

const systemProps = {
  borderWidth: 1,
  borderRadius: 's',
  bg: 'transparent',
  color: 'primaryText',
  fontFamily: 'sans',
  fontSize: 'm',
  fontWeight: 'light',
  p: 2,
  outline: 'none',
}

const StyledInput = React.forwardRef(({ sx, ...rest }, ref) => {
  const { isDisabled, isReadOnly } = rest

  return (
    <Input
      ref={ref}
      opacity={isDisabled || isReadOnly ? '0.6' : 'inherit'}
      sx={{
        ...systemProps,
        borderColor: mapDefaultBorderColor(rest),
        '&:not([readOnly]):not([disabled]):focus': {
          borderColor: mapFocusBorderColor(rest),
        },
        '::-webkit-search-decoration:hover, ::-webkit-search-cancel-button:hover': {
          cursor: 'pointer',
        },
        ...sx,
      }}
      width={1}
      {...rest}
    />
  )
})

StyledInput.propTypes = {
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  sx: PropTypes.object,
}

StyledInput.displayName = 'StyledInput'

const StyledTextArea = React.forwardRef(({ sx, ...rest }, ref) => {
  const { isDisabled, isReadOnly } = rest
  return (
    <Textarea
      ref={ref}
      opacity={isDisabled || isReadOnly ? '0.6' : 'inherit'}
      rows={5}
      sx={{
        ...systemProps,
        borderColor: mapDefaultBorderColor(rest),
        '&:not([readOnly]):not([disabled]):focus': {
          borderColor: mapFocusBorderColor(rest),
        },
        ...sx,
      }}
      width={1}
      {...rest}
    />
  )
})

StyledTextArea.propTypes = {
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  sx: PropTypes.object,
}

StyledTextArea.displayName = 'StyledTextArea'

export { StyledTextArea, StyledInput }
