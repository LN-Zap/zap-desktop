import styled from 'styled-components'
import system from '@rebass/components'

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

/**
 * createSystemInput - Create a styled system input/textarea that accepts all style props from styled-system.
 *
 * @param  {'input'|'textarea'} type Type
 * @returns {object} Component
 */
export const createSystemInput = (type = 'input') => {
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
  if (type === 'textarea') {
    const textareaProps = {
      rows: 5,
    }
    Object.assign(systemProps, textareaProps)
  }
  return styled(
    system(
      {
        as: type,
        ...systemProps,
      },
      'space',
      'color',
      'borders',
      'borderColor',
      'borderRadius',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'width'
    )
  )`
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
  `
}
