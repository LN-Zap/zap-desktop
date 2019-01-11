import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex, Box } from 'rebass'
import { Heading, Button } from 'components/UI'
import X from 'components/Icon/X'

const CloseButton = ({ onClick }) => (
  <Flex justifyContent="space-between" color="primaryText">
    <Box
      css={{ height: '40px', cursor: 'pointer', opacity: 0.6, '&:hover': { opacity: 1 } }}
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

const Dialog = ({ caption, onClose, buttons }) => {
  const buttonsLayout = buttons.map((entry, index) => (
    <Button key={entry.name} variant={index === 0 ? 'primary' : 'normal'} onClick={entry.onClick}>
      {entry.name}
    </Button>
  ))

  return (
    <Card bg="secondaryColor" width={550} borderRadius={5}>
      <CloseButton onClick={onClose} />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        alignSelf="stretch"
        pt={30}
        pb={60}
      >
        <Heading.h2 mb={40}>{caption}</Heading.h2>
        <Flex flexDirection="row" alignSelf="stretch" justifyContent="space-evenly" pl={40} pr={40}>
          {buttonsLayout}
        </Flex>
      </Flex>
    </Card>
  )
}

Dialog.propTypes = {
  caption: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ).isRequired
}

export default Dialog
