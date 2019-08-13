import React from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import { Flex } from 'rebass'
import Search from 'components/Icon/Search'
import { extractSpaceProps } from 'themes/util'
import { withInputValidation } from 'hocs'
import { Message, Text } from 'components/UI'
import InputLabel from './InputLabel'
import { createSystemInput } from './util'

const SearchIcon = styled(Search)`
  margin-right: -${props => props.width}px;
  width: ${props => props.width}px;
  height: 15px;
  color: ${props => props.color || props.theme.colors.gray};
`

// Create an html input element that accepts all style props from styled-system.
export const SystemInput = createSystemInput('input')

/**
 * @name Input
 * @example
 * <Input />
 */
class Input extends React.Component {
  static displayName = 'Input'

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    description: PropTypes.node,
    field: PropTypes.string.isRequired,
    fieldApi: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
    forwardedRef: PropTypes.object,
    hasMessage: PropTypes.bool,
    highlightOnValid: PropTypes.bool,
    iconSize: PropTypes.number,
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
    initialValue: '',
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
      maxLength,
      minLength,
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
      children,
      initialValue,
      ...rest
    } = this.props
    const { hasFocus } = this.state
    const { setValue, setTouched } = fieldApi
    const { value } = fieldState
    const [spaceProps, otherProps] = extractSpaceProps(rest)

    const getValue = () => {
      if (typeof value === 'undefined') {
        return initialValue
      }
      const { fieldState } = this.props
      const { maskedValue } = fieldState
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
        <Flex alignItems="center">
          {type === 'search' && <SearchIcon width={iconSize} />}
          <SystemInput
            p={variant === 'thin' ? 2 : 3}
            {...otherProps}
            ref={this.inputRef}
            disabled={isDisabled}
            field={field}
            fieldState={fieldState}
            maxLength={maxLength}
            minLength={minLength}
            onBlur={e => {
              // set touched to true to enforce validity highlight
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
            pl={type === 'search' ? 35 : null}
            readOnly={isReadOnly}
            theme={theme}
            type={type}
            value={getValue()}
          />
          {children}
        </Flex>

        {type !== 'hidden' && description && (
          <Text color="gray" fontSize="s" mt={1}>
            {description}
          </Text>
        )}
        {type !== 'hidden' && hasMessage && fieldState.error && (
          <Message mt={1} variant={hasFocus ? 'warning' : 'error'}>
            {fieldState.error}
          </Message>
        )}
      </Flex>
    )
  }
}

const BasicInput = withTheme(Input)

export { BasicInput }

export default compose(
  withInputValidation,
  asField
)(BasicInput)
