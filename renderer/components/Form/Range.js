import React, { useContext } from 'react'

import { themeGet } from '@styled-system/theme-get'
import { asField } from 'informed'
import PropTypes from 'prop-types'
import styled, { ThemeContext } from 'styled-components'

/**
 * makelongshadow - Helper method to create the box-shadow for slider-thumb.
 * This is a hack around the fact that slider-thumb only supports a single color.
 *
 * @param {string} color Color
 * @param {string} size  Sioze
 * @param {number} width Shadow width
 * @returns {string} Shadow css
 */
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
    background: ${props => themeGet(`colors.${props.backgroundFilledSlider}`)(props)};
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
    background: ${props => themeGet(`colors.${props.thumbBackground}`)(props)};
    border-radius: ${props => props.thumbRadius};
    box-shadow: ${props =>
      makelongshadow(
        themeGet(`colors.${props.backgroundSlider}`)(props),
        props.shadowSize,
        props.sliderWidthNumber
      )};
    margin-top: ${props => props.fitThumbInSlider};
    border: ${props => props.thumbBorder};
  }
`

const Range = ({ fieldState, fieldApi, ...props }) => {
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
    backgroundFilledSlider: 'primaryAccent',
  }
  const theme = useContext(ThemeContext)

  return (
    <Input
      {...styleProps}
      max={100}
      min={0}
      step={1}
      {...rest}
      onBlur={e => {
        setTouched(true)
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
      ref={forwardedRef}
      theme={theme}
      type="range"
      value={value || 0}
    />
  )
}

Range.propTypes = {
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  forwardedRef: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  sliderWidthNumber: PropTypes.number,
}

const BasicRange = Range
export { BasicRange }

export default asField(BasicRange)
