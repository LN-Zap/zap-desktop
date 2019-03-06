import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Box, Card } from 'rebass'
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
          onMouseEnter={this.hoverOn}
          onMouseLeave={this.hoverOff}
          ml={1}
        >
          <Text fontWeight="bold" color="primaryColor" fontSize="s">
            ?
          </Text>
        </StyledTooltipIconBox>
        {hover && (
          <StyledTooltipWrapper
            bg="secondaryColor"
            p={2}
            pl={3}
            borderRadius={5}
            boxShadow="0 3px 4px 0 rgba(30, 30, 30, 0.5)"
            border="1px solid gray"
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
