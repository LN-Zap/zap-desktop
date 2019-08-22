import React, { useState } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass/styled-components'
import Search from 'components/Icon/Search'
import { extractSpaceProps } from 'themes/util'
import { withInputValidation } from 'hocs'
import { useAutoFocus } from 'hooks'
import { Message, Text } from 'components/UI'
import InputLabel from './InputLabel'
import { StyledInput } from './util'

const SearchIcon = styled(Search)`
  margin-right: -${props => props.width}px;
  width: ${props => props.width}px;
  height: 15px;
  color: ${themeGet('colors.gray')};
`

const Input = ({
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
  willAutoFocus,
  ...rest
}) => {
  const [hasFocus, setFocus] = useState(false)
  const [spaceProps, otherProps] = extractSpaceProps(rest)
  const { setValue, setTouched } = fieldApi
  const { value, maskedValue, error, asyncError } = fieldState

  useAutoFocus(forwardedRef, willAutoFocus)

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
      <Flex alignItems="center">
        {type === 'search' && <SearchIcon width={iconSize} />}
        <StyledInput
          disabled={isDisabled}
          fieldState={fieldState}
          maxLength={maxLength}
          minLength={minLength}
          name={field}
          onBlur={e => {
            // set touched to true to enforce validity highlight
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
          pl={type === 'search' ? 35 : null}
          readOnly={isReadOnly}
          required={isRequired}
          theme={theme}
          type={type}
          value={getValue()}
          {...otherProps}
          ref={forwardedRef}
        />
        {children}
      </Flex>

      {type !== 'hidden' && description && (
        <Text color="gray" fontSize="s" mt={1}>
          {description}
        </Text>
      )}
      {type !== 'hidden' && hasMessage && (error || asyncError) && (
        <Message mt={1} variant={hasFocus ? 'warning' : 'error'}>
          {error || asyncError}
        </Message>
      )}
    </Flex>
  )
}

Input.propTypes = {
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

Input.defaultProps = {
  hasMessage: true,
  highlightOnValid: true,
  iconSize: 46,
  initialValue: '',
}

const BasicInput = withTheme(Input)

export { BasicInput }

export default compose(
  withInputValidation,
  asField
)(BasicInput)
