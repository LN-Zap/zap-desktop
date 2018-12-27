/* eslint-disable react/no-multi-comp */

import React from 'react'
import { asField } from 'informed'
import { withTheme } from 'styled-components'
import system from '@rebass/components'
import { styles } from 'styled-system'
import * as yup from 'yup'
import { Flex } from 'rebass'
import { Message, Label, Span, Text } from 'components/UI'

// Create an html input element that accepts all style props from styled-system.
const SystemInput = system(
  {
    as: 'input',
    border: 1,
    borderColor: 'gray',
    borderRadius: 5,
    bg: 'transparent',
    color: 'primaryText',
    fontFamily: 'sans',
    fontSize: 'm',
    fontWeight: 'light',
    p: 3,
    width: 1
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

/**
 * @render react
 * @name Input
 * @example
 * <Input />
 */
class Input extends React.Component {
  static displayName = 'Input'

  static defaultProps = {
    description: null,
    label: null,
    showMessage: true,
    autoFocus: false
  }

  state = {
    hasFocus: false
  }

  constructor(props) {
    super(props)
    const { forwardedRef } = this.props
    this.inputRef = forwardedRef || React.createRef()
  }

  componentDidMount() {
    const { autoFocus } = this.props
    if (autoFocus) {
      this.inputRef.current.focus()
    }
  }

  render() {
    const {
      border,
      css,
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
      validate,
      variant,
      ...rest
    } = this.props

    // Extract any styled-system space props so that we can apply them directly to the wrapper.
    const spaceProps = {}
    Object.keys(rest).forEach(key => {
      if ([...Object.keys(styles.space.propTypes), 'width'].includes(key)) {
        spaceProps[key] = rest[key]
        delete rest[key]
      }
    })

    const { readOnly } = this.props
    const { hasFocus } = this.state
    const { setValue, setTouched } = fieldApi
    const { value } = fieldState
    const isValid = value && !fieldState.error && !fieldState.asyncError && fieldState.touched

    // Calculate the border color based on the current field state.
    let borderColor
    if (readOnly) {
      borderColor = theme.colors.gray
    } else if (fieldState.error || fieldState.asyncError) {
      borderColor = theme.colors.superRed
    } else if (isValid) {
      borderColor = theme.colors.superGreen
    }

    const cssProps = Object.assign(
      {
        outline: 'none'
      },
      css
    )

    if (border) {
      cssProps['&:not([readOnly]):not([disabled]):focus'] = {
        border: `1px solid ${isValid ? theme.colors.superGreen : theme.colors.lightningOrange} }`
      }
    }
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
        <SystemInput
          p={variant === 'thin' ? 2 : 3}
          width={1}
          border={border}
          borderColor={borderColor || theme.colors.gray}
          css={cssProps}
          {...rest}
          field={field}
          ref={this.inputRef}
          value={!value && value !== 0 ? '' : value}
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
          required={required}
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

const InputAsField = asField(Input)

class WrappedInputAsField extends React.Component {
  validate = value => {
    const { disabled, required } = this.props
    if (disabled) {
      return
    }
    try {
      if (required) {
        const validator = yup.string().required()
        validator.validateSync(value)
      }
    } catch (error) {
      return error.message
    }

    // Run any additional validation provided by the caller.
    const { validate } = this.props
    if (validate) {
      return validate(value)
    }
  }

  render() {
    return <InputAsField validate={this.validate} {...this.props} />
  }
}

export default withTheme(WrappedInputAsField)
