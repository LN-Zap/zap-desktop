import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import Circle from 'components/Icon/Circle'

import Spinner from './Spinner'

const StatusIndicator = ({ variant, ...rest }) => (
  <Box variant={`statuses.${variant}`} {...rest}>
    {['loading'].includes(variant) ? (
      <Spinner height="0.7em" width="0.7em" />
    ) : (
      <Circle height="0.7em" width="0.7em" />
    )}
  </Box>
)
StatusIndicator.propTypes = {
  variant: PropTypes.string,
}

export default StatusIndicator
