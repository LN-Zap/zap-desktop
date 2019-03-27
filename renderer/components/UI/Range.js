import React from 'react'
import { asField } from 'informed'
import styled, { withTheme } from 'styled-components'

function makelongshadow(color, size, width) {
  let val = `4px 0px 0 ${size} ${color}`
  for (let i = 5; i < width; i++) {
    val += `, ${i}px 0px 0 ${size} ${color}`
  }
  val += ', 0 2px 4px 0 rgba(0, 0, 0, 0.5)'
  return val
}

const Input = styled.input`
  appearance: none;
  background: none;
  cursor: pointer;
  display: inline-block;
  height: 100%;
  min-height: 20px;
  overflow: hidden;
  width: ${props => props.sliderWidth};

  &:focus {
    box-shadow: none;
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    background: ${props => props.theme.colors[props.backgroundFilledSlider]};
    content: '';
    height: ${props => props.sliderHeight};
    pointer-events: none;
    border: ${props => props.sliderBorderWidth} solid ${props => props.sliderBorderColor};
    border-radius: ${props => props.sliderBorderRadius};
  }

  &::-webkit-slider-thumb {
    width: ${props => props.thumbWidth};
    height: ${props => props.thumbHeight};
    appearance: none;
    background: ${props => props.theme.colors[props.thumbBackground]};
    border-radius: ${props => props.thumbRadius};
    box-shadow: ${props =>
      makelongshadow(
        props.theme.colors[props.backgroundSlider],
        props.shadowSize,
        props.sliderWidthNumber
      )};
    margin-top: ${props => props.fitThumbInSlider};
    border: ${props => props.thumbBorder};
  }
`

const Range = asField(({ fieldState, fieldApi, ...props }) => {
  const { value } = fieldState
  const { setValue, setTouched } = fieldApi
  const { onChange, onBlur, forwardedRef, sliderWidthNumber = 200, ...rest } = props
  const styleProps = {
    sliderWidthNumber,
    sliderWidth: `${sliderWidthNumber}px`,
    sliderHeight: '4px',
    sliderBorderWidth: '0px',
    sliderBorderColor: 'white',
    sliderBorderRadius: '3px',
    backgroundSlider: 'gray',
    thumbWidth: '8px',
    thumbHeight: '8px',
    thumbRadius: '50%',
    thumbBorder: '0px solid black',
    thumbBackground: 'primaryText',
    shadowSize: '-2px',
    fitThumbInSlider: '-2px',
    backgroundFilledSlider: 'lightningOrange',
  }

  return (
    <Input
      {...styleProps}
      max={100}
      min={0}
      step={1}
      {...rest}
      ref={forwardedRef}
      onBlur={e => {
        setTouched()
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
      type="range"
      value={value || 0}
    />
  )
})

export default withTheme(Range)
