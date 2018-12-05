import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import FaCircle from 'react-icons/lib/fa/circle'
import styled from 'styled-components'
import { variant } from 'styled-system'
import { Spinner } from 'components/UI'

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
    {variant === 'closing' ? <Spinner /> : <FaCircle size="0.5em" />}
  </StyledStatusIndicator>
)
StatusIndicator.propTypes = {
  variant: PropTypes.string
}

export default StatusIndicator
