import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass'
import X from 'components/Icon/X'
import ZapLogo from 'components/Icon/ZapLogo'
import { Panel, Text } from 'components/UI'
import messages from './messages'

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

  componentDidMount() {
    document.addEventListener('keydown', this.closeOnEscape)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.closeOnEscape)
  }

  closeOnEscape = e => {
    const { onClose } = this.props

    if (e.key === 'Escape' && onClose) {
      onClose()
    }
  }

  render() {
    const { children, onClose, withClose, withHeader, ...rest } = this.props
    return (
      <Panel
        width={1}
        css={{
          'z-index': '999',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}
        bg="primaryColor"
        color="primaryText"
      >
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
                onClick={() => window.Zap.openHelpPage()}
              >
                <FormattedMessage {...messages.help} />
              </Text>
            </Flex>
          )}
        </Panel.Header>
        <Panel.Body
          px={4}
          pb={4}
          {...rest}
          css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}
        >
          {' '}
          {children}
        </Panel.Body>
      </Panel>
    )
  }
}

export default Modal
