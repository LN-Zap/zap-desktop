import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import { useCloseOnUnmount, useOnKeydown } from 'hooks'

import Button from './Button'
import Card from './Card'
import CloseButton from './CloseButton'
import Heading from './Heading'

const createButtons = buttons =>
  buttons.map((entry, index) => (
    <Button key={entry.name} onClick={entry.onClick} variant={index === 0 ? 'primary' : 'normal'}>
      {entry.name}
    </Button>
  ))

const Dialog = ({ header, onClose, buttons, width, children }) => {
  useCloseOnUnmount(onClose)
  useOnKeydown('Escape', onClose)

  // check if buttons is a descriptive array  or a React renderable node
  const buttonsLayout = React.isValidElement(buttons) ? buttons : createButtons(buttons)

  // check if header is a string or a React renderable node
  const headerLayout = React.isValidElement(header) ? (
    header
  ) : (
    <Heading.H2 mb={4}>{header}</Heading.H2>
  )

  return (
    <Card width={width}>
      <CloseButton onClick={onClose} size="s" />
      <Flex
        alignItems="center"
        alignSelf="stretch"
        flexDirection="column"
        justifyContent="center"
        pb={4}
        px={5}
      >
        <Flex alignItems="center" flexDirection="column" justifyContent="flex-start">
          {headerLayout}
          {children}
        </Flex>

        <Flex
          alignSelf="stretch"
          flexDirection="row"
          justifyContent="space-evenly"
          mt={4}
          pl={6}
          pr={6}
        >
          {buttonsLayout}
        </Flex>
      </Flex>
    </Card>
  )
}

Dialog.defaultProps = {
  width: 550,
}

Dialog.propTypes = {
  buttons: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.node.isRequired,
        onClick: PropTypes.func.isRequired,
      })
    ),
  ]).isRequired,
  children: PropTypes.node,
  header: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
}

export default Dialog
