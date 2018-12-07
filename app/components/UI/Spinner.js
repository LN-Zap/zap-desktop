import React from 'react'
import styled, { keyframes } from 'styled-components'
import Spinner from 'components/Icon/Spinner'
import system from '@rebass/components'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = system(
  {
    color: 'lightningOrange'
  },
  'space',
  'color'
)

/**
 * @render react
 * @name Spinner
 * @example
 * <Spinner />
 */
const renderSpinner = Element => {
  return styled(Element)`
    animation: ${rotate360} 1s linear infinite;
  `
}

const WrappedSpinner = ({ element, size, ...rest }) => {
  const sizeProps = {}
  if (size) {
    sizeProps.width = size
    sizeProps.height = size
  }

  let Icon = Spinner
  if (element) {
    Icon = element
  }

  const Element = renderSpinner(Icon)
  return (
    <Wrapper {...rest}>
      <Element />
    </Wrapper>
  )
}

export default WrappedSpinner
