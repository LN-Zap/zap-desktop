import React, { useState } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import { withTheme } from 'styled-components'
import { Input as BaseInput } from '@rebass/forms/styled-components'
import { extractSpaceProps } from 'themes/util'
import { withInputValidation } from 'hocs'
import { useAutoFocus } from 'hooks'
import InputField from './InputField'
import { mapDefaultBorderColor, mapFocusBorderColor } from './util'

const Input = props => {
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
    isReadOnly,
    isRequired,
    justifyContent,
    label,
    maxLength,
    minLength,
    onChange,
    onBlur,
    onFocus,
    prefix,
    suffix,
    sx,
    theme,
    tooltip,
    type,
    variant,
    willAutoFocus,
    ...rest
  } = props
  const [hasFocus, setFocus] = useState(false)
  const [spaceProps, otherProps] = extractSpaceProps(rest)
  const { setValue, setTouched } = fieldApi
  const { value, maskedValue, error, asyncError } = fieldState

  useAutoFocus(forwardedRef, willAutoFocus)

  const getValue = () => {
    if (typeof value === 'undefined') {
      return initialValue
    }
    return !maskedValue && maskedValue !== 0 ? '' : maskedValue
  }

  const isHidden = type !== 'hidden'
  const fieldDescription = isHidden && description
  const fieldLabel = isHidden && label
  const fieldError = isHidden && hasMessage && (error || asyncError)

  return (
    <InputField
      {...spaceProps}
      className={className}
      description={fieldDescription}
      error={fieldError}
      field={field}
      hasFocus={hasFocus}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      justifyContent={justifyContent}
      label={fieldLabel}
      tooltip={tooltip}
    >
      {prefix}
      <BaseInput
        disabled={isDisabled}
        maxLength={maxLength}
        minLength={minLength}
        name={field}
        onBlur={e => {
          // set touched to true to enforce validity highlight
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
        pl={prefix ? 35 : null}
        readOnly={isReadOnly}
        required={isRequired}
        sx={{
          borderColor: mapDefaultBorderColor(props),
          '&:not([readOnly]):not([disabled]):focus': {
            borderColor: mapFocusBorderColor(props),
          },
          ...sx,
        }}
        type={type}
        value={getValue()}
        {...otherProps}
        ref={forwardedRef}
        tx="forms.input"
        variant={variant}
      />
      {suffix}
    </InputField>
  )
}

Input.propTypes = {
  className: PropTypes.string,
  description: PropTypes.node,
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
  label: PropTypes.node,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  sx: PropTypes.object,
  theme: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  willAutoFocus: PropTypes.bool,
}

Input.defaultProps = {
  hasMessage: true,
  highlightOnValid: true,
  initialValue: '',
  variant: 'normal',
}

const BasicInput = withTheme(Input)

export { BasicInput }

export default compose(
  withInputValidation,
  asField
)(BasicInput)
