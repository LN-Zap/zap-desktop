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
const SpinningSpinner = styled(Spinner)`
  animation: ${rotate360} 1s linear infinite;
`

const WrappedSpinner = props => (
  <Wrapper {...props}>
    <SpinningSpinner />
  </Wrapper>
)

export default WrappedSpinner
