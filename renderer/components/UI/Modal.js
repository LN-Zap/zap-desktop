import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import CloseButton from 'components/UI/CloseButton'
import ZapLogo from 'components/Icon/ZapLogo'
import Panel from './Panel'

export const ModalOverlayStyles = () => `
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

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
        {hasClose && <CloseButton onClick={onClose} />}
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
