import React from 'react'
import { asField } from 'informed'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import styled from 'styled-components'
import Check from 'components/Icon/Check'
import Text from './Text'

const mapOutlineBorderColor = props => {
  const {
    isDisabled,
    isChecked,
    theme: {
      colors: { gray, lightningOrange },
    },
  } = props
  return !isChecked || isDisabled ? gray : lightningOrange
}

const mapOutlineBackgroundColor = props => {
  const {
    isDisabled,
    isChecked,
    theme: {
      colors: { lightningOrange },
    },
  } = props
  return !isChecked || isDisabled ? 'transparent' : lightningOrange
}

const CheckboxOutline = styled(Flex)`
  height: 18px;
  border-radius: 5px;
  border: 1px solid ${mapOutlineBorderColor};
  background-color: ${mapOutlineBackgroundColor};
`

function mapContainerBorderColor(props) {
  const {
    isDisabled,
    theme: {
      colors: { gray, lightningOrange },
    },
  } = props
  return isDisabled ? gray : lightningOrange
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
  return isChecked && <Check height={13} width={13} />
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
      borderRadius={6}
      color={isDisabled ? 'gray' : 'primaryColor'}
      isChecked={isChecked}
      isDisabled={isDisabled}
      justifyContent="center"
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
  isDisabled: false,
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
    setTouched()
    setValue(!value)
  }

  return <Checkbox isChecked={value} onChange={onChange} {...rest} />
}

WrappedCheckboxAsField.propTypes = {
  description: PropTypes.node,
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

export default asField(WrappedCheckboxAsField)
