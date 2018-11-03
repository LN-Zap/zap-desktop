import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import X from 'components/Icon/X'

/**
 * @render react
 * @name Modal
 * @example
 * <Modal>Some content</Modal>
 */
class Modal extends React.Component {
  static displayName = 'Modal'

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func
  }

  state = {
    hover: false
  }

  hoverOn = () => {
    this.setState({ hover: true })
  }

  hoverOff = () => {
    this.setState({ hover: false })
  }

  render() {
    const { hover } = this.state
    const { children, onClose } = this.props
    return (
      <Flex flexDirection="column" width={1} p={3} bg="darkestBackground" css={{ height: '100%' }}>
        <Flex justifyContent="flex-end" as="header" color="primaryText">
          <Box
            css={{ cursor: 'pointer', opacity: hover ? 0.6 : 1 }}
            ml="auto"
            onClick={onClose}
            onMouseEnter={this.hoverOn}
            onMouseLeave={this.hoverOff}
            p={2}
          >
            <X width="2em" height="2em" />
          </Box>
        </Flex>
        <Box as="section" p={2} css={{ flex: 1 }}>
          {children}
        </Box>
      </Flex>
    )
  }
}

export default Modal
