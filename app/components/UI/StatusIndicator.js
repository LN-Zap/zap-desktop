import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import styled from 'styled-components'
import { variant } from 'styled-system'
import { Spinner } from 'components/UI'
import Circle from 'components/Icon/Circle'

const indicatorStyle = variant({ key: 'statuses' })
const StyledStatusIndicator = styled(Box)(indicatorStyle)

/**
 * @render react
 * @name StatusIndicator
 * @example
 * <StatusIndicator variant="online" />
 */
const StatusIndicator = ({ variant, ...rest }) => (
  <StyledStatusIndicator variant={variant} {...rest}>
    {['loading'].includes(variant) ? <Spinner size="0.7em" /> : <Circle width="0.7em" />}
  </StyledStatusIndicator>
)
StatusIndicator.propTypes = {
  variant: PropTypes.string
}

export default StatusIndicator
