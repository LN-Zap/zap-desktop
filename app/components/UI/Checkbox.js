import React from 'react'
import { asField } from 'informed'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import styled from 'styled-components'
import Check from 'components/Icon/Check'
import Text from './Text'

const mapOutlineBorderColor = props => {
  const {
    disabled,
    checked,
    theme: {
      colors: { gray, lightningOrange }
    }
  } = props
  return !checked || disabled ? gray : lightningOrange
}

const mapOutlineBackgroundColor = props => {
  const {
    disabled,
    checked,
    theme: {
      colors: { lightningOrange }
    }
  } = props
  return !checked || disabled ? 'transparent' : lightningOrange
}

const CheckboxOutline = styled(Flex)`
  height: 18px;
  border-radius: 5px;
  border: 1px solid ${mapOutlineBorderColor};
  background-color: ${mapOutlineBackgroundColor};
`

function mapContainerBorderColor(props) {
  const {
    disabled,
    theme: {
      colors: { gray, lightningOrange }
    }
  } = props
  return disabled ? gray : lightningOrange
}

const Container = styled(Flex)`
  cursor: ${props => (props.disabled ? 'auto' : 'pointer')};
  user-select: none;
  &:hover ${CheckboxOutline} {
    border-color: ${mapContainerBorderColor};
  }
`

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const Checkmark = ({ checked, disabled }) => {
  if (disabled) {
    return <DisabledCheck />
  }
  return checked && <Check width={13} height={13} />
}

const DisabledCheck = styled.div`
  width: 6px;
  height: 0;
  border: 1px solid gray;
  border-radius: 5px;
`

const Checkbox = ({ label, description, checked, disabled, onChange, ...rest }) => (
  <Container onClick={onChange} {...rest} disabled={disabled} checked={checked}>
    <HiddenCheckbox checked={checked} onChange={() => {}} />
    <CheckboxOutline
      borderRadius={6}
      width={18}
      disabled={disabled}
      color={disabled ? 'gray' : 'primaryColor'}
      checked={checked}
      alignItems="center"
      justifyContent="center"
    >
      <Checkmark checked={checked} disabled={disabled} />
    </CheckboxOutline>
    <Flex flexDirection="column" alignItems="flex-start" ml={2}>
      <Text>{label}</Text>
      {description && (
        <Text mt={2} color="gray">
          {description}
        </Text>
      )}
    </Flex>
  </Container>
)

Checkbox.defaultProps = {
  checked: false,
  disabled: false
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

const WrappedCheckboxAsField = ({ fieldState, fieldApi, ...rest }) => {
  const { value } = fieldState
  const { setValue, setTouched } = fieldApi

  const onChange = () => {
    setTouched()
    setValue(!value)
  }

  return <Checkbox checked={value} onChange={onChange} {...rest} />
}

WrappedCheckboxAsField.propTypes = {
  fieldState: PropTypes.object.isRequired,
  fieldApi: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  description: PropTypes.node
}

export default asField(WrappedCheckboxAsField)
