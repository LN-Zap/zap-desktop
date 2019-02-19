/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import { styles } from 'styled-system'
import system from '@rebass/components'
import { Flex } from 'rebass'
import { Message, Label, Span, Text } from 'components/UI'
import withRequiredValidation from 'components/withRequiredValidation'
import Search from 'components/Icon/Search'

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

  if (!props.highlightOnValid) {
    return borderColor
  }

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

  if (!props.highlightOnValid) {
    return lightningOrange
  }

  return fieldState.touched && isFieldValid(fieldState) ? superGreen : lightningOrange
}

const SearchIcon = styled(Search)`
  margin-right: -${props => props.width}px;
  width: ${props => props.width}px;
  height: 15px;
  color: ${props => props.color || props.theme.colors.gray};
`

// Create an html input element that accepts all style props from styled-system.
const SystemInput = styled(
  system(
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
)`
  opacity: ${props => (props.disabled || props.readOnly ? '0.6' : 'inherit')};
  outline: none;
  border-color: ${mapDefaultBorderColor};
  &:not([readOnly]):not([disabled]):focus {
    border-color: ${mapFocusBorderColor};
  }
  ::-webkit-search-decoration:hover,
  ::-webkit-search-cancel-button:hover {
    cursor: pointer;
  }
`

/**
 * @render react
 * @name Input
 * @example
 * <Input />
 */
class Input extends React.Component {
  static displayName = 'Input'

  static propTypes = {
    autoFocus: PropTypes.bool,
    type: PropTypes.string,
    className: PropTypes.string,
    description: PropTypes.node,
    forwardedRef: PropTypes.object,
    label: PropTypes.node,
    required: PropTypes.bool,
    theme: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    highlightOnValid: PropTypes.bool,
    iconSize: PropTypes.number,
    justifyContent: PropTypes.string,
    showMessage: PropTypes.bool,
    variant: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  static defaultProps = {
    required: false,
    showMessage: true,
    autoFocus: false,
    highlightOnValid: true,
    iconSize: 46
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
      description,
      onChange,
      onBlur,
      onFocus,
      forwardedRef,
      label,
      required,
      theme,
      type,
      field,
      fieldApi,
      fieldState,
      iconSize,
      justifyContent,
      showMessage,
      variant,
      className,
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
      <Flex
        flexDirection="column"
        justifyContent={justifyContent}
        {...spaceProps}
        className={className}
      >
        {typeof label !== 'undefined' && label !== null && (
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

        <Flex alignItems="center">
          {type === 'search' && <SearchIcon width={iconSize} />}
          <SystemInput
            p={variant === 'thin' ? 2 : 3}
            {...rest}
            field={field}
            type={type}
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
            pl={type === 'search' ? 35 : null}
          />
        </Flex>

        {type !== 'hidden' && description && (
          <Text color="gray" fontSize="s" mt={1}>
            {description}
          </Text>
        )}
        {type !== 'hidden' && showMessage && (fieldState.error || fieldState.asyncError) && (
          <Message variant={hasFocus ? 'warning' : 'error'} mt={1}>
            {fieldState.error || fieldState.asyncError}
          </Message>
        )}
      </Flex>
    )
  }
}

export default withRequiredValidation(withTheme(asField(Input)))
