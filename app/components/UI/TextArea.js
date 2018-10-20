import React from 'react'
import { asField } from 'informed'
import { TextArea as Base } from 'styled-system-html'
import { withTheme } from 'styled-components'
import { Flex } from 'rebass'
import { FormFieldMessage } from 'components/UI'

/**
 * @render react
 * @name TextArea
 * @example
 * <TextArea />
 */
class TextArea extends React.PureComponent {
  static displayName = 'TextArea'

  render() {
    const {
      onChange,
      onBlur,
      initialValue,
      forwardedRef,
      theme,
      fieldApi,
      fieldState,
      justifyContent,
      ...rest
    } = this.props
    const { setValue, setTouched } = fieldApi
    const { value } = fieldState

    let borderColor
    if (fieldState.error) {
      borderColor = theme.colors.superRed
    } else if (value && !fieldState.error) {
      borderColor = theme.colors.superGreen
    }

    return (
      <Flex flexDirection="column" justifyContent={justifyContent}>
        <Base
          outline="none"
          borderRadius="5px"
          borderColor={borderColor || theme.colors.white}
          border="1px solid white"
          bg="transparent"
          color="white"
          p={3}
          type="text"
          fontSize="m"
          width={1}
          rows="5"
          css={{
            '&:focus': {
              outline: 'none',
              border: `1px solid ${borderColor || theme.colors.lightningOrange} }`
            }
          }}
          {...rest}
          ref={forwardedRef}
          value={!value && value !== 0 ? '' : value}
          onChange={e => {
            setValue(e.target.value)
            if (onChange) {
              onChange(e)
            }
          }}
          onBlur={e => {
            setTouched()
            if (onBlur) {
              onBlur(e)
            }
          }}
          error={fieldState.error}
        />
        {fieldState.error && (
          <FormFieldMessage variant="error" justifyContent={justifyContent}>
            {fieldState.error}
          </FormFieldMessage>
        )}
      </Flex>
    )
  }
}

export default asField(withTheme(TextArea))
