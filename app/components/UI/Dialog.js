import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Box } from 'rebass'
import X from 'components/Icon/X'
import Button from './Button'
import Heading from './Heading'

const CloseButton = ({ onClick }) => (
  <Flex justifyContent="space-between" color="primaryText">
    <Box
      css={{ height: '32px', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }}
      ml="auto"
      onClick={onClick}
      p={2}
      px={10}
    >
      <X width={15} height={15} />
    </Box>
  </Flex>
)

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

const createButtons = buttons =>
  buttons.map((entry, index) => (
    <Button key={entry.name} variant={index === 0 ? 'primary' : 'normal'} onClick={entry.onClick}>
      {entry.name}
    </Button>
  ))

const Dialog = ({ header, onClose, buttons, width, children }) => {
  // check if buttons is a descriptive array  or a React renderable node
  const buttonsLayout = React.isValidElement(buttons) ? buttons : createButtons(buttons)

  // check if header is a string or a React renderable node
  const headerLayout = React.isValidElement(buttons) ? (
    header
  ) : (
    <Heading.h2 mb={4}>{header}</Heading.h2>
  )

  return (
    <Card
      bg="primaryColor"
      width={width}
      borderRadius={5}
      boxShadow="0 3px 4px 0 rgba(0, 0, 0, 0.5)"
    >
      <CloseButton onClick={onClose} />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        alignSelf="stretch"
        pb={4}
      >
        <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
          {headerLayout}
          {children}
        </Flex>

        <Flex
          flexDirection="row"
          alignSelf="stretch"
          justifyContent="space-evenly"
          pl={6}
          pr={6}
          mt={4}
        >
          {buttonsLayout}
        </Flex>
      </Flex>
    </Card>
  )
}

Dialog.defaultProps = {
  width: 550
}

Dialog.propTypes = {
  header: PropTypes.node.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
  buttons: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired
      })
    )
  ]).isRequired
}

export default Dialog
