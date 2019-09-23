/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import { styles } from 'styled-system'
import system from '@rebass/components'
import { Flex } from 'rebass'
import { withInputValidation } from 'hocs'
import Message from './Message'
import InputLabel from './InputLabel'
import Text from './Text'

const isFieldValid = ({ value, error, asyncError, touched }) => {
  return value && !error && !asyncError && touched
}

const mapDefaultBorderColor = props => {
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

  if (!props.highlightOnValid) {
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

const mapFocusBorderColor = props => {
  const {
    fieldState,
    theme: {
      colors: { lightningOrange, superGreen },
    },
  } = props

  if (!props.highlightOnValid) {
    return lightningOrange
  }

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
      rows: 5,
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
`

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
          <InputLabel field={field} isRequired={isRequired} tooltip={tooltip}>
            {label}
          </InputLabel>
        )}
        <SystemTextArea
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
          {...rest}
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
