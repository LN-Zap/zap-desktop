import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Button } from 'components/UI'

const ActionBar = ({ isOpen, buttons, ...rest }) => {
  const buttonsLayout = buttons.map((entry, index) => (
    <Button
      key={entry.name}
      variant={index === buttons.length - 1 ? 'normal' : 'secondary'}
      mr={index < buttons.length - 1 ? 6 : 0}
      onClick={entry.onClick}
    >
      {entry.name}
    </Button>
  ))

  return (
    <Flex
      flexDirection="row"
      justifyContent="flex-end"
      bg="secondaryColor"
      pr={5}
      pt={2}
      pb={2}
      {...rest}
    >
      {buttonsLayout}
    </Flex>
  )
}

ActionBar.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
    })
  ).isRequired
}

export default ActionBar
