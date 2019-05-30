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

export const ModalHeader = styled(Panel.Header)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`

const ModalLogo = ({ hasLogo }) => (
  <Flex justifyContent="space-between" px={3}>
    {hasLogo && (
      <Box color="primaryText">
        <ZapLogo height="32px" width="70px" />
      </Box>
    )}
  </Flex>
)

ModalLogo.propTypes = {
  hasLogo: PropTypes.bool,
}

ModalLogo.defaultProps = {
  hasLogo: true,
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
        <ModalHeader pt={3} px={3}>
          {hasClose && <CloseButton onClick={onClose} />}
          {hasLogo && <ModalLogo hasLogo={hasLogo} />}
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
