import React from 'react'

import PropTypes from 'prop-types'
import { Box, Card } from 'rebass/styled-components'
import styled from 'styled-components'

import Text from './Text'

const StyledTooltipIconBox = styled(Box)`
  border-radius: 50%;
  height: 13px;
  width: 13px;
  position: relative;
  text-align: center;
  z-index: 2;
  &:hover {
    cursor: pointer;
  }
`
StyledTooltipIconBox.displayName = 'TooltipIconBox'

const StyledTooltipWrapper = styled(Card)`
  position: absolute;
  top: -5px;
  width: 225px;
  z-index: 1;
`
StyledTooltipWrapper.displayName = 'TooltipWrapper'

class Tooltip extends React.Component {
  static displayName = 'Tooltip'

  static propTypes = {
    children: PropTypes.node,
  }

  state = { hover: false }

  hoverOn = () => {
    this.setState({ hover: true })
  }

  hoverOff = () => {
    this.setState({ hover: false })
  }

  tooltipIcon = () => {
    const { hover } = this.state

    /* eslint-disable shopify/jsx-no-hardcoded-content */
    return (
      <StyledTooltipIconBox
        bg={hover ? 'primaryText' : 'grey'}
        ml={1}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      >
        <Text color="primaryColor" fontSize="s" fontWeight="bold">
          ?
        </Text>
      </StyledTooltipIconBox>
    )
    /* eslint-enable shopify/jsx-no-hardcoded-content */
  }

  render() {
    const { children, ...rest } = this.props
    const { hover } = this.state

    return (
      <Box sx={{ position: 'relative' }} {...rest}>
        {this.tooltipIcon()}
        {hover && (
          <StyledTooltipWrapper
            bg="secondaryColor"
            p={2}
            pl={3}
            sx={{
              borderRadius: 's',
              boxShadow: 's',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'gray',
            }}
          >
            <Text fontWeight="light" ml={2}>
              {children}
            </Text>
          </StyledTooltipWrapper>
        )}
      </Box>
    )
  }
}

export default Tooltip
