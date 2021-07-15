import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import { Bar } from 'components/UI'

import Htlc from './Htlc'

const Route = ({ htlcs, ...rest }) => {
  return (
    <Box {...rest}>
      {htlcs.map((htlc, index) => {
        const isFirst = index === 0
        const isMpp = htlcs.length > 1
        return (
          <React.Fragment key={htlc.attemptTimeNs + htlc.resolveTimeNs}>
            {!isFirst && <Bar my={2} opacity={0.2} variant="light" />}
            <Htlc isAmountVisible={isMpp} route={htlc.route} />
          </React.Fragment>
        )
      })}
    </Box>
  )
}

Route.propTypes = {
  htlcs: PropTypes.array.isRequired,
}

export default Route
