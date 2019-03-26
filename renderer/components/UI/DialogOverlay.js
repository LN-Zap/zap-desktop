import styled, { withTheme } from 'styled-components'
import { Flex } from 'rebass'

const Overlay = styled(Flex)`
  position: absolute;
  z-index: 99999;
  background-color: ${props => props.theme.colors.primaryText + '3F'};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export default withTheme(Overlay)
