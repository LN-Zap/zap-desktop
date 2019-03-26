/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import { styles } from 'styled-system'
import system from '@rebass/components'
import { Flex } from 'rebass'
import Search from 'components/Icon/Search'
import { withRequiredValidation } from 'hocs'
import Message from './Message'
import Label from './Label'
import Span from './Span'
import Text from './Text'
import Tooltip from './Tooltip'

function isFieldValid({ value, error, asyncError, touched }) {
  return value && !error && !asyncError && touched
}

function mapDefaultBorderColor(props) {
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

function mapFocusBorderColor(props) {
  const {
    fieldState,
    theme: {
      colors: { lightningOrange, superGreen },
    },
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
      width: 1,
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
    className: PropTypes.string,
    description: PropTypes.node,
    field: PropTypes.string.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    forwardedRef: PropTypes.object,
    hasMessage: PropTypes.bool,
    highlightOnValid: PropTypes.bool,
    iconSize: PropTypes.number,
    isDisabled: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isRequired: PropTypes.bool,
    justifyContent: PropTypes.string,
    label: PropTypes.node,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    theme: PropTypes.object.isRequired,
    tooltip: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string,
    willAutoFocus: PropTypes.bool,
  }

  static defaultProps = {
    isRequired: false,
    isReadOnly: false,
    isDisabled: false,
    hasMessage: true,
    willAutoFocus: false,
    highlightOnValid: true,
    iconSize: 46,
    tooltip: null,
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
      isReadOnly,
      isRequired,
      theme,
      type,
      field,
      fieldApi,
      fieldState,
      iconSize,
      justifyContent,
      hasMessage,
      variant,
      className,
      tooltip,
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
        {label && (
          <Flex mb={2}>
            <Label htmlFor={field}>
              {label}
              {isRequired && (
                <Span css={{ 'vertical-align': 'top' }} fontSize="s">
                  {' '}
                  *
                </Span>
              )}
            </Label>
            {tooltip && <Tooltip ml={1}>{tooltip}</Tooltip>}
          </Flex>
        )}

        <Flex alignItems="center">
          {type === 'search' && <SearchIcon width={iconSize} />}
          <SystemInput
            p={variant === 'thin' ? 2 : 3}
            {...rest}
            ref={this.inputRef}
            disabled={isDisabled}
            field={field}
            fieldState={fieldState}
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
            onChange={e => {
              setValue(e.target.value)
              if (onChange) {
                onChange(e)
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
            readOnly={isReadOnly}
            required={isRequired}
            theme={theme}
            type={type}
            value={!value && value !== 0 ? '' : value}
          />
        </Flex>

        {type !== 'hidden' && description && (
          <Text color="gray" fontSize="s" mt={1}>
            {description}
          </Text>
        )}
        {type !== 'hidden' && hasMessage && (fieldState.error || fieldState.asyncError) && (
          <Message mt={1} variant={hasFocus ? 'warning' : 'error'}>
            {fieldState.error || fieldState.asyncError}
          </Message>
        )}
      </Flex>
    )
  }
}

export default withRequiredValidation(withTheme(asField(Input)))
