import React, { useContext } from 'react'
import { Card, Flex } from 'rebass/styled-components'
import { themeGet } from '@styled-system/theme-get'
import styled, { ThemeContext } from 'styled-components'
import { tint } from 'polished'
import { Text } from 'components/UI'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, themeGet('colors.primaryAccent')(props))},
    ${themeGet('colors.primaryAccent')}
  );
`

const AutopayAddButton = props => {
  const theme = useContext(ThemeContext)

  return (
    <Gradient
      bg="primaryAccent"
      size={35}
      sx={{
        boxShadow: `0 0 24px 0 ${themeGet('colors.primaryAccent')({ theme })}`,
        borderRadius: '50%',
      }}
      {...props}
      theme={theme}
    >
      <Flex alignItems="center" height="100%" justifyContent="center">
        <Text fontSize="xl">+</Text>
      </Flex>
    </Gradient>
  )
}

export default AutopayAddButton
