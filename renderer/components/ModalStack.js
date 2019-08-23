import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { animated, Transition } from 'react-spring/renderprops.cjs'
import styled from 'styled-components'
import { Modal, ModalOverlayStyles } from 'components/UI'
import { useOnKeydown } from 'hooks'

const Container = styled(animated.div)`
  ${ModalOverlayStyles}
`

const ModalContent = ({ modalDefinitions, type, onClose, isAnimating }) => {
  const component = modalDefinitions[type]
  return (
    component && <Modal onClose={onClose}>{React.cloneElement(component, { isAnimating })}</Modal>
  )
}

ModalContent.propTypes = {
  isAnimating: PropTypes.bool,
  modalDefinitions: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

/**
 * hasContent - Checks whether any of the currently active modals are relevant to the current stack.
 *
 * @param {Array} modals array of currently active modals
 * @param {object} modalDefinitions modal type to React component mapping
 * @returns {boolean} true if any of the currently active modals are relevant to the current stack
 */
function hasContent(modals, modalDefinitions) {
  return Boolean(modals.find(modal => modalDefinitions[modal.type]))
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
  const doCloseModal = useCallback(() => closeModal(), [closeModal])
  useOnKeydown('Escape', doCloseModal)
  const [isAnimating, setIsAnimating] = useState(false)

  const onStart = useCallback(() => setIsAnimating(true), [setIsAnimating])
  const onRest = useCallback(() => setIsAnimating(false), [setIsAnimating])
  return (
    hasContent(modals, modalDefinitions) && (
      <Transition
        enter={{ opacity: 1, pointerEvents: 'auto' }}
        from={{ opacity: 0, pointerEvents: 'auto' }}
        items={modals}
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
                onClose={doCloseModal}
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
  modals: PropTypes.array.isRequired,
}

export default ModalStack
