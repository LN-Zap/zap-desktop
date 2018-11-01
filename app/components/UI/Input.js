import React from 'react'
import { asField } from 'informed'
import { withTheme } from 'styled-components'
import system from '@rebass/components'
import { styles } from 'styled-system'
import { Flex } from 'rebass'
import { FormFieldMessage } from 'components/UI'

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
  ...Object.keys(styles)
)

/**
 * @render react
 * @name Input
 * @example
 * <Input />
 */
class Input extends React.Component {
  static displayName = 'Input'

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
      css,
      onChange,
      onBlur,
      onFocus,
      initialValue,
      forwardedRef,
      theme,
      fieldApi,
      fieldState,
      justifyContent,
      ...rest
    } = this.props
    const { readOnly } = this.props
    const { hasFocus } = this.state
    const { setValue, setTouched } = fieldApi
    const { value } = fieldState
    const isValid = value && !fieldState.error

    // Calculate the border color based on the current field state.
    let borderColor
    if (readOnly) {
      borderColor = theme.colors.gray
    } else if (fieldState.error) {
      borderColor = theme.colors.superRed
    } else if (value && !fieldState.error) {
      borderColor = theme.colors.superGreen
    }

    return (
      <Flex flexDirection="column" justifyContent={justifyContent}>
        <SystemInput
          borderColor={borderColor || theme.colors.gray}
          css={Object.assign(
            {
              outline: 'none',
              '&:not([readOnly]):not([disabled]):focus': {
                border: `1px solid ${
                  isValid ? theme.colors.superGreen : theme.colors.lightningOrange
                } }`
              }
            },
            css
          )}
          {...rest}
          ref={this.inputRef}
          value={!value && value !== 0 ? '' : initialValue || value}
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
          error={fieldState.error}
        />
        {fieldState.error && (
          <FormFieldMessage
            variant={hasFocus ? 'warning' : 'error'}
            justifyContent={justifyContent}
            mt={2}
          >
            {fieldState.error}
          </FormFieldMessage>
        )}
      </Flex>
    )
  }
}

export default asField(withTheme(Input))
