import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import X from 'components/Icon/X'
import ZapLogo from 'components/Icon/ZapLogo'
import { Panel, Text } from 'components/UI'

import messages from './messages'

const ModalCloseButtonWrapper = styled(Box)`
  height: 40px;
  cursor: pointer;
  opacity: 0.6;
  &:hover: {
    opacity: 1;
  }
`

export const ModalOverlayStyles = () => `
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const ModalCloseButton = ({ onClose }) => (
  <Flex justifyContent="flex-end">
    <ModalCloseButtonWrapper onClick={onClose} p={2}>
      <X width={20} height={20} />
    </ModalCloseButtonWrapper>
  </Flex>
)

ModalCloseButton.propTypes = {
  onClose: PropTypes.func
}

const ModalHeader = () => (
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
)

/**
 * @render react
 * @name Modal
 * @example
 * <Modal>Some content</Modal>
 */
function Modal(props) {
  const { children, onClose, withClose, withHeader, ...rest } = props
  return (
    <Panel bg="primaryColor" color="primaryText">
      <Panel.Header pt={3} px={3}>
        {withClose && <ModalCloseButton onClose={onClose} />}
        {withHeader && <ModalHeader />}
      </Panel.Header>
      <Panel.Body px={4} pb={4} {...rest} css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
        {children}
      </Panel.Body>
    </Panel>
  )
}

Modal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  withClose: PropTypes.bool,
  withHeader: PropTypes.bool
}

Modal.defaultProps = {
  withClose: true,
  withHeader: false
}

Modal.displayName = 'Modal'

export default Modal
