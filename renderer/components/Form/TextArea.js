import React, { useState, useContext } from 'react'

import { Textarea as BaseTextArea } from '@rebass/forms/styled-components'
import { asField } from 'informed'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { ThemeContext } from 'styled-components'

import { withInputValidation } from 'hocs'
import { useAutoFocus } from 'hooks'
import { extractSpaceProps } from 'themes/util'

import Field from './Field'
import { mapDefaultBorderColor, mapFocusBorderColor } from './util'

const TextArea = props => {
  const {
    className,
    description,
    field,
    fieldApi,
    fieldState,
    forwardedRef,
    hasMessage,
    initialValue,
    isDisabled,
    isRequired,
    isReadOnly,
    justifyContent,
    label,
    onChange,
    onBlur,
    onFocus,
    sx,
    tooltip,
    willAutoFocus,
    ...rest
  } = props
  const [hasFocus, setFocus] = useState(false)
  const [spaceProps, otherProps] = extractSpaceProps(rest)
  const theme = useContext(ThemeContext)
  const { setValue, setTouched } = fieldApi
  const { value, maskedValue, error, asyncError } = fieldState

  useAutoFocus(forwardedRef, willAutoFocus)

  const getValue = () => {
    if (typeof value === 'undefined') {
      return initialValue
    }
    return !maskedValue && maskedValue !== 0 ? '' : maskedValue
  }
  const fieldError = hasMessage && (error || asyncError)

  return (
    <Field
      {...spaceProps}
      className={className}
      description={description}
      error={fieldError}
      field={field}
      hasFocus={hasFocus}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      justifyContent={justifyContent}
      label={label}
      tooltip={tooltip}
    >
      <BaseTextArea
        disabled={isDisabled}
        fieldState={fieldState}
        name={field}
        onBlur={e => {
          // set touched to true to enforce validity highlight.
          setTouched(true)
          // Make the state aware that the element is no longer focused.
          setFocus(false)
          if (onBlur) {
            onBlur(e)
          }
        }}
        onChange={e => {
          setValue(e.target.value)
          if (onChange) {
            onChange(e)
          }
        }}
        onFocus={e => {
          // Make the state aware that the element is now focused.
          setFocus(true)
          if (onFocus) {
            onFocus(e)
          }
        }}
        readOnly={isReadOnly}
        required={isRequired}
        sx={{
          borderColor: mapDefaultBorderColor(props, theme),
          '&:not([read-only]):not([disabled]):focus': {
            borderColor: mapFocusBorderColor(props, theme),
          },
          ...sx,
        }}
        theme={theme}
        value={getValue()}
        {...otherProps}
        ref={forwardedRef}
      />
    </Field>
  )
}

TextArea.propTypes = {
  className: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  field: PropTypes.string.isRequired,
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  forwardedRef: PropTypes.object,
  hasMessage: PropTypes.bool,
  highlightOnValid: PropTypes.bool,
  initialValue: PropTypes.string,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  justifyContent: PropTypes.string,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  sx: PropTypes.object,
  tooltip: PropTypes.string,
  willAutoFocus: PropTypes.bool,
}

TextArea.defaultProps = {
  hasMessage: true,
  highlightOnValid: true,
  initialValue: '',
}

const BasicTextArea = TextArea

export { BasicTextArea }

export default compose(withInputValidation, asField)(BasicTextArea)
