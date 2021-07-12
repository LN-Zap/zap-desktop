import React, { useContext } from 'react'

import { themeGet } from '@styled-system/theme-get'
import { tint } from 'polished'
import { Card, Flex } from 'rebass/styled-components'
import styled, { ThemeContext } from 'styled-components'

import { Text } from 'components/UI'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, props.color)},
    ${props => props.color}
  );
`

const AutopayAddButton = props => {
  const theme = useContext(ThemeContext)

  return (
    /* eslint-disable shopify/jsx-no-hardcoded-content */
    <Gradient
      bg="primaryAccent"
      color={themeGet('colors.primaryAccent')({ theme })}
      size={35}
      sx={{
        boxShadow: `0 0 24px 0 ${themeGet('colors.primaryAccent')({ theme })}`,
        borderRadius: '50%',
      }}
      {...props}
    >
      <Flex alignItems="center" height="100%" justifyContent="center">
        <Text fontSize="xl">+</Text>
      </Flex>
    </Gradient>
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  )
}

export default AutopayAddButton
