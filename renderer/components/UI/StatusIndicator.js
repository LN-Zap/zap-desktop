import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'
import { variant } from 'styled-system'
import Circle from 'components/Icon/Circle'
import Spinner from './Spinner'

const indicatorStyle = variant({ key: 'statuses' })
const StyledStatusIndicator = styled(Box)(indicatorStyle)

const StatusIndicator = ({ variant, ...rest }) => (
  <StyledStatusIndicator variant={variant} {...rest}>
    {['loading'].includes(variant) ? (
      <Spinner height="0.7em" width="0.7em" />
    ) : (
      <Circle height="0.7em" width="0.7em" />
    )}
  </StyledStatusIndicator>
)
StatusIndicator.propTypes = {
  variant: PropTypes.string,
}

export default StatusIndicator
