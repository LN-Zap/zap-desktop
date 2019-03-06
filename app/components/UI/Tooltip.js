import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Box, Text } from 'rebass'

const StyledTooltipIconBox = styled(Box)`
  border-radius: 50%;
  height: 13px;
  line-height: 13px;
  margin-left: 5px;
  position: relative;
  text-align: center;
  width: 13px;
  z-index: 2;

  &:hover {
    cursor: pointer;
  }
`
StyledTooltipIconBox.displayName = 'TooltipIconBox'

const StyledTooltipWrapper = styled(Box)`
  border: 1px solid white;
  border-radius: 4px;
  padding: 5px 5px 5px 25px;
  position: absolute;
  top: -5px;
  width: 225px;
  z-index: 1;
`
StyledTooltipWrapper.displayName = 'TooltipWrapper'

/**
 * @render react
 * @name Tooltip
 * @example
 * <Tooltip>Some explanation text here</Tooltip>
 */
class Tooltip extends React.Component {
  static displayName = 'Tooltip'

  static propTypes = {
    children: PropTypes.node
  }

  state = { hover: false }

  hoverOn = () => {
    this.setState({ hover: true })
  }

  hoverOff = () => {
    this.setState({ hover: false })
  }

  render() {
    const { children, ...rest } = this.props
    const { hover } = this.state

    return (
      <Box
        style={{
          position: 'relative'
        }}
        {...rest}
      >
        <StyledTooltipIconBox
          bg="primaryText"
          color="primaryColor"
          onMouseEnter={this.hoverOn}
          onMouseLeave={this.hoverOff}
        >
          <Text fontWeight="bold">?</Text>
        </StyledTooltipIconBox>
        {hover && (
          <StyledTooltipWrapper bg="secondaryColor">
            <Text fontWeight="light">{children}</Text>
          </StyledTooltipWrapper>
        )}
      </Box>
    )
  }
}

export default Tooltip
