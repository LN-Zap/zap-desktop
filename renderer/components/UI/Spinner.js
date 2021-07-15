import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'

import Spinner from 'components/Icon/Spinner'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const renderSpinner = Element => {
  return styled(Element)`
    animation: ${rotate360} 1s linear infinite;
  `
}

const WrappedSpinner = ({ element, width, height, ...rest }) => {
  const Icon = element || Spinner
  const Element = renderSpinner(Icon)
  return (
    <Box color="primaryAccent" {...rest}>
      <Element height={height} width={width} />
    </Box>
  )
}

WrappedSpinner.propTypes = {
  element: PropTypes.node,
  height: PropTypes.string,
  width: PropTypes.string,
}

WrappedSpinner.defaultProps = {
  width: '1em',
  height: '1em',
}

export default WrappedSpinner
