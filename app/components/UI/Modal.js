import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import X from 'components/Icon/X'
import ZapLogo from 'components/Icon/ZapLogo'
import { Text } from 'components/UI'

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
    const { children, onClose, withClose, withHeader } = this.props
    return (
      <Flex flexDirection="column" width={1} p={3} bg="primaryColor" css={{ height: '100%' }}>
        <Flex flexDirection="column" justifyContent="flex-end" as="header" color="primaryText">
          <Box
            css={{ height: '40px', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }}
            ml="auto"
            onClick={onClose}
            p={2}
          >
            {withClose && <X width={20} height={20} />}
          </Box>

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
        </Flex>
        <Box as="section" p={3} pt={1} css={{ flex: 1 }}>
          {children}
        </Box>
      </Flex>
    )
  }
}

export default Modal
