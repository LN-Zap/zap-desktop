import React from 'react'
import PropTypes from 'prop-types'
import { Radio as InformedRadio } from 'informed'
import styled from 'styled-components'
import { Box } from 'rebass'
import Label from './Label'
import Text from './Text'

const Wrapper = styled(Box)`
  /* The container */
  .container {
    display: block;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  /* Hide the browser's default radio button */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */
  .selection {
    position: absolute;
    top: 1px;
    left: 0;
    height: 16px;
    width: 16px;
    border: 1px solid ${props => props.theme.colors.gray};
    border-radius: 50%;
  }

  /* On mouse-over, add an orange border color */
  .container:hover input ~ .selection {
    border: 1px solid ${props => props.theme.colors.lightningOrange};
  }

  /* When the radio button is checked, make the border orange */
  .container input:checked ~ .selection {
    border: 1px solid ${props => props.theme.colors.lightningOrange};
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .selection:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  .container input:checked ~ .selection:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .container .selection:after {
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.colors.lightningOrange};
  }
`
const Radio = ({
  value,
  label,
  description,
  fontWeight,
  onChange,
  onBlur,
  isDisabled,
  ...rest
}) => (
  <Wrapper>
    <Label
      className="container"
      fontWeight="light"
      htmlFor={value}
      mb={3}
      pl={label || description ? 30 : 0}
      {...rest}
    >
      <Text>{label}</Text>
      <InformedRadio
        disabled={isDisabled}
        id={value}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      />
      <span className="selection" />
      {description && (
        <Text color="gray" mt={2}>
          {description}
        </Text>
      )}
    </Label>
  </Wrapper>
)

Radio.propTypes = {
  description: PropTypes.node,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
}

export default Radio
