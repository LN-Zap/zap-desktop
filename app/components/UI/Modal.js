import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import X from 'components/Icon/X'
import ZapLogo from 'components/Icon/ZapLogo'
import Panel from './Panel'

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
      <X height={20} width={20} />
    </ModalCloseButtonWrapper>
  </Flex>
)

ModalCloseButton.propTypes = {
  onClose: PropTypes.func,
}

const ModalHeader = ({ hasHeader }) => (
  <Flex justifyContent="space-between" px={3}>
    {hasHeader && (
      <Box color="primaryText">
        <ZapLogo height="32px" width="70px" />
      </Box>
    )}
  </Flex>
)

ModalHeader.propTypes = {
  hasHeader: PropTypes.bool,
}

ModalHeader.defaultProps = {
  hasHeader: true,
}

/**
 * @render react
 * @name Modal
 * @example
 * <Modal>Some content</Modal>
 */
const Modal = props => {
  const { children, onClose, hasClose, hasHeader, ...rest } = props
  return (
    <Panel bg="primaryColor" color="primaryText">
      <Panel.Header pt={3} px={3}>
        {hasClose && <ModalCloseButton onClose={onClose} />}
        {hasHeader && <ModalHeader hasHeader={hasHeader} />}
      </Panel.Header>
      <Panel.Body pb={4} px={4} {...rest} css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
        {children}
      </Panel.Body>
    </Panel>
  )
}

Modal.propTypes = {
  children: PropTypes.node,
  hasClose: PropTypes.bool,
  hasHeader: PropTypes.bool,
  onClose: PropTypes.func,
}

Modal.defaultProps = {
  hasClose: true,
}

export default Modal
