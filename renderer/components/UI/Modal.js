import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Flex } from 'rebass'
import CloseButton from 'components/UI/CloseButton'
import ZapLogo from 'components/Icon/ZapLogo'
import Panel from './Panel'
import Page from './Page'

export const ModalOverlayStyles = () => `
  z-index: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

export const ModalHeader = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  pointer-events: none;
`

export const ModalCloseWrapper = styled(Box)`
  pointer-events: auto;
  display: inline-block;
`

const ModalLogo = () => (
  <Box color="primaryText" m={2}>
    <ZapLogo height="32px" width="70px" />
  </Box>
)

const ModalClose = ({ onClick }) => (
  <ModalCloseWrapper color="primaryText">
    <CloseButton onClick={onClick} />
  </ModalCloseWrapper>
)

ModalClose.propTypes = {
  onClick: PropTypes.func,
}

/**
 * @name Modal
 * @param {*} props Props
 * @returns {*} Component
 */
const Modal = props => {
  const { children, onClose, hasClose, hasLogo, ...rest } = props

  return (
    <Panel bg="primaryColor" color="primaryText">
      {(hasClose || hasLogo) && (
        <ModalHeader justifyContent={hasLogo ? 'space-between' : 'flex-end'} pt={3} px={3}>
          {hasLogo && <ModalLogo />}
          {hasClose && <ModalClose onClick={onClose} />}
        </ModalHeader>
      )}
      <Page {...rest}>{children}</Page>
    </Panel>
  )
}

Modal.propTypes = {
  children: PropTypes.node,
  hasClose: PropTypes.bool,
  hasLogo: PropTypes.bool,
  onClose: PropTypes.func,
}

Modal.defaultProps = {
  hasClose: true,
}

export default Modal
