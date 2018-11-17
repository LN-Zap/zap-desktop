import React from 'react'
import { asField } from 'informed'
import system from '@rebass/components'
import { styles } from 'styled-system'
import { withTheme } from 'styled-components'
import { Flex } from 'rebass'
import { Message, Label, Span, Text } from 'components/UI'

// Create an html textarea element that accepts all style props from styled-system.
const SystemTextArea = system(
  {
    as: 'textarea',
    border: 1,
    borderColor: 'gray',
    borderRadius: '5px',
    bg: 'transparent',
    color: 'primaryText',
    fontFamily: 'sans',
    fontSize: 'm',
    fontWeight: 'light',
    p: 3,
    width: 1,
    rows: 5
  },
  ...Object.keys(styles)
)

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
    } else if (fieldState.error || fieldState.asyncError) {
      borderColor = theme.colors.superRed
    } else if (value && (!fieldState.error && !fieldState.asyncError)) {
      borderColor = theme.colors.superGreen
    }

    // Extract any styled-system space props so that we can apply them directly to the wrapper.
    const spaceProps = {}
    Object.keys(rest).forEach(key => {
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
          borderColor={borderColor || theme.colors.gray}
          opacity={readOnly ? 0.6 : null}
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
          error={fieldState.error}
        />
        <Flex>
          {description && (
            <Text color="gray" fontSize="s" mt={1} mr="auto">
              {description}
            </Text>
          )}
          {showMessage &&
            (fieldState.error || fieldState.asyncError) && (
              <Message
                variant={hasFocus ? 'warning' : 'error'}
                justifyContent={justifyContent}
                mt={1}
                ml="auto"
              >
                {fieldState.error || fieldState.asyncError}
              </Message>
            )}
        </Flex>
      </Flex>
    )
  }
}

export default asField(withTheme(TextArea))
