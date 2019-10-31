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
 * @param {object} theme Theme object
 * @returns {string} Color
 */
export const mapDefaultBorderColor = (props, theme) => {
  const {
    isDisabled,
    isReadOnly,
    fieldState,
    fieldState: { error, asyncError },
  } = props
  const {
    colors: { gray, superGreen, superRed },
  } = theme
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
 * @param {object} props Props
 * @param {object} theme Theme object
 * @returns {string} Color
 */
export const mapFocusBorderColor = (props, theme) => {
  const { fieldState } = props
  const {
    colors: { primaryAccent, superGreen },
  } = theme

  if (!props.highlightOnValid) {
    return primaryAccent
  }

  return fieldState.touched && isFieldValid(fieldState) ? superGreen : primaryAccent
}
