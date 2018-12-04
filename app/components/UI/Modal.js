import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import X from 'components/Icon/X'
import ZapLogo from 'components/Icon/ZapLogo'
import { Panel, Text } from 'components/UI'

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
    onClose: PropTypes.func,
    withClose: PropTypes.bool,
    withHeader: PropTypes.bool
  }

  static defaultProps = {
    withClose: true,
    withHeader: false
  }

  render() {
    const { children, onClose, withClose, withHeader, ...rest } = this.props
    return (
      <Panel width={1} bg="primaryColor" color="primaryText">
        <Panel.Header p={3}>
          <Flex justifyContent="space-between">
            <Box
              css={{ height: '40px', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }}
              ml="auto"
              onClick={onClose}
              p={2}
            >
              {withClose && <X width={20} height={20} />}
            </Box>
          </Flex>
          {withHeader && (
            <Flex justifyContent="space-between" px={3}>
              <Box color="primaryText">
                <ZapLogo width="70px" height="32px" />
              </Box>
              <Text
                fontWeight="normal"
                css={{ cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }}
              >
                Need Help?
              </Text>
            </Flex>
          )}
        </Panel.Header>
        <Panel.Body px={4} pb={4} {...rest}>
          {' '}
          {children}
        </Panel.Body>
      </Panel>
    )
  }
}

export default Modal
