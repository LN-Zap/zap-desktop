import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Box } from 'rebass'

import { themeGet } from 'styled-system'
import styled, { withTheme } from 'styled-components'
import { tint } from 'polished'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, props.theme.colors[props.bg])},
    ${props => props.theme.colors[props.bg]}
  );
`

const AutopayLimitBadge = ({ limit, limitCurrency, ...rest }) => {
  return (
    <Gradient
      bg="lightningOrange"
      borderRadius="14px"
      boxShadow={`0 0 24px 0 ${themeGet('colors.lightningOrange')(rest)}`}
      css={{ height: '27px' }}
      px={2}
      {...rest}
    >
      <Flex alignItems="center" css={{ height: '100%' }} justifyContent="center">
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

export default withTheme(AutopayLimitBadge)
