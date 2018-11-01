import React from 'react'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'

const Input = styled.input`
  overflow: hidden;
  width: 100%;
  appearance: none;
  outline: none;

  ::-webkit-slider-runnable-track {
    height: 8px;
    appearance: none;
    background-color: ${props => props.theme.colors.gray};
    margin-top: -1px;
  }

  ::-webkit-slider-thumb {
    width: 8px;
    appearance: none;
    height: 8px;
    cursor: ew-resize;
    background: ${props => props.theme.colors.primaryText};
    box-shadow: -1000px 0 0 1000px orange;
  }
`

const Range = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState
  const { setValue, setTouched } = fieldApi
  const { onChange, onBlur, initialValue, forwardedRef, ...rest } = props
  return (
    <Input
      min={0}
      max={100}
      step={1}
      {...rest}
      type="range"
      ref={forwardedRef}
      value={value || initialValue || '0'}
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
    />
  )
})

export default withTheme(Range)
