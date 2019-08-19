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
  border: 1,
  borderColor: 'gray',
  borderRadius: 5,
  bg: 'transparent',
  color: 'primaryText',
  fontFamily: 'sans',
  fontSize: 'm',
  fontWeight: 'light',
  p: 3,
  width: 1,
}

const StyledInput = props => (
  <Input
    css={`
      opacity: ${props => (props.isDisabled || props.isReadOnly ? '0.6' : 'inherit')};
      outline: none;
      border-color: ${mapDefaultBorderColor};
      &:not([readOnly]):not([disabled]):focus {
        border-color: ${mapFocusBorderColor};
      }
      ::-webkit-search-decoration:hover,
      ::-webkit-search-cancel-button:hover {
        cursor: pointer;
      }
    `}
    sx={{
      p: 2,
      outline: 'none',
      cursor: 'pointer',
    }}
    {...systemProps}
    {...props}
  />
)

StyledInput.propTypes = {
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
}

const StyledTextArea = props => (
  <Textarea
    css={`
      opacity: ${props => (props.isDisabled || props.isReadOnly ? '0.6' : 'inherit')};
      outline: none;
      border-color: ${mapDefaultBorderColor};
      &:not([readOnly]):not([disabled]):focus {
        border-color: ${mapFocusBorderColor};
      }
      ::-webkit-search-decoration:hover,
      ::-webkit-search-cancel-button:hover {
        cursor: pointer;
      }
      rows: 5;
    `}
    sx={{
      p: 2,
      outline: 'none',
      cursor: 'pointer',
    }}
    {...systemProps}
    {...props}
  />
)

StyledTextArea.propTypes = {
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
}

export { StyledTextArea, StyledInput }
