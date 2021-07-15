import React from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import styled from 'styled-components'

import { Button } from 'components/UI'

const StyledButton = styled(Button)`
  color: ${props => (props.active ? themeGet('colors.primaryAccent') : null)};
  &:hover {
    color: ${themeGet('colors.primaryAccent')};
  }
`

const IconDropdownButton = ({ onToggle, isActive, isOpen, hint, Icon }) => {
  return (
    <StyledButton
      className="hint--bottom-left"
      data-hint={isOpen ? null : hint}
      onClick={onToggle}
      size="small"
      variant="secondary"
    >
      <Box color={isActive ? 'primaryAccent' : undefined}>
        <Icon height="16px" width="16px" />
      </Box>
    </StyledButton>
  )
}

IconDropdownButton.propTypes = {
  hint: PropTypes.node,
  Icon: PropTypes.elementType.isRequired,
  isActive: PropTypes.bool,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
}

export default IconDropdownButton
