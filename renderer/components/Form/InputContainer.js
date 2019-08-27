import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { Flex } from 'rebass'

const InputContainer = withTheme(props => (
  <Flex alignItems="center" variant="normal" {...props} tx="forms.input" />
))

InputContainer.propTypes = {
  variant: PropTypes.string,
}

InputContainer.defaultProps = {
  variant: 'normal',
}

export default InputContainer
