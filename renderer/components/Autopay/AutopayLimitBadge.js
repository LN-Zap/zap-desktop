import React, { useContext } from 'react'

import { themeGet } from '@styled-system/theme-get'
import { tint } from 'polished'
import PropTypes from 'prop-types'
import { Card, Flex, Box } from 'rebass/styled-components'
import styled, { ThemeContext } from 'styled-components'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, props.color)},
    ${props => props.color}
  );
`

const AutopayLimitBadge = ({ limit, limitCurrency, ...rest }) => {
  const theme = useContext(ThemeContext)

  return (
    <Gradient
      color={themeGet('colors.primaryAccent')({ theme })}
      height={27}
      px={2}
      sx={{
        boxShadow: `0 0 24px 0 ${themeGet('colors.primaryAccent')({ theme })}`,
        borderRadius: 'l',
      }}
      {...rest}
    >
      <Flex alignItems="center" height="100%" justifyContent="center">
        <Box color="white">
          {limit} {limitCurrency}
        </Box>
      </Flex>
    </Gradient>
  )
}

AutopayLimitBadge.propTypes = {
  limit: PropTypes.string.isRequired,
  limitCurrency: PropTypes.string.isRequired,
}

export default AutopayLimitBadge
