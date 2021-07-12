import { themeGet } from '@styled-system/theme-get'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'

const Overlay = styled(Flex)`
  position: ${props => (props.position ? props.position : 'absolute')};
  z-index: 99998;
  background-color: ${themeGet('colors.primaryColor')}CC;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export default Overlay
