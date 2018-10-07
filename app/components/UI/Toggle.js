import React from 'react'
import styled from 'styled-components'
import { Checkbox, asField } from 'informed'

const Wrapper = styled.div`
  position: relative;

  .switch {
    position: relative;
    display: inline-block;
    width: 35px;
    height: 22px;
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
    background-color: ${props => props.theme.colors.gray};
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 1px;
    bottom: 1px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 1px 1px 3px ${props => props.theme.colors.invisibleGray};
  }

  input:checked + .slider {
    background-color: ${props => props.theme.colors.superGreen};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    transform: translateX(13px);
  }
`

const Toggle = ({ fieldState, ...props }) => (
  <Wrapper>
    <label // eslint-disable-line jsx-a11y/label-has-for,jsx-a11y/label-has-associated-control
      className="switch"
    >
      <Checkbox type="checkbox" fieldState={fieldState} {...props} />
      <span className="slider round" />
    </label>
  </Wrapper>
)

export default asField(Toggle)
