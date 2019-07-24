import styled, { withTheme } from 'styled-components'
import { Flex } from 'rebass'

const Overlay = styled(Flex)`
  position: ${props => (props.position ? props.position : 'absolute')};
  z-index: 99998;
  background-color: ${props => props.theme.colors.primaryColor + 'CC'};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export default withTheme(Overlay)
