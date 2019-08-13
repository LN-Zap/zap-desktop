import React from 'react'
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

/**
 * @name TextArea
 * @example
 * <TextArea />
 */
class TextArea extends React.PureComponent {
  static displayName = 'TextArea'

  static propTypes = {
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    field: PropTypes.string.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    forwardedRef: PropTypes.object,
    hasMessage: PropTypes.bool,
    highlightOnValid: PropTypes.bool,
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

  static defaultProps = {
    hasMessage: true,
    highlightOnValid: true,
  }

  state = {
    hasFocus: false,
  }

  constructor(props) {
    super(props)
    const { forwardedRef } = this.props
    this.inputRef = forwardedRef || React.createRef()
  }

  componentDidMount() {
    const { willAutoFocus } = this.props
    if (willAutoFocus) {
      this.inputRef.current.focus()
    }
  }

  render() {
    const {
      description,
      onChange,
      onBlur,
      onFocus,
      forwardedRef,
      label,
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
      tooltip,
      ...rest
    } = this.props
    const { hasFocus } = this.state
    const { setValue, setTouched } = fieldApi
    const { maskedValue } = fieldState
    const [spaceProps, otherProps] = extractSpaceProps(rest)

    return (
      <Flex flexDirection="column" justifyContent={justifyContent} {...spaceProps}>
        {label && (
          <InputLabel field={field} isRequired={isRequired} tooltip={tooltip}>
            {label}
          </InputLabel>
        )}
        <SystemTextArea
          {...otherProps}
          ref={this.inputRef}
          disabled={isDisabled}
          field={field}
          fieldState={fieldState}
          onBlur={e => {
            // set touched to true to enforce validity highlight.
            setTouched(true)
            // Make the state aware that the element is no longer focused.
            this.setState({ hasFocus: false })
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
            this.setState({ hasFocus: true })
            if (onFocus) {
              onFocus(e)
            }
          }}
          p={variant === 'thin' ? 2 : 3}
          readOnly={isReadOnly}
          required={isRequired}
          theme={theme}
          value={!maskedValue && maskedValue !== 0 ? '' : maskedValue}
        />
        {description && (
          <Text color="gray" fontSize="s" mt={1}>
            {description}
          </Text>
        )}
        {hasMessage && (fieldState.error || fieldState.asyncError) && (
          <Message mt={1} variant={hasFocus ? 'warning' : 'error'}>
            {fieldState.error || fieldState.asyncError}
          </Message>
        )}
      </Flex>
    )
  }
}

const BasicTextArea = withTheme(TextArea)

export { BasicTextArea }

export default compose(
  withInputValidation,
  asField
)(BasicTextArea)
