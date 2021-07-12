import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import { lighten } from 'polished'
import { Box } from 'rebass/styled-components'
import styled, { keyframes } from 'styled-components'

const pulse = props => keyframes`
0% {
  background-color: ${lighten(0.03, themeGet(`colors.${props.color}`)(props))};
}
50% {
  background-color: ${lighten(0.1, themeGet(`colors.${props.color}`)(props))};
}
100% {
  background-color: ${lighten(0.03, themeGet(`colors.${props.color}`)(props))};
}
`

const PlaceholderBox = props => <Box sx={{ borderRadius: 'xl' }} {...props} />

const Placeholder = styled(PlaceholderBox)`
  animation: ${pulse} 2s linear infinite;
`

Placeholder.defaultProps = {
  color: 'secondaryColor',
}

export default Placeholder
