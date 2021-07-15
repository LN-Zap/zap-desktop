import React, { useState, useCallback } from 'react'

import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import styled, { ThemeProvider } from 'styled-components'

import { Modal, ModalOverlayStyles } from 'components/UI'
import { useOnKeydown } from 'hooks'

const Container = styled(animated.div)`
  ${ModalOverlayStyles}
`

const ModalContent = ({ modalDefinitions, type, onClose, isAnimating }) => {
  const { component, render, theme } = modalDefinitions[type]

  if (!component && !render) {
    return null
  }

  const props = { isAnimating, type }
  const renderContent = () => (
    <Modal onClose={onClose}>
      {component ? React.createElement(component, props) : render(props)}
    </Modal>
  )

  return theme ? <ThemeProvider theme={theme}>{renderContent()}</ThemeProvider> : renderContent()
}

ModalContent.propTypes = {
  isAnimating: PropTypes.bool,
  modalDefinitions: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

const getItems = item => item.id

/**
 * ModalStack - Render modals from the modal stack.
 *
 * @param {{ modals, closeModal }} props Props
 * @returns {Node} Node
 */
function ModalStack(props) {
  const { modals, closeModal, modalDefinitions } = props
  useOnKeydown('Escape', closeModal)
  const [isAnimating, setIsAnimating] = useState(false)

  const onStart = useCallback(() => setIsAnimating(true), [setIsAnimating])
  const onRest = useCallback(() => setIsAnimating(false), [setIsAnimating])
  const relevantModals = modals.filter(modal => modalDefinitions[modal.type])
  return (
    Boolean(relevantModals.length) && (
      <Transition
        enter={{ opacity: 1, pointerEvents: 'auto' }}
        from={{ opacity: 0, pointerEvents: 'auto' }}
        items={relevantModals}
        keys={getItems}
        leave={{ opacity: 0, pointerEvents: 'none' }}
        onRest={onRest}
        onStart={onStart}
      >
        {modal =>
          modal &&
          /* eslint-disable react/display-name */
          (styles => (
            <Container style={styles}>
              <ModalContent
                isAnimating={isAnimating}
                modalDefinitions={modalDefinitions}
                onClose={() => closeModal(modal.id)}
                type={modal.type}
              />
            </Container>
          ))
        }
      </Transition>
    )
  )
}

ModalStack.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalDefinitions: PropTypes.object.isRequired,
  modals: PropTypes.array.isRequired,
}

export default ModalStack
