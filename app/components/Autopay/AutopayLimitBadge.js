import React from 'react'
import { Card, Flex, Box } from 'rebass'
import { themeGet } from 'styled-system'
import styled, { withTheme } from 'styled-components'
import { tint } from 'polished'
import Check from 'components/Icon/Check'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, props.theme.colors[props.bg])},
    ${props => props.theme.colors[props.bg]}
  );
`

const AutopayLimitBadge = props => {
  return (
    <Gradient
      bg="lightningOrange"
      borderRadius="50%"
      boxShadow={`0 0 24px 0 ${themeGet('colors.lightningOrange')(props)}`}
      css={{ height: '35px' }}
      width={35}
      {...props}
    >
      <Flex alignItems="center" css={{ height: '100%' }} justifyContent="center">
        <Box color="white">
          <Check height={20} width={20} />
        </Box>
      </Flex>
    </Gradient>
  )
}

export default withTheme(AutopayLimitBadge)
