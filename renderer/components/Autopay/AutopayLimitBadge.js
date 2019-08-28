import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Box } from 'rebass/styled-components'
import { themeGet } from '@styled-system/theme-get'
import styled, { withTheme } from 'styled-components'
import { tint } from 'polished'

const Gradient = styled(Card)`
  background: linear-gradient(
    to bottom,
    ${props => tint(0.2, themeGet('colors.primaryAccent')(props))},
    ${themeGet('colors.primaryAccent')}
  );
`

const AutopayLimitBadge = ({ limit, limitCurrency, ...rest }) => {
  return (
    <Gradient
      height={27}
      px={2}
      sx={{
        boxShadow: `0 0 24px 0 ${themeGet('colors.primaryAccent')(rest)}`,
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

export default withTheme(AutopayLimitBadge)
