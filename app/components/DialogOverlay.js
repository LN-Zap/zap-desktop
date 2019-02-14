import styled from 'styled-components'
import { Flex } from 'rebass'

const Overlay = styled(Flex)`
  position: absolute;
  z-index: 99999;
  background-color: rgba(255, 255, 255, 0.25);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export default Overlay
