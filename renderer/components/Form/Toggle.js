import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import { BasicCheckbox, asField } from 'informed'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { Text } from 'components/UI'

const Wrapper = styled.div`
  position: relative;
  user-select: none;
  .switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 18px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${themeGet('colors.gray')};
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 10px;
    width: 10px;
    left: 4px;
    top: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: ${themeGet('shadows.xs')};
  }

  input:checked + .slider {
    background-color: ${themeGet('colors.superGreen')};
  }

  input:checked + .slider:before {
    transform: translateX(13px);
  }
`

const Toggle = ({ fieldState, onLabel, offLabel, ...props }) => (
  <Wrapper>
    <Flex>
      <label // eslint-disable-line jsx-a11y/label-has-for,jsx-a11y/label-has-associated-control
        className="switch"
      >
        <BasicCheckbox fieldState={fieldState} type="checkbox" {...props} />
        <span className="slider round" />
      </label>
      {fieldState.value && onLabel && <Text ml={2}>{onLabel}</Text>}
      {!fieldState.value && offLabel && <Text ml={2}>{offLabel}</Text>}
    </Flex>
  </Wrapper>
)

Toggle.propTypes = {
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  offLabel: PropTypes.node,
  onLabel: PropTypes.node,
}

export { Toggle as BasicToggle }

export default asField(Toggle)
