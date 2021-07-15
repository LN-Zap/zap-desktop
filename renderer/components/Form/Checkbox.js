import React from 'react'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import Check from 'components/Icon/Check'
import { Text } from 'components/UI'

const mapOutlineBorderColor = props => {
  const {
    isDisabled,
    isChecked,
    theme: {
      colors: { gray, primaryAccent },
    },
  } = props
  return !isChecked || isDisabled ? gray : primaryAccent
}

const mapOutlineBackgroundColor = props => {
  const {
    isDisabled,
    isChecked,
    theme: {
      colors: { primaryAccent },
    },
  } = props
  return !isChecked || isDisabled ? 'transparent' : primaryAccent
}

const CheckboxOutline = styled(Flex)`
  height: 18px;
  border-radius: 5px;
  border: 1px solid ${mapOutlineBorderColor};
  background-color: ${mapOutlineBackgroundColor};
`

const mapContainerBorderColor = props => {
  const {
    isDisabled,
    theme: {
      colors: { gray, primaryAccent },
    },
  } = props
  return isDisabled ? gray : primaryAccent
}

const Container = styled(Flex)`
  cursor: ${props => (props.isDisabled ? 'auto' : 'pointer')};
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

const Checkmark = ({ isChecked, isDisabled }) => {
  if (isDisabled) {
    return <DisabledCheck />
  }
  if (isChecked) {
    return <Check height="13px" width="13px" />
  }
  return null
}
Checkmark.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
}

const DisabledCheck = styled.div`
  width: 6px;
  height: 0;
  border: 1px solid gray;
  border-radius: 5px;
`

const Checkbox = ({ label, description, isChecked, isDisabled, onChange, ...rest }) => (
  <Container onClick={onChange} {...rest} isChecked={isChecked} isDisabled={isDisabled}>
    <HiddenCheckbox checked={isChecked} onChange={() => {}} />
    <CheckboxOutline
      alignItems="center"
      color={isDisabled ? 'gray' : 'primaryColor'}
      isChecked={isChecked}
      isDisabled={isDisabled}
      justifyContent="center"
      sx={{
        borderRadius: 's',
      }}
      width={18}
    >
      <Checkmark isChecked={isChecked} isDisabled={isDisabled} />
    </CheckboxOutline>
    <Flex alignItems="flex-start" flexDirection="column" ml={2}>
      <Text>{label}</Text>
      {description && (
        <Text color="gray" mt={2}>
          {description}
        </Text>
      )}
    </Flex>
  </Container>
)

Checkbox.defaultProps = {
  isChecked: false,
}

Checkbox.propTypes = {
  description: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

const WrappedCheckboxAsField = ({ fieldState, fieldApi, ...rest }) => {
  const { value } = fieldState
  const { setValue, setTouched } = fieldApi

  const onChange = () => {
    setTouched(true)
    setValue(!value)
  }

  return <Checkbox {...rest} isChecked={value} onChange={onChange} />
}

WrappedCheckboxAsField.propTypes = {
  description: PropTypes.node,
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

export { WrappedCheckboxAsField as BasicCheckbox }

export default asField(WrappedCheckboxAsField)
