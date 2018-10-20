import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { BackgroundDark } from 'components/UI'
import X from 'components/Icon/X'

/**
 * @render react
 * @name Modal
 * @example
 * <Modal>Some content</Modal>
 */
class Modal extends React.PureComponent {
  static displayName = 'Modal'

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { children } = this.props
    return (
      <Box css={{ height: '100vh' }}>
        <BackgroundDark p={2} css={{ height: '100%' }}>
          <Flex justifyContent="flex-end">
            <X width="2em" height="2em" />
          </Flex>
          <Box m={3}>{children}</Box>
        </BackgroundDark>
      </Box>
    )
  }
}

export default Modal
