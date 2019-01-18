/* eslint-disable react/no-multi-comp */

import React from 'react'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import { styles } from 'styled-system'
import system from '@rebass/components'
import { Flex } from 'rebass'
import { Message, Label, Span, Text } from 'components/UI'
import withRequiredValidation from 'components/withRequiredValidation'

function isFieldValid({ value, error, asyncError, touched }) {
  return value && !error && !asyncError && touched
}

function mapDefaultBorderColor(props) {
  const {
    disabled,
    readOnly,
    fieldState,
    fieldState: { error, asyncError },
    theme: {
      colors: { gray, superGreen, superRed }
    }
  } = props

  let borderColor = gray
  if (readOnly || disabled) {
    borderColor = gray
  } else if (error || asyncError) {
    borderColor = superRed
  } else if (isFieldValid(fieldState)) {
    borderColor = superGreen
  }
  return borderColor
}

function mapFocusBorderColor(props) {
  const {
    fieldState,
    theme: {
      colors: { lightningOrange, superGreen }
    }
  } = props
  return isFieldValid(fieldState) ? superGreen : lightningOrange
}

// Create an html textarea element that accepts all style props from styled-system.
const SystemTextArea = styled(
  system(
    {
      as: 'textarea',
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
      rows: 5
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
  opacity: ${props => (props.disabled || props.readOnly ? '0.6' : 'inherit')};
  outline: none;
  border-color: ${mapDefaultBorderColor};
  &:not([readOnly]):not([disabled]):focus {
    border-color: ${mapFocusBorderColor};
  }
`

/**
 * @render react
 * @name TextArea
 * @example
 * <TextArea />
 */
class TextArea extends React.PureComponent {
  static displayName = 'TextArea'

  static defaultProps = {
    description: null,
    label: null,
    showMessage: true
  }

  state = {
    hasFocus: false
  }

  constructor(props) {
    super(props)
    const { forwardedRef } = this.props
    this.inputRef = forwardedRef || React.createRef()
  }

  render() {
    const {
      description,
      onChange,
      onBlur,
      onFocus,
      forwardedRef,
      label,
      required,
      theme,
      field,
      fieldApi,
      fieldState,
      justifyContent,
      showMessage,
      variant,
      ...rest
    } = this.props
    const { hasFocus } = this.state
    const { setValue, setTouched } = fieldApi
    const { value } = fieldState

    // Extract any styled-system space props so that we can apply them directly to the wrapper.
    const spaceProps = {}
    Object.keys(rest).forEach(key => {
      /*eslint-disable react/forbid-foreign-prop-types*/
      if ([...Object.keys(styles.space.propTypes), 'width'].includes(key)) {
        spaceProps[key] = rest[key]
        delete rest[key]
      }
    })

    return (
      <Flex flexDirection="column" justifyContent={justifyContent} {...spaceProps}>
        {label && (
          <Label htmlFor={field} mb={2}>
            {label}
            {required && (
              <Span fontSize="s" css={{ 'vertical-align': 'super' }}>
                {' '}
                *
              </Span>
            )}
          </Label>
        )}
        <SystemTextArea
          p={variant === 'thin' ? 2 : 3}
          {...rest}
          field={field}
          theme={theme}
          fieldState={fieldState}
          ref={this.inputRef}
          value={!value && value !== 0 ? '' : value}
          required={required}
          onChange={e => {
            setValue(e.target.value)
            if (onChange) {
              onChange(e)
            }
          }}
          onBlur={e => {
            setTouched()
            // Make the state aware that the element is now focused.
            const newHasFocus = document.activeElement === this.inputRef.current
            if (hasFocus !== newHasFocus) {
              this.setState({ hasFocus: newHasFocus })
            }
            if (onBlur) {
              onBlur(e)
            }
          }}
          onFocus={e => {
            // Make the state aware that the element is no longer focused.
            const newHasFocus = document.activeElement === this.inputRef.current
            if (hasFocus !== newHasFocus) {
              this.setState({ hasFocus: newHasFocus })
            }
            if (onFocus) {
              onFocus(e)
            }
          }}
        />
        {description && (
          <Text color="gray" fontSize="s" mt={1}>
            {description}
          </Text>
        )}
        {showMessage && (fieldState.error || fieldState.asyncError) && (
          <Message variant={hasFocus ? 'warning' : 'error'} mt={1}>
            {fieldState.error || fieldState.asyncError}
          </Message>
        )}
      </Flex>
    )
  }
}

export default withRequiredValidation(withTheme(asField(TextArea)))
