import React, { useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { asField } from 'informed'
import { withTheme } from 'styled-components'
import { Flex } from 'rebass'
import { extractSpaceProps } from 'themes/util'
import { withInputValidation } from 'hocs'
import { Message, Text } from 'components/UI'
import InputLabel from './InputLabel'
import { createSystemInput } from './util'

// Create an html input element that accepts all style props from styled-system.
export const SystemTextArea = createSystemInput('textarea')

const maybeFocusRef = ref => {
  if (ref.current && document.activeElement !== ref.current) {
    ref.current.focus()
  }
}

const TextArea = ({
  description,
  onChange,
  onBlur,
  onFocus,
  forwardedRef,
  label,
  initialValue,
  isDisabled,
  isRequired,
  isReadOnly,
  theme,
  field,
  fieldApi,
  fieldState,
  justifyContent,
  hasMessage,
  variant,
  className,
  tooltip,
  willAutoFocus,
  ...rest
}) => {
  const [hasFocus, setFocus] = useState(false)
  const [spaceProps, otherProps] = extractSpaceProps(rest)
  const { setValue, setTouched } = fieldApi
  const { value, maskedValue, error, asyncError } = fieldState

  useLayoutEffect(() => {
    willAutoFocus && maybeFocusRef(forwardedRef)
  }, [willAutoFocus, forwardedRef])

  const getValue = () => {
    if (typeof value === 'undefined') {
      return initialValue
    }
    return !maskedValue && maskedValue !== 0 ? '' : maskedValue
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent={justifyContent}
      {...spaceProps}
      className={className}
    >
      {label && (
        <InputLabel field={field} isRequired={isRequired} tooltip={tooltip}>
          {label}
        </InputLabel>
      )}
      <SystemTextArea
        {...otherProps}
        ref={forwardedRef}
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
        p={variant === 'thin' ? 2 : 3}
        readOnly={isReadOnly}
        required={isRequired}
        theme={theme}
        value={getValue()}
      />
      {description && (
        <Text color="gray" fontSize="s" mt={1}>
          {description}
        </Text>
      )}
      {hasMessage && (error || asyncError) && (
        <Message mt={1} variant={hasFocus ? 'warning' : 'error'}>
          {error || asyncError}
        </Message>
      )}
    </Flex>
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
  theme: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
  variant: PropTypes.string,
  willAutoFocus: PropTypes.bool,
}

TextArea.defaultProps = {
  hasMessage: true,
  highlightOnValid: true,
  initialValue: '',
}

const BasicTextArea = withTheme(TextArea)

export { BasicTextArea }

export default compose(
  withInputValidation,
  asField
)(BasicTextArea)
