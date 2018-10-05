import styled, { keyframes } from 'styled-components'
import { Card } from 'rebass'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

/**
 * @render react
 * @name Spinner
 * @example
 * <Spinner />
 */
const Spinner = styled(Card)`
  border: 1px solid rgba(235, 184, 100, 0.1);
  border-left-color: rgba(235, 184, 100, 0.6);
  display: inline-block;
  animation: ${rotate360} 1s linear infinite;
`

Spinner.displayName = 'Spinner'
Spinner.defaultProps = {
  borderRadius: 999,
  width: '1em',
  css: {
    height: '1em'
  }
}

export default Spinner
