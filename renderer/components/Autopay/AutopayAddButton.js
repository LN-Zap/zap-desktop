import React from 'react'
import { Card, Flex } from 'rebass/styled-components'
import { themeGet } from '@styled-system/theme-get'
import styled, { withTheme } from 'styled-components'
import { tint } from 'polished'
import { Text } from 'components/UI'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, props.theme.colors[props.bg])},
    ${props => props.theme.colors[props.bg]}
  );
`

const AutopayAddButton = props => {
  return (
    <Gradient
      bg="lightningOrange"
      borderRadius="50%"
      boxShadow={`0 0 24px 0 ${themeGet('colors.lightningOrange')(props)}`}
      css={`
        height: 35px;
      `}
      width={35}
      {...props}
    >
      <Flex
        alignItems="center"
        css={`
          height: 100%;
        `}
        justifyContent="center"
      >
        <Text fontSize="xl">+</Text>
      </Flex>
    </Gradient>
  )
}

export default withTheme(AutopayAddButton)
